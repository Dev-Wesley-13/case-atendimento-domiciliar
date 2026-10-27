import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { format } from 'prettier';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFile(path.join(root, name), 'utf8');
const profile = JSON.parse(await read('content/perfil.json'));
const deliveries = JSON.parse(await read('content/contribuicoes.json'));
const content = await read('content/case-study.md');
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const contact =
  '<a href="mailto:' +
  profile.email +
  '">E-mail</a><a href="' +
  profile.github +
  '">GitHub</a><a href="' +
  profile.linkedin +
  '">LinkedIn</a>';
const ids = ['contexto', 'profissionais', 'backend', 'web', 'mobile', 'trabalho', 'glossario'];
const sections = content
  .trim()
  .split(/^## /m)
  .filter(Boolean)
  .map((part, i) => {
    const nl = part.indexOf('\n');
    return { id: ids[i], title: part.slice(0, nl).trim(), markdown: part.slice(nl).trim() };
  });
if (sections.length !== 7 || !sections.every((s) => s.id))
  throw new Error('Estrutura editorial inválida.');
const demos = {
  profissionais: 'portal',
  backend: 'calendar',
  web: 'dashboard',
  mobile: 'clinical',
};
const demoId = {
  profissionais: 'demonstracao-portal',
  backend: 'demonstracao-sessoes',
  web: 'demonstracao-dashboard',
  mobile: 'demonstracao-mobile',
};
const mount = (type, id = '') =>
  '<div ' +
  (id ? 'id="' + id + '" ' : '') +
  'data-visual-demo="' +
  type +
  '"><p>Ative JavaScript para explorar esta simulação com dados fictícios.</p></div>';
const navLabels = [
  'Contexto e autoria',
  'Portal profissional',
  'Backend',
  'Dashboard',
  'Mobile',
  'Qualidade e produção',
  'Glossário e evolução',
];
const navigation =
  sections.map((s, i) => '<a href="#' + s.id + '">' + navLabels[i] + '</a>').join('') +
  '<a href="#catalogo">Catálogo complementar</a>';
let publication = '';
if (profile.siteUrl) {
  const url = new URL(profile.siteUrl);
  if (url.protocol !== 'https:' || url.search || url.hash || !url.pathname.endsWith('/'))
    throw new Error('siteUrl deve ser HTTPS, terminada em / e sem busca ou fragmento.');
  publication =
    '<link rel="canonical" href="' +
    escape(url.href) +
    '"><meta property="og:url" content="' +
    escape(url.href) +
    '"><meta property="og:image" content="' +
    escape(new URL('assets/og-cover.png', url).href) +
    '"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">';
}
function head(title, description, canonical = false) {
  return (
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#173f36"><meta name="description" content="' +
    escape(description) +
    '"><title>' +
    escape(title) +
    '</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="' +
    escape(title) +
    '"><meta property="og:description" content="' +
    escape(description) +
    '">' +
    (canonical ? publication : '') +
    '<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="demonstracoes.css">'
  );
}
const highlights = [
  [
    'profissionais',
    'Portal profissional',
    'Da ideia à aplicação integrada',
    'Criação individual para manter cada resposta ligada à demanda escolhida.',
  ],
  [
    'backend',
    'Backend',
    'Sessões calculadas pelo sistema',
    'Automatização das regras e fim do retrabalho mensal de corrigir quantidades.',
  ],
  [
    'web',
    'Dashboard',
    'Análise de captação no painel',
    'Indicadores adotados no lugar dos gráficos preparados manualmente.',
  ],
  [
    'mobile',
    'Mobile',
    'Registros que chegam à operação',
    'Aplicativo, API e painel conectados para acompanhar informações clínicas.',
  ],
];
const intro =
  '<section class="hero" aria-labelledby="titulo"><div class="hero-copy"><p class="professional-role">' +
  escape(profile.name) +
  ' · ' +
  escape(profile.role) +
  '</p><h1 id="titulo">Backend, web<br>e mobile.</h1><p class="hero-lead">Desenvolvimento de uma plataforma de atendimento domiciliar.</p><p class="hero-stack">Node.js · AdonisJS · React · React Native · TypeScript</p><p class="hero-description">Desde fevereiro de 2026, implemento regras de negócio, interfaces e integrações em uma equipe de dois desenvolvedores, com participação nas entregas em produção.</p><div class="hero-actions"><a class="button" href="#profissionais">Explorar minhas entregas</a><a class="text-link" href="assets/case-wesley-fonseca.pdf">Ler o PDF</a></div><nav class="contact-links" aria-label="Contatos profissionais">' +
  contact +
  '</nav></div><aside class="hero-aside" aria-label="Contexto do trabalho"><p class="aside-kicker">Um produto real, em evolução</p><dl class="project-facts"><div><dt>Papel</dt><dd>Full stack freelancer</dd></div><div><dt>Equipe</dt><dd>2 desenvolvedores</dd></div><div><dt>Ecossistema</dt><dd>5 produtos conectados</dd></div><div><dt>Período</dt><dd>Fev/2026 até o presente</dd></div></dl><p class="revision">Revisão de ' +
  profile.revised.split('-').reverse().join('/') +
  '<br>Atualização mensal do case</p></aside></section><section class="impact-overview" aria-label="Quatro frentes de atuação">' +
  highlights
    .map(
      ([id, label, title, text]) =>
        '<a href="#' +
        id +
        '"><span>' +
        label +
        '</span><strong>' +
        title +
        '</strong><p>' +
        text +
        '</p></a>',
    )
    .join('') +
  '</section><aside class="identity-note"><p>Case de experiência profissional, com identidade da empresa omitida. As demonstrações são independentes e utilizam dados fictícios.</p><a href="demonstracoes.html">Abrir a galeria interativa</a></aside>';
const body = sections
  .map((s) => {
    let html = marked.parse(s.markdown);
    if (demos[s.id]) html = html.replace('</p>', '</p>' + mount(demos[s.id], demoId[s.id]));
    return (
      '<section class="chapter case-prose" id="' +
      s.id +
      '" aria-labelledby="' +
      s.id +
      '-title"><h2 id="' +
      s.id +
      '-title">' +
      escape(s.title) +
      '</h2>' +
      html +
      '</section>'
    );
  })
  .join('');
const labels = {
  back: 'Backend',
  web: 'Web',
  mobile: 'Mobile',
  integracoes: 'Integrações',
  qualidade: 'Qualidade',
};
const catalogRows = deliveries
  .map(
    ([id, title, areas, scope]) =>
      '<li id="' +
      id.toLowerCase() +
      '" data-areas="' +
      escape(areas) +
      '"><span class="delivery-id">' +
      id +
      '</span><div class="delivery-title">' +
      escape(title) +
      '<span class="delivery-scope">' +
      escape(scope) +
      '</span></div><span class="delivery-area">' +
      areas
        .split(' ')
        .map((a) => labels[a])
        .join(' · ') +
      '</span></li>',
  )
  .join('');
const catalog =
  '<section class="chapter" id="catalogo"><h2>Contribuições ao longo do projeto.</h2><p>Os 30 grupos incluem trabalhos compartilhados e evoluções de funcionalidades. Eles complementam as quatro histórias.</p><details class="stack-details catalog-details"><summary>Explorar os 30 grupos de contribuições</summary><div class="catalog-controls" hidden><label for="busca">Buscar no catálogo</label><input id="busca" type="search" placeholder="Ex.: sessões, avaliações, integração"><div class="filters" aria-label="Filtrar por área">' +
  Object.entries({ todas: 'Todas', ...labels })
    .map(
      ([key, label]) =>
        '<button type="button" data-filter="' +
        key +
        '" aria-pressed="' +
        (key === 'todas') +
        '">' +
        label +
        '</button>',
    )
    .join('') +
  '</div><p id="catalog-status" role="status" aria-live="polite">30 grupos de contribuições</p><button id="clear-filters" class="inline-button" type="button">Limpar filtros</button></div><p id="empty-state" hidden>Nenhum resultado. Altere a busca ou limpe os filtros.</p><ol class="delivery-list" id="delivery-list">' +
  catalogRows +
  '</ol></details></section>';
const footer =
  '<footer class="footer" id="contato"><div><strong>' +
  escape(profile.name) +
  '</strong><p>Desenvolvedor full stack freelancer</p><a href="mailto:' +
  profile.email +
  '">' +
  profile.email +
  '</a></div><nav class="contact-links" aria-label="Contato e perfis">' +
  contact +
  '</nav><a href="#inicio">Voltar ao início</a></footer>';
const index =
  '<!doctype html><html lang="pt-BR"><head>' +
  head('Wesley Fonseca | Full stack · Node, React e React Native', profile.description, true) +
  '<script src="app.js" defer></script><script src="demo-rules.js" defer></script><script src="demonstracoes.js" defer></script></head><body><a class="skip-link" href="#conteudo">Pular para o conteúdo</a><header class="masthead" id="inicio"><a class="signature" href="#inicio" aria-label="Wesley Fonseca, início"><span class="monogram" aria-hidden="true">W.</span><span>Wesley Fonseca<small>Desenvolvimento full stack</small></span></a><a class="text-link header-download" href="assets/case-wesley-fonseca.pdf">Baixar PDF</a></header><main id="conteudo">' +
  intro +
  '<div class="reading-layout"><nav class="index" aria-label="Neste case">' +
  navigation +
  '</nav><div class="chapters">' +
  body +
  catalog +
  '</div></div></main>' +
  footer +
  '</body></html>';
const demoSections = [
  [
    'oportunidades',
    'Respostas independentes',
    'Registre interesse em A e consulte B. A resposta de uma oportunidade não altera a outra.',
    'portal',
  ],
  [
    'calendario',
    'Um calendário que acompanha o mês',
    'Compare os meses e o recorte de datas. Gerar novamente preserva as sessões existentes.',
    'calendar',
  ],
  [
    'captacao',
    'Do filtro aos indicadores',
    'Troque período e contrato. Explore também o cenário sem movimento.',
    'dashboard',
  ],
  [
    'clinico',
    'Do aplicativo ao painel',
    'Salve um registro fictício, simule a falta de conexão e reconecte.',
    'clinical',
  ],
];
const gallery =
  '<!doctype html><html lang="pt-BR"><head>' +
  head(
    'Demonstrações | Wesley Fonseca',
    'Quatro demonstrações independentes com dados fictícios: portal, sessões, dashboard e fluxo clínico.',
  ) +
  '<script src="demo-rules.js" defer></script><script src="demonstracoes.js" defer></script></head><body><a class="skip-link" href="#demos">Pular para as demonstrações</a><main class="demo-gallery"><header class="gallery-intro"><a href="index.html">Voltar ao estudo de caso</a><h1>O trabalho,<br>em movimento.</h1><p>Explore quatro conceitos do case em interfaces criadas para esta apresentação. Todos os dados são fictícios; as ações ficam apenas nesta página.</p><nav class="gallery-nav" aria-label="Demonstrações">' +
  demoSections.map(([id, title]) => '<a href="#' + id + '">' + title + '</a>').join('') +
  '</nav></header><div id="demos">' +
  demoSections
    .map(
      ([id, title, desc, type]) =>
        '<section id="' +
        id +
        '" class="gallery-section"><h2>' +
        title +
        '</h2><p>' +
        desc +
        '</p>' +
        mount(type) +
        '</section>',
    )
    .join('') +
  '</div><a href="index.html">Ler o case completo</a></main></body></html>';
const catalogMarkdown =
  '\n## Catálogo complementar\n\n' +
  deliveries
    .map(([id, title, , scope]) => '- **' + id + ' · ' + title + ':** ' + scope)
    .join('\n') +
  '\n';
const full =
  '# Wesley Fonseca - Desenvolvimento full stack\n\n**Freelancer · Fevereiro de 2026 até o presente**\n\nNode.js · AdonisJS · React · React Native · TypeScript\n\n[GitHub](' +
  profile.github +
  ') · [LinkedIn](' +
  profile.linkedin +
  ') · [E-mail](mailto:' +
  profile.email +
  ')\n\nCase de experiência profissional, com identidade da empresa omitida e demonstrações independentes com dados fictícios.\n\n' +
  content +
  catalogMarkdown;
let readme = await read('src/README.template.md');
readme = readme
  .replaceAll('{{SITE}}', profile.siteUrl ? '[Abrir o site](' + profile.siteUrl + ') · ' : '')
  .replaceAll(
    '{{STATUS}}',
    profile.siteUrl
      ? ''
      : 'A publicação web ainda está em preparação. Explore o pacote localmente com os comandos acima.',
  );
await fs.mkdir(path.join(root, '.build'), { recursive: true });
await fs.writeFile(
  path.join(root, '.build/pdf.json'),
  JSON.stringify({ profile, sections, deliveries }, null, 2),
);
for (const [name, text] of Object.entries({
  'index.html': index,
  'demonstracoes.html': gallery,
  'CASE-STUDY.md': full,
  'README.md': readme,
})) {
  await fs.writeFile(
    path.join(root, name),
    await format(text, {
      parser: name.endsWith('.html') ? 'html' : 'markdown',
      printWidth: 95,
      proseWrap: 'preserve',
    }),
  );
}
for (const name of [
  'styles.css',
  'demonstracoes.css',
  'app.js',
  'demonstracoes.js',
  'demo-rules.js',
]) {
  await fs.writeFile(
    path.join(root, name),
    await format(await read('src/' + name), {
      parser: name.endsWith('.css') ? 'css' : 'babel',
      singleQuote: true,
      printWidth: 95,
    }),
  );
}
const manifest = [
  'index.html',
  'demonstracoes.html',
  'styles.css',
  'demonstracoes.css',
  'app.js',
  'demonstracoes.js',
  'demo-rules.js',
  'CASE-STUDY.md',
  'README.md',
  'ATUALIZACOES.md',
  '.nojekyll',
  'assets/favicon.svg',
  'assets/og-cover.png',
  'assets/case-wesley-fonseca.pdf',
];
await fs.writeFile(
  path.join(root, 'deploy-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log('Build concluído: relato único, catálogo estático e quatro demonstrações.');
