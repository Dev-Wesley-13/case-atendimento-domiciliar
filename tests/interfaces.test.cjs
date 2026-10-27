const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');

function demo(type) {
  // No resource loading or navigation: only the portfolio's local scripts run.
  const dom = new JSDOM('<!doctype html><div data-visual-demo="' + type + '"></div>', {
    runScripts: 'outside-only',
  });
  for (const file of ['demo-rules.js', 'demonstracoes.js'])
    dom.window.eval(fs.readFileSync(path.join(root, 'src', file), 'utf8'));
  const el = (key) => dom.window.document.querySelector('[data-ui="' + key + '"]');
  return { dom, el, close: () => dom.window.close() };
}

test('interface do calendário recalcula o mês e não gera duplicatas', () => {
  const { dom, el, close } = demo('calendar');
  try {
    assert.equal(el('expected').textContent, '8');
    el('month').value = '5';
    el('month').dispatchEvent(new dom.window.Event('change'));
    assert.equal(el('expected').textContent, '9');
    el('generate').click();
    el('generate').click();
    assert.equal(el('existing').textContent, '9');
    assert.equal(el('missing').textContent, '0');
    el('retro').checked = false;
    el('retro').dispatchEvent(new dom.window.Event('change'));
    assert.equal(el('expected').textContent, '6');
  } finally {
    close();
  }
});

test('filtros do dashboard atualizam os indicadores e o estado vazio', () => {
  const { dom, el, close } = demo('dashboard');
  try {
    el('contract').value = 'aurora';
    el('contract').dispatchEvent(new dom.window.Event('change'));
    assert.deepEqual(
      [...el('metrics').querySelectorAll('strong')].map((n) => n.textContent),
      ['60', '34', '20'],
    );
    el('contract').value = 'novo';
    el('contract').dispatchEvent(new dom.window.Event('change'));
    assert.deepEqual(
      [...el('metrics').querySelectorAll('strong')].map((n) => n.textContent),
      ['0', '0', '0'],
    );
    assert.match(el('feedback').textContent, /Nenhuma demanda/);
  } finally {
    close();
  }
});

test('interface preserva respostas independentes e reinicia o portal', () => {
  const { el, close } = demo('portal');
  try {
    el('accept').click();
    el('offer-b').click();
    assert.equal(el('accept').disabled, false);
    assert.equal(el('status').textContent, 'A: interesse simulado · B: sem resposta');
    el('reset').click();
    assert.equal(el('status').textContent, 'A: sem resposta · B: sem resposta');
  } finally {
    close();
  }
});

test('interface clínica sincroniza após reconexão e trata o registro como texto', () => {
  const { dom, el, close } = demo('clinical');
  try {
    el('connection').click();
    el('record').value = '<img src=x onerror=alert(1)> exemplo fictício';
    el('form').dispatchEvent(
      new dom.window.Event('submit', { bubbles: true, cancelable: true }),
    );
    assert.equal(el('result').hidden, true);
    assert.match(el('sync').textContent, /aguardando conexão/);
    el('connection').click();
    assert.equal(el('result').hidden, false);
    assert.equal(el('panel-record').textContent, el('record').value);
    assert.equal(el('panel-record').querySelector('img'), null);
    assert.equal(el('version').textContent, 'Atualização demonstrativa 1');
    el('reset').click();
    assert.equal(el('result').hidden, true);
    assert.equal(el('connection').getAttribute('aria-pressed'), 'false');
  } finally {
    close();
  }
});

test('página gerada mantém relatos, contatos e catálogo sem executar JavaScript', () => {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll('#delivery-list > li').length, 30);
    assert.equal(doc.querySelectorAll('[data-visual-demo]').length, 4);
    assert.equal(doc.querySelector('a[href="mailto:wesleydev13@gmail.com"]') !== null, true);
    assert.match(doc.querySelector('#profissionais').textContent, /Idealizei e criei/);
    assert.equal(doc.querySelector('.catalog-controls').hidden, true);
  } finally {
    dom.window.close();
  }
});
