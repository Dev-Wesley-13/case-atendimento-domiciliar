# Wesley Fonseca · Case full stack

Backend, web, mobile e integrações em uma plataforma de atendimento domiciliar, desde fevereiro de 2026.

{{SITE}}[Ler o case](CASE-STUDY.md) · [PDF](assets/case-wesley-fonseca.pdf) · [LinkedIn](https://www.linkedin.com/in/wesley-rafael-054256242) · [GitHub](https://github.com/Dev-Wesley-13) · [Contato](mailto:wesleydev13@gmail.com)

![Wesley Fonseca: backend, web e mobile em atendimento domiciliar](assets/og-cover.png)

## Quatro entregas em destaque

- **Portal profissional:** idealização e criação individual da aplicação, integrada ao ecossistema compartilhado.
- **Backend:** automatização do cálculo de sessões e consistência das regras de atendimento.
- **Dashboard:** consultas e visualizações adotadas pela equipe na análise da captação.
- **Mobile:** registros clínicos entre aplicativo, API e painel, conectividade e distribuição.

O relato detalha minhas responsabilidades, as bases reutilizadas e os resultados observados em uma equipe de dois desenvolvedores.

## Stack do trabalho

Node.js, AdonisJS, PostgreSQL, Redis, React, TypeScript, Vite, Tailwind CSS, React Native e Expo, além das integrações e ferramentas descritas no case.

## Explorar o código demonstrativo

Este repositório contém a apresentação e exemplos independentes com dados fictícios. O código dos sistemas do cliente não faz parte do pacote.

A implementação do portfólio utiliza HTML, CSS e JavaScript. Node.js gera as páginas e executa os testes; as demonstrações não dependem de uma API.

- [Cálculo de sessões e regras puras](src/demo-rules.js)
- [Testes das regras e transições](tests/regras.test.cjs)
- [Interfaces das quatro demonstrações](src/demonstracoes.js)
- [Fonte do relato](content/case-study.md)

### Executar localmente

Requer Node.js 22 ou superior.

```sh
npm ci
npm run verify
npm start
```

Abra o endereço local exibido. A galeria fica em `/demonstracoes.html`.

`npm run format:check` verifica a formatação. Os testes cobrem calendário, geração sem duplicação, independência das respostas e reconexão simulada. A integração contínua verifica este portfólio.

{{STATUS}}

[Histórico de revisões](ATUALIZACOES.md) · [Manutenção e publicação](docs/manutencao.md)
