# Manutenção e publicação

## Fontes

- Edite o relato em `content/case-study.md`.
- Edite os 30 grupos do catálogo em `content/contribuicoes.json`.
- Edite contatos, datas e URL publicada em `content/perfil.json`.
- Edite scripts e estilos em `src/`; os arquivos homônimos na raiz são gerados.
- O README é uma apresentação curta, não uma cópia do relato.
- `CASE-STUDY.md`, HTML e dados de entrada do PDF são gerados por `npm run build`.

## Atualização mensal

Registre apenas entregas realizadas, preserve créditos e diferencie data da entrega de revisão editorial. Métricas precisam de indicador, período e fonte; números fictícios das demonstrações nunca entram como resultados.

Execute `npm ci`, `npm run format`, `npm run verify` e `npm run format:check`. Regenere o PDF com Python e ReportLab usando `npm run pdf`; confira suas páginas antes de substituir o material publicado. Refaça capturas se as interfaces mudarem.

## Publicação

O repositório é [Dev-Wesley-13/case-atendimento-domiciliar](https://github.com/Dev-Wesley-13/case-atendimento-domiciliar). O endereço configurado em `siteUrl` é [dev-wesley-13.github.io/case-atendimento-domiciliar/](https://dev-wesley-13.github.io/case-atendimento-domiciliar/). O build inclui canonical, og:url e URL absoluta da imagem social a partir desse valor.

O workflow `Publicar o case` verifica o projeto e publica no GitHub Pages após um push em `main`. Ele também permite execução manual. Em Settings → Pages, a origem deve ser GitHub Actions. O job de publicação depende do sucesso do build e dos testes. O comando `npm run stage` prepara um diretório temporário contendo apenas os arquivos do manifesto; dependências e fontes não são incluídas nesse artefato de hospedagem.

Ao atualizar: edite as fontes, gere e confira os arquivos, atualize o PDF se o relato mudar, faça commit e push e acompanhe o workflow até o deploy concluir. A configuração segue a [documentação oficial de workflows do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Publique o conteúdo estático listado em `deploy-manifest.json`. O servidor de desenvolvimento atende somente esse material em 127.0.0.1. Fontes, dependências e documentos de manutenção não precisam ser servidos.

O novo repositório deve receber apenas este pacote público. Documentos de investigação, repositórios privados, ZIPs recebidos e credenciais ficam fora dele.

## Revisão visual antes de publicar

A revisão visual foi retomada em 26/10/2026 no Chrome, com larguras de desktop e celular. As verificações incluíram respostas independentes no portal, calendário sem duplicação, filtros e estado vazio do dashboard e registro sem conexão seguido de sincronização. As larguras de 320 e 390 pixels não apresentaram transbordamento horizontal. Trata-se de emulação de viewport no navegador, não de teste em um aparelho físico. A capa do README é uma peça de apresentação, não uma captura do aplicativo.

## Ferramentas de geração

O gerador utiliza [Marked](https://marked.js.org/) apenas para conteúdo editorial local revisado; não recebe Markdown de visitantes. A formatação utiliza [Prettier](https://prettier.io/docs/install), com versão fixada no lockfile. A implementação de testes DOM executa somente scripts locais em memória, sem carregar recursos de rede; ela não verifica layout.

## PDF

Requer Python 3 e `reportlab`. Instale com `python -m pip install -r requirements-pdf.txt` e execute `npm run pdf`. O gerador utiliza o mesmo relato e catálogo do site. Antes de divulgar, confira o resultado visual, os links e a data. A integração contínua verifica o conteúdo web e as regras demonstrativas; não afirma homologar os sistemas do cliente.
