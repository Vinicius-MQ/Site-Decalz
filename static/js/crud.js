ListaDeProjetos = [];
let editandoIndex = -1; // Indica se o item atual está em modo de edição

const API_BASE_URL = "/projetos";

function limparFormulario() {
    document.getElementById("nome").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("link").value = "";
}

function lerFormulario() {
    return {
        nome: document.getElementById("nome").value.trim(),
        tipo: document.getElementById("tipo").value.trim(),
        link: document.getElementById("link").value.trim()
    };
}

async function carregarProjetos() {
    const resposta = await fetch(API_BASE_URL);
    if (!resposta.ok) {
        throw new Error("Falha ao carregar projetos");
    }

    const dados = await resposta.json();
    ListaDeProjetos = Array.isArray(dados) ? dados : [];
    MostrarNaTela();
}

async function adicionar() {
    const projeto = lerFormulario();
    if (!projeto.nome || !projeto.tipo || !projeto.link) {
        return;
    }

    const url = editandoIndex === -1 ? API_BASE_URL : `${API_BASE_URL}/${editandoIndex}`;
    const metodo = editandoIndex === -1 ? "POST" : "PUT";

    const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projeto)
    });

    if (!resposta.ok) {
        alert("Não foi possível salvar o item.");
        return;
    }

    editandoIndex = -1;
    limparFormulario();
    await carregarProjetos();
}

async function excluir(index) {
    const resposta = await fetch(`${API_BASE_URL}/${index}`, { method: "DELETE" });
    if (!resposta.ok) {
        alert("Não foi possível excluir o item.");
        return;
    }

    if (editandoIndex === index) {
        editandoIndex = -1;
        limparFormulario();
    }

    await carregarProjetos();
}

function editar(index) {
    const item = ListaDeProjetos[index];
    if (!item) {
        return;
    }

    document.getElementById("nome").value = item.nome;
    document.getElementById("tipo").value = item.tipo;
    document.getElementById("link").value = item.link;
    editandoIndex = index;
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await carregarProjetos();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os projetos da API.");
    }
});
