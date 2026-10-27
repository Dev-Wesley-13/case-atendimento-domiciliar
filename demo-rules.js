/* Rules for independent portfolio examples. No client code or production data. */
var DemoRules = (() => {
  'use strict';

  function calcularSessoes({ ano, mes, diasSemana, aPartirDoDia = 1, existentes = [] }) {
    if (
      !Number.isInteger(ano) ||
      ano < 1900 ||
      ano > 9999 ||
      !Number.isInteger(mes) ||
      mes < 1 ||
      mes > 12
    ) {
      throw new RangeError('Ano ou mês inválido.');
    }
    const ultimoDia = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
    if (
      !Array.isArray(diasSemana) ||
      !diasSemana.length ||
      diasSemana.some((d) => !Number.isInteger(d) || d < 0 || d > 6)
    ) {
      throw new RangeError('Informe dias da semana de 0 a 6.');
    }
    if (
      !Number.isInteger(aPartirDoDia) ||
      aPartirDoDia < 1 ||
      aPartirDoDia > ultimoDia + 1 ||
      !Array.isArray(existentes) ||
      existentes.some((d) => !Number.isInteger(d) || d < 1 || d > ultimoDia)
    ) {
      throw new RangeError('Recorte ou datas existentes inválidos.');
    }
    const dias = new Set(diasSemana);
    const salvas = new Set(existentes);
    const previstas = [];
    for (let dia = aPartirDoDia; dia <= ultimoDia; dia++) {
      if (dias.has(new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay())) previstas.push(dia);
    }
    return {
      previstas,
      criadas: previstas.filter((d) => salvas.has(d)),
      pendentes: previstas.filter((d) => !salvas.has(d)),
    };
  }

  function registrarInteresse(estado, oportunidade) {
    if (!Object.hasOwn(estado, oportunidade)) throw new RangeError('Oportunidade inválida.');
    return { ...estado, [oportunidade]: true };
  }

  function criarFluxo() {
    return { online: true, pendente: null, painel: null, versao: 0 };
  }

  function salvarRegistro(estado, registro) {
    const campos = ['content', 'goal', 'conduct'];
    if (
      !registro ||
      campos.some((k) => typeof registro[k] !== 'string' || !registro[k].trim()) ||
      registro.content.trim().length > 240
    )
      throw new TypeError('Registro demonstrativo inválido.');
    const copia = Object.fromEntries(campos.map((k) => [k, registro[k].trim()]));
    return estado.online
      ? { ...estado, pendente: null, painel: copia, versao: estado.versao + 1 }
      : { ...estado, pendente: copia };
  }

  function mudarConexao(estado, online) {
    if (typeof online !== 'boolean') throw new TypeError('Conexão inválida.');
    if (online && estado.pendente) {
      return {
        ...estado,
        online,
        painel: { ...estado.pendente },
        pendente: null,
        versao: estado.versao + 1,
      };
    }
    return { ...estado, online };
  }

  return Object.freeze({
    calcularSessoes,
    registrarInteresse,
    criarFluxo,
    salvarRegistro,
    mudarConexao,
  });
})();
if (typeof module !== 'undefined' && module.exports) module.exports = DemoRules;
