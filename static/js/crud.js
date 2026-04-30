let editandoId = null; // ID do projeto em modo de edição (null = novo)

// ── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch(url, opcoes = {}) {
    const resposta = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...opcoes,
    });
    if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.erro || `Erro HTTP ${resposta.status}`);
    }
    return resposta.json();
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

async function MostrarNaTela() {
    const lista = document.getElementById("lista");
    lista.innerHTML = '<li class="project-empty">Carregando...</li>';

    try {
        const projetos = await apiFetch("/api/projetos");

        if (projetos.length === 0) {
            lista.innerHTML = '<li class="project-empty">Nenhum item cadastrado.</li>';
            return;
        }

        lista.innerHTML = projetos
            .map(
                (item) => `
        <li class="project-item">
            <img class="project-image" src="${item.link}" alt="${item.nome}" loading="lazy">
            <div class="project-content">
                <h3 class="project-name">${item.nome}</h3>
                <p class="project-type">${item.tipo}</p>
                <a class="project-link" href="${item.link}" target="_blank" rel="noopener noreferrer">Abrir imagem</a>
                <div class="project-actions">
                    <button class="btn-action" onclick="editar(${item.id})">Editar</button>
                    <button class="btn-action" onclick="excluir(${item.id})">Excluir</button>
                </div>
            </div>
        </li>`
            )
            .join("");
    } catch (err) {
        lista.innerHTML = `<li class="project-empty">Erro ao carregar projetos: ${err.message}</li>`;
    }
}

async function adicionar() {
    const nome = document.getElementById("nome").value.trim();
    const tipo = document.getElementById("tipo").value.trim();
    const link = document.getElementById("link").value.trim();

    if (!nome || !tipo || !link) {
        alert("Preencha todos os campos: nome, tipo e link.");
        return;
    }

    const projeto = { nome, tipo, link };

    try {
        if (editandoId === null) {
            await apiFetch("/api/projetos", {
                method: "POST",
                body: JSON.stringify(projeto),
            });
        } else {
            await apiFetch(`/api/projetos/${editandoId}`, {
                method: "PUT",
                body: JSON.stringify(projeto),
            });
            editandoId = null;
            document.querySelector(".btn-primary").textContent = "Salvar item";
        }

        document.getElementById("nome").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("link").value = "";

        await MostrarNaTela();
    } catch (err) {
        alert(`Erro ao salvar: ${err.message}`);
    }
}

async function excluir(id) {
    try {
        await apiFetch(`/api/projetos/${id}`, { method: "DELETE" });
        await MostrarNaTela();
    } catch (err) {
        alert(`Erro ao excluir: ${err.message}`);
    }
}

async function editar(id) {
    try {
        const projetos = await apiFetch("/api/projetos");
        const item = projetos.find((p) => p.id === id);
        if (!item) return;

        document.getElementById("nome").value = item.nome;
        document.getElementById("tipo").value = item.tipo;
        document.getElementById("link").value = item.link;

        editandoId = id;
        document.querySelector(".btn-primary").textContent = "Atualizar item";
        document.getElementById("nome").focus();
    } catch (err) {
        alert(`Erro ao editar: ${err.message}`);
    }
}

// ── Inicialização ─────────────────────────────────────────────────────────────

MostrarNaTela();
