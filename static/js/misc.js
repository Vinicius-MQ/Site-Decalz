(function () {
	function MostrarNaTela() {
		const lista = document.getElementById("lista");
		if (!lista) return;

		lista.innerHTML = "";

		if (typeof ListaDeProjetos === "undefined" || ListaDeProjetos.length === 0) {
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

	window.MostrarNaTela = MostrarNaTela;
})();
