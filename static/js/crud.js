let ListaDeProjetos = [];
let editandoIndex = -1;

// Obter token do localStorage
function obterToken() {
    const token = localStorage.getItem("authToken");
    console.log("📦 Token obtido:", token ? token.substring(0, 20) + "..." : "null");
    return token;
}

// Armazenar token no localStorage
function armazenarToken(token) {
    localStorage.setItem("authToken", token);
    console.log("💾 Token armazenado:", token.substring(0, 20) + "...");
}

// Remover token do localStorage
function removerToken() {
    localStorage.removeItem("authToken");
    console.log("🗑️ Token removido");
}

// Solicitar senha via prompt e fazer login
async function fazerLogin() {
    const senha = prompt("Digite a senha de administrador:");

    if (senha === null) {
        console.log("❌ Usuário cancelou o login");
        return null;
    }

    try {
        console.log("🔐 Enviando login para /auth/login");

        const res = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senha: senha.trim()
            })
        });

        console.log("📡 Status do login:", res.status);

        if (!res.ok) {
            alert("Senha incorreta!");
            return null;
        }

        const data = await res.json();

        console.log("📥 Resposta do servidor:", data);

        if (!data.token) {
            console.error("❌ Token não recebido");
            return null;
        }

        armazenarToken(data.token);

        console.log(
            "💾 Verificação localStorage:",
            localStorage.getItem("authToken")
                ? "✅ Salvo"
                : "❌ Não salvo"
        );

        return data.token;

    } catch (err) {
        console.error("❌ Erro ao fazer login:", err);
        alert("Erro ao fazer login.");
        return null;
    }
}

async function request(url, options = {}) {
    console.log("🌐 Requisição:", options.method || "GET", url);

    const res = await fetch(url, options);

    console.log("📡 Status:", res.status);

    if (res.status === 401) {
        console.error("❌ Sessão inválida");

        removerToken();

        alert("Sua sessão expirou. Faça login novamente.");

        location.reload();

        return;
    }

    if (!res.ok) {
        const erro = await res.json().catch(() => ({}));
        throw new Error(erro.error || "Erro na requisição");
    }

    return res;
}

// Requisições autenticadas
async function requestComAuth(url, options = {}) {
    const token = obterToken();

    if (!token) {
        alert("Você não está autenticado.");
        location.reload();
        return null;
    }

    const novasOpcoes = {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };

    console.log(
        "📤 Enviando Authorization:",
        `Bearer ${token.substring(0, 20)}...`
    );

    return request(url, novasOpcoes);
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
                ? "Projeto atualizado com sucesso!"
                : "Projeto criado com sucesso!"
        );

    } catch (err) {
        console.error("❌ Erro ao salvar projeto:", err);
        alert("Erro ao salvar projeto: " + err.message);
    }
}

async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) {
        return;
    }

    try {
        const res = await requestComAuth(
            `/projetos/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!res) return;

        editandoIndex = -1;

        await carregarProjetos();

        alert("Projeto excluído com sucesso!");

    } catch (err) {
        console.error("❌ Erro ao excluir projeto:", err);
        alert("Erro ao excluir projeto: " + err.message);
    }
}

function editar(id) {
    const item = ListaDeProjetos.find(
        projeto => projeto.id === id
    );

    if (!item) return;

    preencherFormularioProjeto(item);

    editandoIndex = item.id;
}

// LOGIN AUTOMÁTICO AO ENTRAR NA PÁGINA
document.addEventListener("DOMContentLoaded", async () => {
    document.body.style.display = "none";

    let token = obterToken();

    if (!token) {
        token = await fazerLogin();
        window.location.href = "/";
        return;
    }

    document.body.style.display = "block";

    carregarProjetos().catch(console.error);
});

// ===== DEBUG =====

window.verificarToken = () => {
    console.log("Token:", localStorage.getItem("authToken"));
};

window.limparTudo = () => {
    localStorage.clear();
    console.log("🧹 localStorage limpo");
};

window.verificarServer = async () => {
    const res = await fetch("/debug");
    const data = await res.json();
    console.table(data);
};