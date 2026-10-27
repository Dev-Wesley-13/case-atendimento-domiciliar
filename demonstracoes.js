/* Original portfolio illustrations. Synthetic data, in-memory state, no network requests. */
(() => {
  'use strict';
  const pt = new Intl.NumberFormat('pt-BR');
  const frame = (title, subtitle, content, note) =>
    `<div class="visual-demo"><div class="vd-caption"><span class="vd-label">Demonstração independente</span><span>Dados fictícios</span></div><div class="vd-app"><header class="vd-heading"><span class="vd-symbol" aria-hidden="true">+</span><div><h3>${title}</h3><p>${subtitle}</p></div></header>${content}</div><p class="vd-footnote">${note} Interface criada para o portfólio; não é uma captura do produto real.</p></div>`;
  const by = (root, key) => root.querySelector(`[data-ui="${key}"]`);

  function calendar(root) {
    root.innerHTML = frame(
      'Planejamento de atendimentos',
      'A frequência permanece. O calendário muda.',
      `
      <div class="vd-toolbar"><label>Mês do exemplo<select data-ui="month"><option value="4">Maio de 2026</option><option value="5">Junho de 2026</option></select></label><div class="vd-frequency"><strong>2 vezes por semana</strong><span>Terças e quintas</span></div></div>
      <label class="vd-check"><input data-ui="retro" type="checkbox" checked> Incluir datas anteriores ao dia 10</label>
      <div class="vd-planning"><div><div class="vd-calendar" data-ui="calendar" role="img"></div><div class="vd-legend"><span><i class="vd-dot saved"></i>Já criada</span><span><i class="vd-dot planned"></i>A criar</span><span><i class="vd-dot skipped"></i>Fora do recorte</span></div></div><aside class="vd-plan-summary"><dl><div><dt>Previstas no recorte</dt><dd data-ui="expected"></dd></div><div><dt>Já criadas</dt><dd data-ui="existing"></dd></div><div><dt>Faltam criar</dt><dd data-ui="missing"></dd></div></dl><button class="vd-primary" data-ui="generate" type="button">Simular geração</button><button class="vd-reset" data-ui="reset" type="button">Reiniciar calendário</button></aside></div>
      <p class="vd-feedback" data-ui="feedback" role="status" aria-live="polite"></p>`,
      'Exemplo simplificado com dias fixos. Ilustra contagem, datas retroativas e geração sem duplicação; não reproduz todas as regras do backend.',
    );
    const month = by(root, 'month');
    const retro = by(root, 'retro');
    let created = new Set();
    const calculation = (cutoff = 1) =>
      DemoRules.calcularSessoes({
        ano: 2026,
        mes: Number(month.value) + 1,
        diasSemana: [2, 4],
        aPartirDoDia: cutoff,
        existentes: [...created],
      });
    const scheduled = () => calculation().previstas;
    const eligible = () => calculation(retro.checked ? 1 : 10).previstas;
    function render(message) {
      const m = Number(month.value),
        all = scheduled(),
        dates = eligible();
      const offset = (new Date(Date.UTC(2026, m, 1)).getUTCDay() + 6) % 7;
      const total = new Date(Date.UTC(2026, m + 1, 0)).getUTCDate();
      const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      let cells =
        labels.map((day) => `<span class="vd-weekday">${day}</span>`).join('') +
        '<span></span>'.repeat(offset);
      for (let d = 1; d <= total; d++) {
        const state = dates.includes(d)
          ? created.has(d)
            ? 'saved'
            : 'planned'
          : all.includes(d)
            ? 'skipped'
            : '';
        cells += `<span class="vd-day ${state}" aria-hidden="true">${d}</span>`;
      }
      by(root, 'calendar').innerHTML = cells;
      by(root, 'calendar').setAttribute(
        'aria-label',
        `${month.selectedOptions[0].textContent}. Datas previstas: ${dates.join(', ')}. Datas já criadas: ${dates.filter((d) => created.has(d)).join(', ') || 'nenhuma'}.`,
      );
      const existing = dates.filter((d) => created.has(d)).length;
      by(root, 'expected').textContent = dates.length;
      by(root, 'existing').textContent = existing;
      by(root, 'missing').textContent = dates.length - existing;
      by(root, 'feedback').textContent =
        message ||
        `${dates.length} sessões previstas neste recorte. O total é recalculado para o mês selecionado.`;
    }
    function reset() {
      created = new Set(eligible().slice(0, 2));
      render();
    }
    month.addEventListener('change', reset);
    retro.addEventListener('change', reset);
    by(root, 'generate').addEventListener('click', () => {
      const pending = calculation(retro.checked ? 1 : 10).pendentes;
      pending.forEach((d) => created.add(d));
      render(
        pending.length
          ? `${pending.length} sessões criadas na simulação. Execute novamente: as datas já existentes são preservadas.`
          : 'Nenhuma nova sessão: todas as datas deste recorte já foram criadas.',
      );
    });
    by(root, 'reset').addEventListener('click', reset);
    reset();
  }

  function dashboard(root) {
    root.innerHTML = frame(
      'Captação em perspectiva',
      'Um recorte do mês para orientar a operação.',
      `
      <div class="vd-toolbar"><label>Período<select data-ui="period"><option value="out">Outubro de 2026</option><option value="set">Setembro de 2026</option></select></label><label>Contrato demonstrativo<select data-ui="contract"><option value="all">Todos os contratos</option><option value="aurora">Contrato Aurora</option><option value="horizonte">Contrato Horizonte</option><option value="novo">Contrato sem movimento</option></select></label></div>
      <div class="vd-metrics" data-ui="metrics"></div>
      <div class="vd-dashboard-body"><section class="vd-chart-panel"><h4>Distribuição das demandas</h4><p class="vd-subtitle">Situação no cenário selecionado</p><div class="vd-bars" data-ui="bars"></div></section><section class="vd-chart-panel"><h4>Composição do volume</h4><p class="vd-subtitle">Novas demandas e substituições</p><div class="vd-composition" data-ui="composition"></div></section></div>
      <p class="vd-feedback" data-ui="feedback" role="status" aria-live="polite"></p>`,
      'Troque o período ou contrato. Os indicadores são calculados sobre uma base fictícia criada para esta demonstração e não representam resultados da empresa.',
    );
    const data = {
      out: { aurora: [12, 8, 34, 6, 42], horizonte: [8, 6, 21, 5, 28], novo: [0, 0, 0, 0, 0] },
      set: { aurora: [9, 7, 27, 7, 36], horizonte: [6, 4, 16, 4, 22], novo: [0, 0, 0, 0, 0] },
    };
    function render() {
      const period = by(root, 'period'),
        contract = by(root, 'contract');
      const rows =
        contract.value === 'all'
          ? Object.values(data[period.value])
          : [data[period.value][contract.value]];
      const values = rows.reduce((sum, row) => sum.map((n, i) => n + row[i]), [0, 0, 0, 0, 0]);
      const total = values.slice(0, 4).reduce((a, b) => a + b, 0);
      const metrics = [
        ['Demandas recebidas', total, 'no recorte demonstrativo'],
        ['Autorizadas', values[2], 'prontas para a próxima etapa'],
        ['Em aberto ou análise', values[0] + values[1], 'para acompanhamento'],
      ];
      by(root, 'metrics').innerHTML = metrics
        .map(
          ([label, n, help]) =>
            `<div><span>${label}</span><strong>${pt.format(n)}</strong><small>${help}</small></div>`,
        )
        .join('');
      const states = ['Aberta', 'Em análise', 'Autorizada', 'Cancelada'];
      by(root, 'bars').innerHTML = states
        .map(
          (label, i) =>
            `<div class="vd-bar-row"><span>${label}</span><div class="vd-track"><i class="vd-bar tone-${i}" style="width:${total ? (values[i] / total) * 100 : 0}%"></i></div><strong>${values[i]}</strong></div>`,
        )
        .join('');
      const share = total ? Math.round((values[4] / total) * 100) : 0;
      by(root, 'composition').innerHTML =
        `<div class="vd-ring" style="--portion:${share}%" role="img" aria-label="${values[4]} novas demandas e ${total - values[4]} substituições"><span><strong>${total ? share + '%' : '—'}</strong><small>novas demandas</small></span></div><dl><div><dt>Novas</dt><dd>${values[4]}</dd></div><div><dt>Substituições</dt><dd>${total - values[4]}</dd></div></dl>`;
      by(root, 'feedback').textContent = total
        ? `${period.selectedOptions[0].textContent} · ${contract.selectedOptions[0].textContent}: ${total} demandas fictícias. Todos os indicadores acompanham os filtros.`
        : 'Nenhuma demanda neste cenário. Selecione outro contrato para explorar os indicadores.';
    }
    by(root, 'period').addEventListener('change', render);
    by(root, 'contract').addEventListener('change', render);
    render();
  }

  function clinical(root) {
    root.innerHTML = frame(
      'Do atendimento ao painel',
      'O mesmo registro, em dois momentos da operação.',
      `
      <div class="vd-clinical-toolbar"><button class="vd-secondary" data-ui="connection" type="button" aria-pressed="false">Simular modo sem conexão</button><button class="vd-reset" data-ui="reset" type="button">Reiniciar fluxo</button></div>
      <div class="vd-clinical-grid"><div class="vd-phone"><div class="vd-phone-top"><span>Aplicativo demonstrativo</span><span class="vd-online" data-ui="network">Conectado</span></div><div class="vd-phone-body"><p class="vd-patient">Pessoa demonstrativa 01</p><h4>Acompanhamento clínico</h4><div class="vd-specialty">Fisioterapia</div><form data-ui="form"><label>Quadro atual<textarea data-ui="record" rows="3" maxlength="240" required>Registro fictício de acompanhamento. Exemplo de evolução descrita pelo profissional.</textarea></label><label>Meta do plano de cuidado<select data-ui="goal"><option>Acompanhar mobilidade</option><option>Acompanhar autonomia</option><option>Reavaliar plano de cuidado</option></select></label><label>Conduta registrada<select data-ui="conduct"><option>Manter acompanhamento planejado</option><option>Revisar objetivos na próxima visita</option></select></label><button class="vd-primary" type="submit">Salvar registro demonstrativo</button></form><p class="vd-sync" data-ui="sync" role="status" aria-live="polite">Pronto para simular o envio.</p></div></div><div class="vd-clinical-destination"><ol class="vd-pipeline" aria-label="Caminho do registro"><li data-ui="step-app">Aplicativo</li><li data-ui="step-api">API simulada</li><li data-ui="step-panel">Painel</li></ol><section class="vd-record-panel"><div class="vd-record-heading"><h4>Painel de acompanhamento</h4><span data-ui="badge">Sem registro</span></div><p class="vd-patient">Pessoa demonstrativa 01 · Fisioterapia</p><div data-ui="empty" class="vd-empty"><span aria-hidden="true">↳</span><h5>O registro aparece aqui.</h5><p>Salve no aplicativo para acompanhar o percurso. Sem conexão simulada, ele aguarda a reconexão.</p></div><div data-ui="result" hidden><dl class="vd-clinical-record"><div><dt>Quadro atual</dt><dd data-ui="panel-record"></dd></div><div><dt>Meta</dt><dd data-ui="panel-goal"></dd></div><div><dt>Conduta</dt><dd data-ui="panel-conduct"></dd></div></dl><div class="vd-record-meta"><span>Autor: profissional fictício</span><span data-ui="version"></span></div></div></section><p class="vd-mini-note">A API e a fila são simuladas nesta página. Nenhum dado é enviado ou mantido após recarregar.</p></div></div>`,
      'Experimente ficar sem conexão, salvar e reconectar. O protótipo ilustra o fluxo sobre uma base offline preexistente no projeto, sem executar avaliações ou decisões clínicas.',
    );
    let state = DemoRules.criarFluxo();
    function render() {
      const offline = !state.online;
      by(root, 'connection').textContent = offline
        ? 'Reconectar e sincronizar'
        : 'Simular modo sem conexão';
      by(root, 'connection').setAttribute('aria-pressed', String(offline));
      by(root, 'network').textContent = offline ? 'Sem conexão' : 'Conectado';
      by(root, 'network').classList.toggle('offline', offline);
      by(root, 'empty').hidden = Boolean(state.painel);
      by(root, 'result').hidden = !state.painel;
      by(root, 'badge').textContent = state.pendente
        ? 'Envio pendente'
        : state.painel
          ? 'Atualizado'
          : 'Sem registro';
      if (state.painel) {
        by(root, 'panel-record').textContent = state.painel.content;
        by(root, 'panel-goal').textContent = state.painel.goal;
        by(root, 'panel-conduct').textContent = state.painel.conduct;
        by(root, 'version').textContent = 'Atualização demonstrativa ' + state.versao;
      }
      by(root, 'step-app').classList.toggle(
        'complete',
        Boolean(state.pendente || state.painel),
      );
      ['step-api', 'step-panel'].forEach((k) =>
        by(root, k).classList.toggle('complete', Boolean(state.painel && !state.pendente)),
      );
      by(root, 'sync').textContent = state.pendente
        ? 'Registro aguardando conexão. A simulação conserva a última versão em memória.'
        : state.painel
          ? 'Registro sincronizado com o painel demonstrativo.'
          : 'Pronto para simular o envio.';
    }
    by(root, 'connection').addEventListener('click', () => {
      state = DemoRules.mudarConexao(state, !state.online);
      render();
    });
    by(root, 'form').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = by(root, 'record');
      if (!input.value.trim()) {
        input.setCustomValidity('Descreva o registro demonstrativo.');
        input.reportValidity();
        return;
      }
      input.setCustomValidity('');
      state = DemoRules.salvarRegistro(state, {
        content: input.value.trim(),
        goal: by(root, 'goal').value,
        conduct: by(root, 'conduct').value,
      });
      render();
    });
    by(root, 'record').addEventListener('input', () =>
      by(root, 'record').setCustomValidity(''),
    );
    by(root, 'reset').addEventListener('click', () => {
      state = DemoRules.criarFluxo();
      by(root, 'form').reset();
      by(root, 'record').setCustomValidity('');
      render();
    });
    render();
  }

  function portal(root) {
    root.innerHTML = frame(
      'Uma resposta para cada oportunidade',
      'O contexto acompanha a escolha do profissional.',
      `
      <div class="vd-message"><span>Mensagem demonstrativa</span><p>Você recebeu uma nova oportunidade de atendimento. Acesse os detalhes para responder.</p><small>Na operação real, o acesso passa pela validação do magic link. Aqui, nenhum token é gerado.</small></div>
      <div class="vd-offers"><button type="button" data-ui="offer-a" aria-pressed="true"><small>Oportunidade A</small><strong>Região Norte</strong><span>Fisioterapia · 2 visitas por semana</span></button><button type="button" data-ui="offer-b" aria-pressed="false"><small>Oportunidade B</small><strong>Região Sul</strong><span>Fisioterapia · 1 visita por semana</span></button></div>
      <div class="vd-offer-action"><p data-ui="selected">Respondendo à oportunidade A</p><button class="vd-primary" data-ui="accept" type="button">Simular interesse</button></div><p class="vd-feedback" data-ui="status" role="status" aria-live="polite"></p><button class="vd-reset" data-ui="reset" type="button">Reiniciar oportunidades</button>`,
      'As duas respostas são independentes e temporárias. A demonstração não autentica, envia mensagens ou registra interesse no sistema real.',
    );
    let selected = 'a';
    let state = { a: false, b: false };
    function render() {
      ['a', 'b'].forEach((key) =>
        by(root, `offer-${key}`).setAttribute('aria-pressed', String(key === selected)),
      );
      by(root, 'selected').textContent =
        `Respondendo à oportunidade ${selected.toUpperCase()}`;
      by(root, 'accept').textContent = state[selected]
        ? 'Interesse registrado na simulação'
        : 'Simular interesse';
      by(root, 'accept').disabled = state[selected];
      by(root, 'status').textContent = ['a', 'b']
        .map(
          (key) =>
            `${key.toUpperCase()}: ${state[key] ? 'interesse simulado' : 'sem resposta'}`,
        )
        .join(' · ');
    }
    ['a', 'b'].forEach((key) =>
      by(root, `offer-${key}`).addEventListener('click', () => {
        selected = key;
        render();
      }),
    );
    by(root, 'accept').addEventListener('click', () => {
      state = DemoRules.registrarInteresse(state, selected);
      render();
    });
    by(root, 'reset').addEventListener('click', () => {
      state = { a: false, b: false };
      selected = 'a';
      render();
    });
    render();
  }
  const renderers = { calendar, dashboard, clinical, portal };
  document.querySelectorAll('[data-visual-demo]').forEach((root) => {
    const renderer = renderers[root.dataset.visualDemo];
    if (renderer) renderer(root);
  });
})();
