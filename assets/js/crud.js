ListaDeProjetos = [];
let editandoIndex = -1; // Indica se o item atual esta em modo de edicao

function adicionar() {
    const nome = document.getElementById("nome").value.trim();
    const tipo = document.getElementById("tipo").value.trim();
    const link = document.getElementById("link").value.trim();

    if (!nome || !tipo || !link) {
        return;
    }

    const projeto = {
        nome,
        tipo,
        link
    };

    if (editandoIndex === -1) {
        ListaDeProjetos.push(projeto);
    } else {
        ListaDeProjetos[editandoIndex] = projeto;
        editandoIndex = -1;
    }

    document.getElementById("nome").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("link").value = "";

    MostrarNaTela();

}

function MostrarNaTela() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    if (ListaDeProjetos.length === 0) {
        lista.innerHTML = '<li class="project-empty">Nenhum item cadastrado em ListaDeProjetos.</li>';
        return;
    }

    for (let i = 0; i < ListaDeProjetos.length; i++) {
        const item = ListaDeProjetos[i];
        lista.innerHTML += `
        <li class="project-item">
            <img class="project-image" src="${item.link}" alt="${item.nome}" loading="lazy">
            <div class="project-content">
                <h3 class="project-name">${item.nome}</h3>
                <p class="project-type">${item.tipo}</p>
                <a class="project-link" href="${item.link}" target="_blank" rel="noopener noreferrer">Abrir imagem</a>
                <div class="project-actions">
                    <button class="btn-action" onclick="editar(${i})">Editar</button>
                    <button class="btn-action" onclick="excluir(${i})">Excluir</button>
                </div>
            </div>
        </li>
        `;
    }
}

function excluir(index) {
    ListaDeProjetos.splice(index, 1);
    MostrarNaTela();
}

function editar(index) {
    const item = ListaDeProjetos[index];

    document.getElementById("nome").value = item.nome;
    document.getElementById("tipo").value = item.tipo;
    document.getElementById("link").value = item.link;

    editandoIndex = index;
}

MostrarNaTela();
