const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calcularSessoes,
  registrarInteresse,
  criarFluxo,
  salvarRegistro,
  mudarConexao,
} = require('../src/demo-rules.js');
const base = { ano: 2026, mes: 5, diasSemana: [2, 4] };

test('duas visitas semanais resultam em oito datas em maio e nove em junho', () => {
  assert.deepEqual(calcularSessoes(base).previstas, [5, 7, 12, 14, 19, 21, 26, 28]);
  assert.deepEqual(
    calcularSessoes({ ...base, mes: 6 }).previstas,
    [2, 4, 9, 11, 16, 18, 23, 25, 30],
  );
});
test('o recorte inclui seu limite e preserva as datas existentes sem duplicação', () => {
  const existentes = Object.freeze([11, 11, 2]);
  const resultado = calcularSessoes({ ...base, mes: 6, aPartirDoDia: 11, existentes });
  assert.deepEqual(resultado.previstas, [11, 16, 18, 23, 25, 30]);
  assert.deepEqual(resultado.criadas, [11]);
  assert.deepEqual(resultado.pendentes, [16, 18, 23, 25, 30]);
  assert.deepEqual(existentes, [11, 11, 2]);
});
test('segunda geração não cria sessões adicionais', () => {
  const primeira = calcularSessoes({ ...base, existentes: [5, 7] });
  const segunda = calcularSessoes({ ...base, existentes: [5, 7, ...primeira.pendentes] });
  assert.deepEqual(segunda.pendentes, []);
  assert.equal(segunda.criadas.length, 8);
});
test('fevereiro bissexto inclui dia 29 e frequência repetida não duplica datas', () => {
  assert.deepEqual(
    calcularSessoes({ ano: 2024, mes: 2, diasSemana: [4, 4] }).previstas,
    [1, 8, 15, 22, 29],
  );
  assert.deepEqual(
    calcularSessoes({ ano: 2025, mes: 2, diasSemana: [4] }).previstas,
    [6, 13, 20, 27],
  );
});
test('recorte após o último dia produz calendário vazio', () => {
  assert.deepEqual(calcularSessoes({ ...base, aPartirDoDia: 32 }).previstas, []);
});
test('entradas inválidas são rejeitadas', () => {
  for (const patch of [
    { mes: 0 },
    { mes: 13 },
    { ano: NaN },
    { diasSemana: [7] },
    { diasSemana: [] },
    { aPartirDoDia: 0 },
    { existentes: [32] },
  ]) {
    assert.throws(() => calcularSessoes({ ...base, ...patch }), RangeError);
  }
});
test('resposta A não altera B nem modifica o estado de entrada', () => {
  const inicial = Object.freeze({ a: false, b: false });
  const a = registrarInteresse(inicial, 'a');
  assert.deepEqual(a, { a: true, b: false });
  assert.deepEqual(registrarInteresse(a, 'a'), a);
  assert.deepEqual(inicial, { a: false, b: false });
  assert.deepEqual(registrarInteresse(a, 'b'), { a: true, b: true });
  assert.throws(() => registrarInteresse(a, '__proto__'), RangeError);
});
const registro = {
  content: 'Exemplo fictício.',
  goal: 'Meta demonstrativa',
  conduct: 'Conduta demonstrativa',
};
test('registro online aparece no painel e é copiado', () => {
  const original = { ...registro };
  const salvo = salvarRegistro(criarFluxo(), original);
  original.content = 'Alterado depois';
  assert.equal(salvo.painel.content, registro.content);
  assert.equal(salvo.versao, 1);
});
test('registro offline aguarda reconexão e é enviado uma única vez', () => {
  const offline = mudarConexao(criarFluxo(), false);
  const salvo = salvarRegistro(offline, registro);
  assert.equal(salvo.painel, null);
  assert.equal(salvo.versao, 0);
  assert.deepEqual(salvo.pendente, registro);
  const online = mudarConexao(salvo, true);
  assert.deepEqual(online.painel, registro);
  assert.equal(online.pendente, null);
  assert.equal(mudarConexao(online, true).versao, 1);
});
test('simulação offline conserva a última edição pendente', () => {
  const primeira = salvarRegistro(mudarConexao(criarFluxo(), false), registro);
  const ultima = salvarRegistro(primeira, { ...registro, content: 'Revisão fictícia.' });
  assert.equal(mudarConexao(ultima, true).painel.content, 'Revisão fictícia.');
  assert.equal(primeira.pendente.content, registro.content);
});
test('registro vazio ou longo demais não altera a fila', () => {
  const estado = criarFluxo();
  assert.throws(() => salvarRegistro(estado, { ...registro, content: '  ' }), TypeError);
  assert.throws(
    () => salvarRegistro(estado, { ...registro, content: 'x'.repeat(241) }),
    TypeError,
  );
  assert.deepEqual(estado, criarFluxo());
});
