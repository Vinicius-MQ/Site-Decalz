let ListaDeProjetos = [];
let editandoIndex = -1; // Indica se o item atual esta em modo de edicao

async function carregarProjetos() {
    const resposta = await fetch("/projetos");
    if (!resposta.ok) {
        throw new Error("Falha ao carregar projetos");
    }

    ListaDeProjetos = await resposta.json();
    window.ListaDeProjetos = ListaDeProjetos;
    window.renderizarListaProjetos(ListaDeProjetos, editar, excluir);
}

async function adicionar() {
    const { nome, tipo, link } = window.obterValoresFormulario();

    if (!nome || !tipo || !link) {
        return;
    }

    const projeto = { nome, tipo, link };
    const metodo = editandoIndex === -1 ? "POST" : "PUT";
    const url = editandoIndex === -1 ? "/projetos" : `/projetos/${editandoIndex}`;

    const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projeto)
    });

    if (!resposta.ok) {
        throw new Error("Falha ao salvar projeto");
    }

    editandoIndex = -1;
    window.limparFormularioProjeto();
    await carregarProjetos();
}

async function excluir(index) {
    const resposta = await fetch(`/projetos/${index}`, { method: "DELETE" });
    if (!resposta.ok) {
        throw new Error("Falha ao excluir projeto");
    }

    editandoIndex = -1;
    await carregarProjetos();
}

function editar(index) {
    const item = ListaDeProjetos[index];
    if (!item) {
        return;
    }

    window.preencherFormularioProjeto(item);
    editandoIndex = index;
}

window.ListaDeProjetos = ListaDeProjetos;
window.adicionar = adicionar;
window.excluir = excluir;
window.editar = editar;

document.addEventListener("DOMContentLoaded", () => {
    carregarProjetos().catch((erro) => {
        console.error(erro);
    });
});
