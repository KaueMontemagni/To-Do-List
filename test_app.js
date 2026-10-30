/**
 * ==============================================================================
 * TESTES AUTOMATIZADOS DA APLICAÇÃO DE LISTA DE TAREFAS
 * Utiliza o test runner nativo do Node.js (node:test e node:assert)
 * ==============================================================================
 */

const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Simulação leve e fiel do ambiente do Navegador (DOM + LocalStorage)
function criarAmbienteNavegador() {
  const elementos = new Map();
  const storage = new Map();
  let alertMensagem = null;

  class ElementoSimulado {
    constructor(tag) {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.listeners = {};
      this.className = "";
      this.textContent = "";
      this.innerHTMLVal = "";
      this.style = {};
      this.value = "";
      this.checked = false;
      this.type = "";
      this.attributes = {};
    }

    get innerHTML() {
      return this.innerHTMLVal;
    }

    set innerHTML(val) {
      this.innerHTMLVal = val;
      if (val === "") {
        this.children = [];
      }
    }

    appendChild(child) {
      this.children.push(child);
      return child;
    }

    addEventListener(evento, callback) {
      if (!this.listeners[evento]) {
        this.listeners[evento] = [];
      }
      this.listeners[evento].push(callback);
    }

    dispatchEvent(evento, dados = {}) {
      if (this.listeners[evento]) {
        this.listeners[evento].forEach((cb) => cb(dados));
      }
    }

    setAttribute(nome, valor) {
      this.attributes[nome] = valor;
    }

    focus() {
      this.focado = true;
    }
  }

  // Elementos fixos da página
  const ids = [
    "input-nova-tarefa",
    "btn-adicionar",
    "lista-tarefas",
    "mensagem-vazia",
    "contador-total",
    "contador-concluidas"
  ];

  ids.forEach((id) => {
    const el = new ElementoSimulado("div");
    el.id = id;
    elementos.set(id, el);
  });

  const documentSimulado = {
    getElementById(id) {
      return elementos.get(id) || null;
    },
    createElement(tag) {
      return new ElementoSimulado(tag);
    }
  };

  const localStorageSimulado = {
    getItem(chave) {
      return storage.has(chave) ? storage.get(chave) : null;
    },
    setItem(chave, valor) {
      storage.set(chave, String(valor));
    },
    clear() {
      storage.clear();
    }
  };

  return {
    document: documentSimulado,
    localStorage: localStorageSimulado,
    alert(msg) {
      alertMensagem = msg;
    },
    getUltimoAlert() {
      return alertMensagem;
    },
    resetAlert() {
      alertMensagem = null;
    }
  };
}

describe("Suite de Testes da Lista de Tarefas", () => {
  let env;
  let contextoApp;

  beforeEach(() => {
    env = criarAmbienteNavegador();

    // Carrega o código fonte do script.js dentro do contexto isolado
    const codigoScript = fs.readFileSync(path.join(__dirname, "script.js"), "utf8");

    // Cria uma sandbox para executar o script com nossos objetos simulados
    const vm = require("node:vm");
    contextoApp = {
      document: env.document,
      localStorage: env.localStorage,
      alert: env.alert,
      Date: Date,
      JSON: JSON,
      console: console
    };

    vm.createContext(contextoApp);
    vm.runInContext(codigoScript, contextoApp);
  });

  test("1. Inicialização: deve iniciar com lista vazia e mensagem visível", () => {
    const listaTarefas = env.document.getElementById("lista-tarefas");
    const mensagemVazia = env.document.getElementById("mensagem-vazia");
    const contadorTotal = env.document.getElementById("contador-total");
    const contadorConcluidas = env.document.getElementById("contador-concluidas");

    assert.equal(listaTarefas.children.length, 0);
    assert.equal(mensagemVazia.style.display, "block");
    assert.equal(contadorTotal.textContent, 0);
    assert.equal(contadorConcluidas.textContent, 0);
  });

  test("2. Validação: não deve adicionar tarefa vazia e deve exibir alerta", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const btnAdicionar = env.document.getElementById("btn-adicionar");
    const listaTarefas = env.document.getElementById("lista-tarefas");

    // Tentativa com campo vazio
    input.value = "   ";
    btnAdicionar.dispatchEvent("click");

    assert.equal(listaTarefas.children.length, 0);
    assert.match(env.getUltimoAlert(), /digite uma descrição/i);
  });

  test("3. Adicionar: deve adicionar tarefa clicando no botão e como PENDENTE", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const btnAdicionar = env.document.getElementById("btn-adicionar");
    const listaTarefas = env.document.getElementById("lista-tarefas");
    const contadorTotal = env.document.getElementById("contador-total");
    const mensagemVazia = env.document.getElementById("mensagem-vazia");

    input.value = "Estudar JavaScript";
    btnAdicionar.dispatchEvent("click");

    // Verifica se foi adicionada
    assert.equal(listaTarefas.children.length, 1);
    assert.equal(input.value, "", "O campo de entrada deve ser limpo");
    assert.equal(contadorTotal.textContent, 1);
    assert.equal(mensagemVazia.style.display, "none");

    // Verifica estrutura visual da tarefa
    const itemLi = listaTarefas.children[0];
    assert.ok(itemLi.className.includes("item-tarefa"));
    assert.ok(itemLi.className.includes("pendente"), "Nova tarefa deve ter a classe 'pendente'");
    assert.ok(!itemLi.className.includes("concluida"), "Nova tarefa não deve ser 'concluida'");

    // Verifica o badge de status
    const areaAcoes = itemLi.children[1];
    const badge = areaAcoes.children[0];
    assert.ok(badge.className.includes("badge-pendente"));
    assert.equal(badge.textContent, "Pendente");
  });

  test("4. Adicionar via teclado: deve adicionar ao pressionar a tecla Enter", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const listaTarefas = env.document.getElementById("lista-tarefas");

    input.value = "Praticar algoritmos";
    input.dispatchEvent("keydown", { key: "Enter" });

    assert.equal(listaTarefas.children.length, 1);
    const corpo = listaTarefas.children[0].children[0];
    const textoSpan = corpo.children[1];
    assert.equal(textoSpan.textContent, "Praticar algoritmos");
  });

  test("5. Concluir tarefa: alternar checkbox deve atualizar status para CONCLUÍDA", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const btnAdicionar = env.document.getElementById("btn-adicionar");
    const listaTarefas = env.document.getElementById("lista-tarefas");
    const contadorConcluidas = env.document.getElementById("contador-concluidas");

    input.value = "Comprar pão";
    btnAdicionar.dispatchEvent("click");

    // Pega o checkbox do item criado
    let itemLi = listaTarefas.children[0];
    let corpo = itemLi.children[0];
    let checkbox = corpo.children[0];

    // Simula clique no checkbox para concluir
    checkbox.dispatchEvent("change");

    // Após alternar, a lista é re-renderizada
    itemLi = listaTarefas.children[0];
    corpo = itemLi.children[0];
    checkbox = corpo.children[0];
    const areaAcoes = itemLi.children[1];
    const badge = areaAcoes.children[0];

    assert.equal(checkbox.checked, true);
    assert.ok(itemLi.className.includes("concluida"), "Item deve ter a classe 'concluida'");
    assert.ok(badge.className.includes("badge-concluida"), "Badge deve ter classe 'badge-concluida'");
    assert.equal(badge.textContent, "✓ Concluída");
    assert.equal(contadorConcluidas.textContent, 1, "Contador de concluídas deve ser 1");

    // Simula desmarcar a tarefa (voltar para pendente)
    checkbox.dispatchEvent("change");
    itemLi = listaTarefas.children[0];
    const badgeVolta = itemLi.children[1].children[0];

    assert.ok(itemLi.className.includes("pendente"), "Deve voltar a ser 'pendente'");
    assert.equal(badgeVolta.textContent, "Pendente");
    assert.equal(contadorConcluidas.textContent, 0, "Contador de concluídas deve voltar a 0");
  });

  test("6. Concluir via clique no texto da atividade", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const btnAdicionar = env.document.getElementById("btn-adicionar");
    const listaTarefas = env.document.getElementById("lista-tarefas");

    input.value = "Ler 1 capítulo de livro";
    btnAdicionar.dispatchEvent("click");

    // Clica no span do texto
    let itemLi = listaTarefas.children[0];
    let spanTexto = itemLi.children[0].children[1];
    spanTexto.dispatchEvent("click");

    // Verifica se concluiu
    itemLi = listaTarefas.children[0];
    assert.ok(itemLi.className.includes("concluida"));
    assert.equal(itemLi.children[1].children[0].textContent, "✓ Concluída");
  });

  test("7. Remover tarefa: deve excluir da lista e atualizar contadores", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const btnAdicionar = env.document.getElementById("btn-adicionar");
    const listaTarefas = env.document.getElementById("lista-tarefas");
    const contadorTotal = env.document.getElementById("contador-total");
    const mensagemVazia = env.document.getElementById("mensagem-vazia");

    input.value = "Tarefa para deletar";
    btnAdicionar.dispatchEvent("click");
    assert.equal(listaTarefas.children.length, 1);

    // Clica no botão de remover (×)
    const itemLi = listaTarefas.children[0];
    const btnRemover = itemLi.children[1].children[1];
    btnRemover.dispatchEvent("click");

    assert.equal(listaTarefas.children.length, 0);
    assert.equal(contadorTotal.textContent, 0);
    assert.equal(mensagemVazia.style.display, "block", "Mensagem vazia deve reaparecer");
  });

  test("8. Persistência: dados devem ser salvos no LocalStorage", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const btnAdicionar = env.document.getElementById("btn-adicionar");

    input.value = "Tarefa que deve persistir";
    btnAdicionar.dispatchEvent("click");

    const salvo = env.localStorage.getItem("minhas_tarefas");
    assert.ok(salvo !== null, "Deveria haver dados no LocalStorage");

    const arraySalvo = JSON.parse(salvo);
    assert.equal(arraySalvo.length, 1);
    assert.equal(arraySalvo[0].texto, "Tarefa que deve persistir");
    assert.equal(arraySalvo[0].concluida, false);
  });

  test("9. Segurança: deve prevenir injeção de HTML/scripts (XSS)", () => {
    const input = env.document.getElementById("input-nova-tarefa");
    const btnAdicionar = env.document.getElementById("btn-adicionar");
    const listaTarefas = env.document.getElementById("lista-tarefas");

    const textoPerigoso = "<script>alert('hack')</script>";
    input.value = textoPerigoso;
    btnAdicionar.dispatchEvent("click");

    const spanTexto = listaTarefas.children[0].children[0].children[1];
    // Garante que o texto foi gravado com textContent puro, e não interpretado como HTML
    assert.equal(spanTexto.textContent, textoPerigoso);
  });
});
