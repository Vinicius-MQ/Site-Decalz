(function () {
    const nomeInput = document.getElementById("nome");
    const tipoInput = document.getElementById("tipo");
    const linkInput = document.getElementById("link");
    const lista = document.getElementById("lista");

    let editarAtual = null;
    let excluirAtual = null;

    function obterValoresFormulario() {
        return {
            nome: nomeInput ? nomeInput.value.trim() : "",
            tipo: tipoInput ? tipoInput.value.trim() : "",
            link: linkInput ? linkInput.value.trim() : ""
        };
    }

    function limparFormularioProjeto() {
        if (nomeInput) nomeInput.value = "";
        if (tipoInput) tipoInput.value = "";
        if (linkInput) linkInput.value = "";
    }

    function preencherFormularioProjeto(projeto) {
        if (nomeInput) nomeInput.value = projeto.nome || "";
        if (tipoInput) tipoInput.value = projeto.tipo || "";
        if (linkInput) linkInput.value = projeto.link || "";
    }

    function renderizarListaProjetos(projetos, onEditar, onExcluir) {
        if (!lista) return;

        editarAtual = onEditar;
        excluirAtual = onExcluir;

        if (!Array.isArray(projetos) || projetos.length === 0) {
            lista.innerHTML =
                '<li class="project-empty">Nenhum item cadastrado em ListaDeProjetos.</li>';
            return;
        }

        lista.innerHTML = projetos.map((projeto, index) => `
            <li class="project-item">
                <img class="project-image"
                     src="${projeto.link}"
                     alt="${projeto.nome}"
                     loading="lazy">

                <div class="project-content">
                    <h3 class="project-name">${projeto.nome}</h3>
                    <p class="project-type">${projeto.tipo}</p>

                    <a class="project-link"
                       href="${projeto.link}"
                       target="_blank"
                       rel="noopener noreferrer">
                       Abrir imagem
                    </a>

                    <div class="project-actions">
                        <button
                            class="btn-action"
                            type="button"
                            data-action="editar"
                            data-index="${index}">
                            Editar
                        </button>

                        <button
                            class="btn-action"
                            type="button"
                            data-action="excluir"
                            data-nome="${projeto.nome}">
                            Excluir
                        </button>
                    </div>
                </div>
            </li>
        `).join("");
    }

    if (lista) {
        lista.addEventListener("click", (event) => {
            const botao = event.target.closest("button[data-action]");
            if (!botao) return;

            const nome = botao.dataset.nome;
            const index = Number(botao.dataset.index);

            if (
                botao.dataset.action === "editar" &&
                typeof editarAtual === "function"
            ) {
                editarAtual(index);
            }

            if (
                botao.dataset.action === "excluir" &&
                typeof excluirAtual === "function"
            ) {
                excluirAtual(nome);
            }
        });
    }

    window.obterValoresFormulario = obterValoresFormulario;
    window.limparFormularioProjeto = limparFormularioProjeto;
    window.preencherFormularioProjeto = preencherFormularioProjeto;
    window.renderizarListaProjetos = renderizarListaProjetos;
})();