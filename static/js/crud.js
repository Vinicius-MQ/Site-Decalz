let ListaDeProjetos = [];
let editandoIndex = -1;

function obterToken() {
    return localStorage.getItem("authToken");
}

function armazenarToken(token) {
    localStorage.setItem("authToken", token);
}

function removerToken() {
    localStorage.removeItem("authToken");
}

async function fazerLogin() {
    const senha = prompt("Digite a senha de administrador:");

    if (senha === null) {
        return null;
    }

    try {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senha: senha.trim()
            })
        });

        if (!res.ok) {
            alert("Senha incorreta.");
            return null;
        }

        const data = await res.json();

        if (!data.token) {
            return null;
        }

        armazenarToken(data.token);

        return data.token;
    } catch {
        alert("Erro ao fazer login.");
        return null;
    }
}

async function request(url, options = {}) {
    const res = await fetch(url, options);

    if (res.status === 401) {
        removerToken();

        alert("Sua sessão expirou.");

        location.reload();

        return;
    }

    if (!res.ok) {
        const erro = await res.json().catch(() => ({}));
        throw new Error(erro.error || "Erro na requisição");
    }

    return res;
}

async function requestComAuth(url, options = {}) {
    const token = obterToken();

    if (!token) {
        location.reload();
        return null;
    }

    return request(url, {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
}

async function carregarProjetos() {
    const res = await request("/projetos");

    if (!res) return;

    ListaDeProjetos = await res.json();

    renderizarListaProjetos(
        ListaDeProjetos,
        editar,
        excluir
    );
}

async function adicionar() {
    const { nome, tipo, link } = obterValoresFormulario();

    if (!nome || !tipo || !link) {
        return;
    }

    const isEdicao = editandoIndex !== -1;

    try {
        const res = await requestComAuth(
            isEdicao
                ? `/projetos/${editandoIndex}`
                : "/projetos",
            {
                method: isEdicao ? "PUT" : "POST",
                body: JSON.stringify({
                    nome,
                    tipo,
                    link
                })
            }
        );

        if (!res) return;

        editandoIndex = -1;

        limparFormularioProjeto();

        await carregarProjetos();

        alert(
            isEdicao
                ? "Projeto atualizado com sucesso."
                : "Projeto criado com sucesso."
        );
    } catch (err) {
        alert(err.message);
    }
}

async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) {
        return;
    }

    try {
        const res = await requestComAuth(`/projetos/${id}`, {
            method: "DELETE"
        });

        if (!res) return;

        editandoIndex = -1;

        await carregarProjetos();

        alert("Projeto excluído com sucesso.");
    } catch (err) {
        alert(err.message);
    }
}

function editar(id) {
    const item = ListaDeProjetos.find(projeto => projeto.id === id);

    if (!item) {
        return;
    }

    preencherFormularioProjeto(item);
    editandoIndex = item.id;
}

document.addEventListener("DOMContentLoaded", async () => {
    document.body.style.display = "none";

    let token = obterToken();

    if (!token) {
        token = await fazerLogin();

        if (!token) {
            window.location.href = "/";
            return;
        }
    }

    document.body.style.display = "block";

    carregarProjetos().catch(console.error);
});