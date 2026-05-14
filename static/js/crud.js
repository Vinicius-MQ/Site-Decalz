let ListaDeProjetos = [];
let editandoIndex = -1;

async function request(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Erro na requisição");
    return res;
}

async function carregarProjetos() {
    const res = await request("/projetos");
    ListaDeProjetos = await res.json();
    renderizarListaProjetos(ListaDeProjetos, editar, excluir);
}

async function adicionar() {
    const { nome, tipo, link } = obterValoresFormulario();
    if (!nome || !tipo || !link) return;

    const isEdicao = editandoIndex !== -1;

    await request(
        isEdicao ? `/projetos/${editandoIndex}` : "/projetos",
        {
            method: isEdicao ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, tipo, link })
        }
    );

    editandoIndex = -1;
    limparFormularioProjeto();
    await carregarProjetos();
}

async function excluir(nome) {
    await request(`/projetos/${nome}`, { method: "DELETE" });
    editandoIndex = -1;
    await carregarProjetos();
}

function editar(index) {
    const item = ListaDeProjetos[index];
    if (!item) return;

    preencherFormularioProjeto(item);
    editandoIndex = index;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarProjetos().catch(console.error);
});