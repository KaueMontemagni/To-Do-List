/* ==========================================================================
   MINHA LISTA DE TAREFAS - JAVASCRIPT
   Este arquivo contém toda a lógica e interatividade da aplicação.
   Ele é dividido em 4 partes principais:
   1. Seleção de Elementos (buscar o que está no HTML)
   2. Estado da Aplicação (onde os dados são guardados na memória)
   3. Funções Principais (adicionar, concluir, remover, desenhar na tela)
   4. Escutadores de Eventos (reação a cliques e digitação do usuário)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SELEÇÃO DE ELEMENTOS DO HTML (DOM)
   Guardamos em constantes referências aos elementos visuais que vamos manipular.
   -------------------------------------------------------------------------- */
const inputNovaTarefa = document.getElementById("input-nova-tarefa");
const btnAdicionar = document.getElementById("btn-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const mensagemVazia = document.getElementById("mensagem-vazia");
const contadorTotal = document.getElementById("contador-total");
const contadorConcluidas = document.getElementById("contador-concluidas");

/* --------------------------------------------------------------------------
   2. ESTADO DA APLICAÇÃO (DADOS)
   Aqui guardamos as tarefas na memória. Cada tarefa é um objeto com:
   - id: identificador único (número)
   - texto: o texto digitado pelo usuário (string)
   - concluida: se já foi feita ou não (true / false)
   -------------------------------------------------------------------------- */
let tarefas = [];

/* --------------------------------------------------------------------------
   3. PERSISTÊNCIA LOCAL (LOCALSTORAGE)
   Permite que as tarefas continuem salvas mesmo se a página for recarregada.
   -------------------------------------------------------------------------- */
function salvarTarefas() {
  // Converte a lista de objetos para formato de texto JSON e salva no navegador
  localStorage.setItem("minhas_tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  // Busca o texto salvo no navegador e converte de volta para lista de objetos
  const tarefasSalvas = localStorage.getItem("minhas_tarefas");
  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas);
  }
}

/* --------------------------------------------------------------------------
   4. FUNÇÕES DE MANIPULAÇÃO DAS TAREFAS (LÓGICA)
   -------------------------------------------------------------------------- */

/**
 * Adiciona uma nova tarefa à lista a partir do texto digitado no input.
 */
function adicionarTarefa() {
  const texto = inputNovaTarefa.value.trim();

  // Validação: não permite adicionar tarefas vazias
  if (texto === "") {
    alert("Por favor, digite uma descrição para a tarefa.");
    inputNovaTarefa.focus();
    return;
  }

  // Cria um novo objeto representando a tarefa
  const novaTarefa = {
    id: Date.now(), // Usa o timestamp atual como ID único
    texto: texto,
    concluida: false
  };

  // Adiciona a nova tarefa no início da lista
  tarefas.unshift(novaTarefa);

  // Limpa o campo de texto e mantém o foco nele
  inputNovaTarefa.value = "";
  inputNovaTarefa.focus();

  // Salva e atualiza o visual da tela
  salvarTarefas();
  renderizarTarefas();
}

/**
 * Alterna o estado de uma tarefa entre concluída e pendente.
 * @param {number} id - O identificador único da tarefa
 */
function alternarConclusao(id) {
  tarefas = tarefas.map((tarefa) => {
    if (tarefa.id === id) {
      return { ...tarefa, concluida: !tarefa.concluida };
    }
    return tarefa;
  });

  salvarTarefas();
  renderizarTarefas();
}

/**
 * Remove uma tarefa da lista.
 * @param {number} id - O identificador único da tarefa a ser removida
 */
function removerTarefa(id) {
  // Filtra a lista mantendo todas as tarefas, exceto a que tem o ID clicado
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);

  salvarTarefas();
  renderizarTarefas();
}

/* --------------------------------------------------------------------------
   5. RENDERIZAÇÃO (DESENHAR NA TELA)
   Lê o estado atual da lista `tarefas` e constrói o HTML correspondente.
   -------------------------------------------------------------------------- */
function renderizarTarefas() {
  // 1. Limpa o conteúdo atual da lista visual
  listaTarefas.innerHTML = "";

  // 2. Controla a exibição da mensagem de "nenhuma tarefa"
  if (tarefas.length === 0) {
    mensagemVazia.style.display = "block";
  } else {
    mensagemVazia.style.display = "none";
  }

  // 3. Atualiza os contadores
  const concluidas = tarefas.filter((t) => t.concluida).length;
  contadorTotal.textContent = tarefas.length;
  contadorConcluidas.textContent = concluidas;

  // 4. Cria os elementos visuais para cada tarefa
  tarefas.forEach((tarefa) => {
    // Cria o item da lista (<li>) com classe condicional: 'concluida' ou 'pendente'
    const li = document.createElement("li");
    li.className = "item-tarefa " + (tarefa.concluida ? "concluida" : "pendente");

    // Área esquerda: checkbox e texto da tarefa
    const corpo = document.createElement("div");
    corpo.className = "corpo-tarefa";

    // Caixa de marcação (checkbox)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute("aria-label", tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída");
    checkbox.addEventListener("change", () => alternarConclusao(tarefa.id));

    // Texto da atividade (usando textContent para segurança contra ataques XSS)
    const spanTexto = document.createElement("span");
    spanTexto.className = "texto-tarefa";
    spanTexto.textContent = tarefa.texto;

    // Clique no texto também alterna a conclusão
    spanTexto.addEventListener("click", () => alternarConclusao(tarefa.id));

    // Junta checkbox e texto dentro do corpo
    corpo.appendChild(checkbox);
    corpo.appendChild(spanTexto);

    // Área direita: badge indicativo de status e botão de remover
    const acoes = document.createElement("div");
    acoes.className = "acoes-tarefa";

    // Tag (badge) visual para destacar se a tarefa está concluída ou pendente
    const badgeStatus = document.createElement("span");
    badgeStatus.className = "badge-status " + (tarefa.concluida ? "badge-concluida" : "badge-pendente");
    badgeStatus.textContent = tarefa.concluida ? "✓ Concluída" : "Pendente";

    // Botão de remover (lixeira / fechar)
    const btnRemover = document.createElement("button");
    btnRemover.className = "btn-remover";
    btnRemover.innerHTML = "&times;"; // Símbolo '×' elegante de fechar/excluir
    btnRemover.title = "Excluir esta atividade";
    btnRemover.setAttribute("aria-label", "Excluir atividade");
    btnRemover.addEventListener("click", () => removerTarefa(tarefa.id));

    // Junta o badge e o botão na área de ações
    acoes.appendChild(badgeStatus);
    acoes.appendChild(btnRemover);

    // Insere o corpo e as ações no <li>
    li.appendChild(corpo);
    li.appendChild(acoes);

    // Insere o <li> na lista <ul> do HTML
    listaTarefas.appendChild(li);
  });
}

/* --------------------------------------------------------------------------
   6. ESCUTADORES DE EVENTOS (INTERAÇÃO DO USUÁRIO)
   -------------------------------------------------------------------------- */

// Adiciona tarefa ao clicar no botão "Adicionar"
btnAdicionar.addEventListener("click", adicionarTarefa);

// Adiciona tarefa ao pressionar a tecla "Enter" dentro do campo de texto
inputNovaTarefa.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    adicionarTarefa();
  }
});

/* --------------------------------------------------------------------------
   7. INICIALIZAÇÃO
   Executado quando a página é aberta pela primeira vez.
   -------------------------------------------------------------------------- */
carregarTarefas();
renderizarTarefas();
