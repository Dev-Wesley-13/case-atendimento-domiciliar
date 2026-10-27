# Wesley Fonseca - Desenvolvimento full stack

**Freelancer · Fevereiro de 2026 até o presente**

Node.js · AdonisJS · React · React Native · TypeScript

[GitHub](https://github.com/Dev-Wesley-13) · [LinkedIn](https://www.linkedin.com/in/wesley-rafael-054256242) · [E-mail](mailto:wesleydev13@gmail.com)

Case de experiência profissional, com identidade da empresa omitida e demonstrações independentes com dados fictícios.

## Contexto e responsabilidades

Atuo desde fevereiro de 2026 como desenvolvedor full stack freelancer em uma plataforma de atendimento domiciliar. Em uma equipe de dois desenvolvedores, implemento funcionalidades no backend, no painel web, no aplicativo e nos portais que conectam a operação aos profissionais de saúde.

A empresa atendida capta e gerencia profissionais para atendimentos domiciliares. O sistema organiza demandas, profissionais, sessões e informações de faturamento. Uma entrega pode atravessar os cinco produtos: backend, painel administrativo, aplicativo, portal profissional e portal de contratos.

Comecei pelos fluxos de atendimento e ampliei minha atuação para código, integrações e produção. Participo das reuniões com a empresa atendida, do planejamento semanal, dos testes e da documentação.

### Como se divide minha responsabilidade

- **Portal profissional:** idealizei e criei individualmente a aplicação, desde o repositório até sua integração e implantação. Os serviços do backend integram um ecossistema desenvolvido em dupla.
- **Dashboard de captação:** implementei consultas, endpoints e visualizações, reaproveitando a base do dashboard de monitoramento criada pelo colega.
- **Backend e mobile:** implementei e evoluí funcionalidades em módulos compartilhados, conforme os recortes descritos neste case.
- **Qualidade e operação:** realizei testes, documentação, configuração de ambientes, deploys, dumps de banco e distribuição de aplicações. A pipeline original de CI/CD do backend foi implementada pelo colega.

## Portal profissional: uma resposta para cada demanda

Idealizei e criei o portal profissional para preservar o contexto de cada oportunidade de atendimento enviada ao profissional.

### Problema e decisão

Um mesmo profissional pode receber duas ou mais demandas. A plataforma de mensagens sobrescrevia os campos a cada disparo: mesmo ao tentar responder à primeira mensagem, ele podia acabar aceitando a demanda mais recente.

A solução foi incluir, na mensagem de abordagem, um link para o portal com o contexto daquela demanda. Um **magic link** é um link com uma credencial de acesso; nesse fluxo, sua validação permite abrir a oportunidade correspondente. A integração utiliza autenticação por token opaco.

### O que implementei

Criei o repositório e a aplicação, desenvolvi as telas, integrei o portal ao backend e aos fluxos de abordagem e configurei sua hospedagem e domínio. Também implementei e evoluí a busca de demandas e a manifestação de interesse.

### Resultado e aprendizado

No início, observei uma queda no retorno dos profissionais durante a adaptação. Hoje o portal é utilizado com frequência e não observamos mais o problema original de respostas vinculadas à demanda errada.

Esse resultado é qualitativo; ainda não consolidei uma série de dados sobre a taxa de resposta. A entrega mostrou que resolver a consistência técnica também exige acompanhar a adaptação de quem usa o produto.

**Tecnologias:** React, TypeScript, integração com API, magic links e tokens opacos.

## Backend: cálculo de sessões e consistência das regras

Implementei correções e evoluções no cálculo de sessões em um backend compartilhado pela operação e pelos profissionais.

### Problema

A quantidade de sessões era selecionada manualmente na criação do planejamento. A escolha não acompanhava as diferenças entre os meses: uma frequência de duas vezes por semana podia exigir oito ou nove sessões. O sistema acabava gerando atendimentos a mais ou a menos, além de datas retroativas indevidas na criação do planejamento.

Uma sessão excedente poderia ser realizada e gerar pagamento ao profissional sem o recebimento correspondente pela empresa.

### O que implementei

Em colaboração com o outro desenvolvedor, implementei o cálculo automático no backend, considerando as regras de frequência por dia, semana e mês. O sistema passou a calcular os atendimentos previstos, os já existentes e os que faltavam criar. Também incluímos a opção de permitir ou não datas retroativas.

Nas integrações, implementei validações de estado e transações para tratar respostas repetidas ou concorrentes. Outras entregas incluem preservação do histórico na sincronização, sessões extras, substituições, faturamento pela data realizada, histórico de valores e frequências e correções de fuso horário.

### Resultado e validação

O cálculo automático eliminou o retrabalho mensal de corrigir a quantidade de sessões nos planejamentos. No acompanhamento que fizemos, o problema original de datas a mais ou a menos não voltou a ocorrer. Houve ajustes pontuais e melhorias nas semanas seguintes à implantação.

Estudamos as regras, testamos localmente, verificamos o comportamento em produção e validamos a entrega com a equipe operacional.

**Tecnologias:** Node.js, TypeScript, AdonisJS, Lucid e PostgreSQL. O ambiente também utiliza Redis para cache e pg-boss com PostgreSQL para jobs.

## Dashboard: da planilha à análise no sistema

Desenvolvi o dashboard de captação, conectando consultas e endpoints aos indicadores, gráficos e filtros do painel.

### Problema

A equipe alimentava uma planilha diariamente e preparava manualmente os dados dos gráficos usados na análise mensal. Os gráficos já atendiam parte da necessidade; o objetivo foi trazer esse acompanhamento para o sistema.

### O que implementei

Implementei consultas e endpoints no backend e componentes no frontend, com filtros, paginação e exportação. Reaproveitei a base do dashboard de monitoramento e ajustei a entrega a partir das apresentações à equipe operacional.

Também investiguei consultas sem cache, controle de concorrência, índices do banco e tratamento de falhas na interface. A investigação atravessou frontend, API e banco de dados.

### Resultado e validação

Após a entrega, a equipe deixou de utilizar os gráficos manuais e passou a analisar o desempenho e acompanhar o mês pelo dashboard.

Conferimos os indicadores dado a dado com a planilha, executamos testes do backend e validamos o resultado com a equipe operacional.

Minha atuação web também inclui notificações, históricos, formulários, responsividade e faturamento. No portal de contratos, implementei melhorias de cache de consultas, atualização de dados, timeline e apresentação de propostas.

**Tecnologias:** React, TypeScript, Vite, Tailwind CSS, TanStack Query e ECharts.

## Mobile: do registro ao acompanhamento clínico

Implementei e ajustei avaliações, formulários e apresentação de dados para conectar os registros dos profissionais no aplicativo ao acompanhamento no painel web.

### Problema

A empresa buscava complementar a gestão da quantidade de atendimentos com informações sobre a evolução clínica do paciente. Para isso, precisava coletar dados no aplicativo e disponibilizá-los à equipe operacional.

### O que implementei e como o fluxo se conecta

Trabalhei nas avaliações, no perfil assistencial, nos formulários e nas escalas, além de corrigir comportamentos de teclado, campos numéricos e apresentação dos dados. Várias entregas exigiram alterações no aplicativo, backend e painel.

No fluxo atual, o profissional registra o quadro e o plano de cuidado de sua especialidade, com metas, condutas e frequência recomendada. As avaliações variam conforme especialidade e faixa etária, incluindo informações de funcionalidade e, na enfermagem, sinais vitais, mobilidade, nutrição e integridade da pele.

O backend valida respostas, calcula escores e mantém os vínculos com paciente, profissional, data e versão do instrumento. O painel reúne registros por especialidade e evolução ao longo dos meses. A história clínica e o perfil assistencial também são consultáveis no aplicativo como informações de leitura. Essa estrutura resulta do trabalho da equipe, com requisitos assistenciais definidos pela empresa atendida.

### Resultado e adoção

A empresa passou a reunir os registros dos profissionais em uma visão clínica do paciente, complementando o serviço oferecido. A equipe operacional validou a ferramenta, deu retorno positivo e começou a utilizá-la imediatamente.

Enviamos um comunicado aos profissionais pelo BotConversa, orientando o uso e o preenchimento. O resultado descrito é a capacidade de acompanhamento; não foi realizada uma medição de melhora clínica dos pacientes.

### Conectividade e distribuição

Implementei a detecção proativa de conexão com NetInfo sobre uma estrutura offline preexistente, permitindo reconhecer a ausência de rede e reagir à reconexão.

Participei de um ciclo de publicação que exigiu envio às lojas, com experiência nos processos de Google Play e App Store. As atualizações de rotina foram distribuídas por **OTA**, mecanismo de atualização compatível com o aplicativo instalado; mudanças que exigiam novo build seguiam outro ciclo de distribuição.

**Tecnologias:** React Native, Expo, NetInfo, expo-updates e Jest.

## Qualidade, colaboração e produção

Junto ao outro desenvolvedor, participo das reuniões com a empresa atendida, defino prioridades semanais, detalho cards no Trello e divido as tarefas. Utilizamos práticas de Scrum adaptadas à equipe.

Também testamos os fluxos pela perspectiva da operação, documentamos as entregas e acompanhamos seu funcionamento. Minha atuação em produção inclui configuração de ambientes, deploys, dumps de banco, versionamento e publicação de aplicações.

### Stack do ambiente de trabalho

- **Web:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, ECharts e Socket.IO.
- **Backend e dados:** Node.js, AdonisJS, Lucid, PostgreSQL, Redis e pg-boss.
- **Mobile:** React Native, Expo, NetInfo e expo-updates.
- **Integrações:** BotConversa, fluxos de WhatsApp, chatbots, API oficial da Meta por meio da plataforma, magic links e tokens OAT.
- **Qualidade:** Japa, Vitest, Cypress e Jest/jest-expo.
- **Infraestrutura e entrega:** DigitalOcean, Spaces, Vercel, Nginx, PM2, Docker e GitHub Actions.
- **Colaboração:** Git, GitHub e Trello.

A stack descreve o contexto de trabalho. O bloco de responsabilidades e as histórias delimitam minha atuação.

## Glossário e evolução contínua

- **Empresa atendida:** organização para a qual presto o serviço de desenvolvimento como freelancer.
- **Equipe operacional:** pessoas da empresa que usam e validam a plataforma.
- **Demanda:** oportunidade de atendimento a ser associada a um profissional.
- **Planejamento de atendimento:** definição das sessões previstas, frequências e período.
- **Magic link:** link com uma credencial validada para acesso a um contexto específico.
- **OTA:** distribuição de uma atualização compatível com a versão instalada do aplicativo.

Continuo trabalhando no projeto. Atualizo este case mensalmente com novas contribuições, decisões e resultados observados, mantendo separadas a data da entrega e a data de revisão da apresentação.

As contribuições documentadas nesta versão vão de fevereiro a 9 de outubro de 2026. Os resultados foram detalhados posteriormente e a apresentação foi revisada em 17 de outubro de 2026.

## Catálogo complementar

- **E01 · Criação e integração do portal profissional:** Portal idealizado e conduzido individualmente; integração ao ecossistema compartilhado.
- **E02 · Magic link, autenticação e ciclo de acesso:** Implementação e evolução do acesso às demandas.
- **E03 · Manifestação de interesse e busca de demandas:** Backend e portal profissional.
- **E04 · Cache de consultas com TanStack Query:** Contribuições nos portais de profissionais e contratos.
- **E05 · Dashboard de captação e desempenho:** Implementação com reuso da base de monitoramento do colega.
- **E06 · Telas e integração de notificações:** Entrega compartilhada, com base backend do colega.
- **E07 · Histórico de captação:** Contribuições próprias e compartilhadas.
- **E08 · Fluxos e integrações BotConversa:** Evolução dos fluxos em colaboração.
- **E09 · Geração e sincronização de sessões:** Sessões retroativas, extras e preservação do histórico.
- **E10 · Estado do planejamento de atendimento:** Evolução das regras e interfaces.
- **E11 · Substituições de profissionais e auditoria:** Implementações em domínio desenvolvido em colaboração.
- **E12 · Faturamento pela data realizada:** Regras e evolução das telas de faturamento.
- **E13 · Negociação e reenvio de orçamento:** Contribuições próprias e compartilhadas na triagem.
- **E14 · Concorrência nos webhooks de triagem:** Guardas de status, transações e testes relacionados.
- **E15 · Diagnóstico unificado e CID-11:** Integração de dados nas aplicações.
- **E16 · Avaliações clínicas e perfil assistencial:** Implementação dos requisitos nas três plataformas.
- **E17 · Formulários e escalas de avaliação:** Formulários e dados conforme instrumentos do domínio.
- **E18 · Acompanhamento de alertas assistenciais:** Estados, histórico, telas, PDF e testes conforme regras do cliente.
- **E19 · Distribuição de responsabilidades nos fluxos:** Implementação do roteamento de responsabilidades.
- **E20 · Fuso horário e testes de datas:** Correções de comportamento entre ambientes.
- **E21 · Detecção proativa de conexão:** NetInfo sobre base offline preexistente.
- **E22 · Builds, publicação e OTA:** Um ciclo pelas lojas e atualizações de rotina por OTA.
- **E23 · Autocadastro e duplicidades:** Melhorias sobre endpoints e base compartilhados.
- **E24 · Notas do paciente:** Implementação e apresentação das anotações.
- **E25 · Histórico de valores e frequências:** Evolução das informações do planejamento de atendimento.
- **E26 · Evidências em PDF e prorrogação em lote:** Contribuições aos fluxos de operação.
- **E27 · Documentação e padrões BotConversa:** Documentos incorporados; padronização continua em evolução.
- **E28 · Formulários, responsividade e scripts iniciais:** Inclui contribuições em deploy frontend.
- **E29 · CPF, registro profissional e bairros:** Contribuições realizadas no início da atuação.
- **E30 · Compatibilidade de nomenclatura de status:** Correções entre as aplicações.
