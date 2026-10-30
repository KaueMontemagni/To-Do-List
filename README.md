# 📝 Minha Lista de Tarefas (To-Do List)

Uma aplicação simples, moderna e didática de **Lista de Tarefas**, desenvolvida para quem está dando os primeiros passos no desenvolvimento de software.

O projeto foi construído utilizando a tríade fundamental da web (**HTML5**, **CSS3** e **JavaScript** puro), sem dependências externas, bibliotecas complexas ou etapas de compilação.

---

## 🎯 Funcionalidades

- ➕ **Adicionar atividades:** Digite a tarefa e clique em **Adicionar** ou pressione a tecla **Enter**.
- ✅ **Diferenciação visual de status:** 
  - **Pendentes:** Borda lateral azul, fundo branco nítido e badge azul `PENDENTE`.
  - **Concluídas:** Borda lateral verde, fundo verde suave, badge verde `✓ CONCLUÍDA`, além do texto riscado e em itálico.
- 🗑️ **Remover atividades:** Clique no botão de excluir (**×**) para remover a tarefa da lista.
- 📊 **Contadores em tempo real:** Mostra quantas tarefas existem no total e quantas já foram concluídas.
- 💾 **Salvamento automático (*LocalStorage*):** As tarefas não somem se você recarregar ou fechar a página.

---

## 🧱 Arquitetura: Os 3 Pilares do Projeto

Este projeto foi organizado seguindo o conceito de **Separação de Preocupações** (*Separation of Concerns*). Cada arquivo tem um papel único e bem definido:

```text
magical-hawking/
├── index.html        # 1. ESTRUTURA (O Esqueleto)
├── style.css         # 2. ESTILO (A Roupa / Aparência)
├── script.js         # 3. LÓGICA E INTERATIVIDADE (O Cérebro)
├── test_app.js       # 4. TESTES AUTOMATIZADOS (Validação)
└── README.md         # Documentação e guia de estudos
```

### 1. `index.html` (Estrutura)
Define **quais** elementos existem na tela:
- O título principal (`<h1>`)
- O campo de texto para digitar a tarefa (`<input>`)
- O botão para disparar a ação (`<button>`)
- A lista vazia (`<ul>`) pronta para receber os itens
- A mensagem que avisa quando não há tarefas cadastradas

### 2. `style.css` (Aparência)
Define **como** os elementos devem se parecer:
- Paleta de cores moderna e tipografia legível
- Cartão centralizado com cantos arredondados e sombra suave
- Efeito visual de riscado para tarefas marcadas como concluídas
- Efeitos de foco nos botões e inputs ao passar o mouse (*hover*)

### 3. `script.js` (Comportamento)
Define **o que acontece** quando o usuário interage:
1. **Seleção de Elementos (DOM):** O JavaScript busca os botões e campos do HTML usando `document.getElementById`.
2. **Estado (Dados na memória):** Mantém uma lista de tarefas na variável `tarefas = []`. Cada tarefa possui `id`, `texto` e `concluida`.
3. **Funções:**
   - `adicionarTarefa()`: Lê o texto, valida se não está vazio e adiciona à lista.
   - `alternarConclusao(id)`: Alterna o status da tarefa entre pendente e concluída.
   - `removerTarefa(id)`: Remove a tarefa selecionada da lista.
   - `renderizarTarefas()`: Cria dinamicamente o HTML na tela com base na lista de tarefas atualizada.
   - `salvarTarefas()` e `carregarTarefas()`: Usa o `localStorage` do navegador para persistência.
4. **Eventos:** Ouve os cliques do mouse (`click`) e o teclado (`Enter`) para disparar as funções.

---

## 🚀 Como Executar

Não é necessário instalar nenhum programa, pacote ou servidor para usar a aplicação.

1. Navegue até a pasta do projeto:
   ```text
   c:\Users\ssd\Documents\antigravity\magical-hawking
   ```
2. Dê um **duplo clique** no arquivo `index.html` (ele abrirá diretamente no seu navegador padrão: Chrome, Edge, Firefox, etc.).
3. Comece a adicionar suas tarefas!

---

## 🧪 Testes Automatizados

O projeto conta com uma suíte de testes automatizados ([test_app.js](test_app.js)) que valida todos os comportamentos (adicionar, concluir, remover, contadores, persistência e segurança contra injeção de código).

Para rodar os testes a qualquer momento pelo terminal:

```bash
node --test test_app.js
```

