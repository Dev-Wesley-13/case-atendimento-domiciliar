"""Generate the PDF reading edition from the site's editorial sources."""
from pathlib import Path
import json
import re
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / ".build/pdf.json").read_text(encoding="utf-8"))
profile = data["profile"]
output = ROOT / "assets/case-wesley-fonseca.pdf"
output.parent.mkdir(exist_ok=True)
regular, bold = "Helvetica", "Helvetica-Bold"
for plain_path, bold_path in [
    (Path("C:/Windows/Fonts/arial.ttf"), Path("C:/Windows/Fonts/arialbd.ttf")),
    (Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"), Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")),
]:
    if plain_path.exists() and bold_path.exists():
        pdfmetrics.registerFont(TTFont("CaseSans", str(plain_path)))
        pdfmetrics.registerFont(TTFont("CaseBold", str(bold_path)))
        pdfmetrics.registerFontFamily("CaseSans", normal="CaseSans", bold="CaseBold", italic="CaseSans", boldItalic="CaseBold")
        regular, bold = "CaseSans", "CaseBold"
        break
ink = HexColor("#173f36")
muted = HexColor("#52665d")
body = ParagraphStyle("Body", fontName=regular, fontSize=10.5, leading=15, textColor=ink, spaceAfter=8)
h1 = ParagraphStyle("Title", parent=body, fontName=bold, fontSize=31, leading=36, spaceAfter=18)
h2 = ParagraphStyle("Chapter", parent=body, fontName=bold, fontSize=23, leading=28, spaceAfter=20, keepWithNext=True)
h3 = ParagraphStyle("Section", parent=body, fontName=bold, fontSize=12, leading=17, spaceBefore=10, spaceAfter=7, keepWithNext=True)
small = ParagraphStyle("Small", parent=body, fontSize=9, leading=13, textColor=muted)
bullet = ParagraphStyle("Bullet", parent=body, leftIndent=11, firstLineIndent=-8)
catalog_title = ParagraphStyle("CatalogTitle", parent=h3, fontSize=10, leading=14, spaceBefore=7, spaceAfter=3)

def inline(text):
    text = escape(text.replace("\u2011", "-").replace("\u2014", "-").replace("\u2013", "-"))
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+|mailto:[^)]+)\)", r'<link href="\2" color="#315e7b">\1</link>', text)
    return text

def markdown_blocks(markdown):
    blocks = []
    for block in re.split(r"\n\s*\n", markdown.strip()):
        if block.startswith("### "):
            blocks.append(Paragraph(inline(block[4:]), h3))
        elif block.startswith("- "):
            for line in block.splitlines():
                if line.startswith("- "):
                    blocks.append(Paragraph("- " + inline(line[2:]), bullet))
        else:
            blocks.append(Paragraph(inline(block.replace("\n", " ")), body))
    return blocks

def chrome(c, doc):
    c.saveState()
    w, h = A4
    c.setStrokeColor(HexColor("#b9c4b9"))
    c.line(46, h-40, w-46, h-40)
    c.setFont(regular, 8)
    c.setFillColor(muted)
    c.drawString(46, h-31, "Wesley Fonseca / Desenvolvimento full stack")
    c.drawString(46, 28, "Revisão " + "/".join(reversed(profile["revised"].split("-"))))
    c.drawRightString(w-46, 28, str(doc.page))
    c.restoreState()

story = [
    Spacer(1, 24),
    Paragraph("Wesley Fonseca", h3),
    Paragraph("Backend, web<br/>e mobile.", h1),
    Paragraph("Desenvolvimento full stack em uma plataforma de atendimento domiciliar.", ParagraphStyle("Lead", parent=body, fontSize=17, leading=23, spaceAfter=20)),
    Paragraph("Node.js · AdonisJS · React · React Native · TypeScript", h3),
    Paragraph("Freelancer · Desde fevereiro de 2026<br/>Equipe de dois desenvolvedores · Cinco produtos conectados", body),
    Spacer(1, 12),
]
for title, text in [
    ("Portal profissional", "Idealização e criação individual da aplicação, integrada ao ecossistema compartilhado."),
    ("Backend", "Cálculo automático de sessões e consistência das regras de atendimento."),
    ("Dashboard", "Indicadores adotados pela equipe no lugar dos gráficos preparados manualmente."),
    ("Mobile", "Registros dos profissionais conectados ao acompanhamento no painel."),
]:
    story.append(KeepTogether([Paragraph(title, h3), Paragraph(text, body)]))
story += [
    Spacer(1, 10),
    Paragraph(inline("[E-mail](mailto:"+profile["email"]+") · [GitHub]("+profile["github"]+") · [LinkedIn]("+profile["linkedin"]+")"), body),
    Paragraph(profile["email"], small),
    Paragraph("Experiência profissional com identidade da empresa omitida. As demonstrações do portfólio usam dados fictícios.", small),
]
if profile["siteUrl"]:
    story.append(Paragraph(inline("[Abrir a versão interativa]("+profile["siteUrl"]+")"), body))
for section in data["sections"]:
    story += [PageBreak(), Paragraph(inline(section["title"]), h2)]
    story += markdown_blocks(section["markdown"])
story += [PageBreak(), Paragraph("Catálogo complementar", h2), Paragraph("30 grupos de contribuições, incluindo trabalhos compartilhados e evoluções de funcionalidades existentes.", body)]
for code, title, areas, scope in data["deliveries"]:
    story.append(KeepTogether([Paragraph(inline(code+" · "+title), catalog_title), Paragraph(inline(scope), small)]))
doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=46, leftMargin=46, topMargin=60, bottomMargin=49, title="Wesley Fonseca - Case full stack", author="Wesley Fonseca", subject="Backend, web e mobile em atendimento domiciliar")
doc.build(story, onFirstPage=chrome, onLaterPages=chrome)
print(str(output))
