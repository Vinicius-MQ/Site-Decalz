ListaDeProjetos=[]
let editandoIndex = -1;//variavel necessaria pra funcionar a edição sem ela a função adicionar não sabe se está editando ou criando uma nova

function adicionar () {
    let nome=document.getElementById("nome").value
    let tipo=document.getElementById("tipo").value
    let link=document.getElementById("link").value  ///pega valores dos inputs do html
    let Projeto={
    nome,tipo,link //cria o objeto
    }
     if (editandoIndex === -1) {
        ListaDeProjetos.push(Projeto);// joga o objeto na lista de projetos
    } else {
        ListaDeProjetos[editandoIndex] = Projeto;
        editandoIndex = -1;
    } ///verifica se está editando

    MostrarNaTela()

}

function MostrarNaTela () {
    let lista=document.getElementById("lista")
    lista.innerHTML = "";//limpa todo conteudo da lista toda vez q mostra na tela cria a lista do zero
    for (let i=0;i < ListaDeProjetos.length ;i++){
        let item = ListaDeProjetos[i];
        lista.innerHTML += `
        <li>
            ${item.nome} - ${item.tipo} - 
            <a href="${item.link}" target="_blank">link para o decalque </a> 
             <button onclick="editar(${i})">Editar</button>
             <button onclick="excluir(${i})">Excluir</button>
        </li> 
      
        `;


    }


}

function excluir(index) {
    ListaDeProjetos.splice(index, 1);
     MostrarNaTela();
}

function editar(index) {
    let item = ListaDeProjetos[index];

    document.getElementById("nome").value = item.nome;
    document.getElementById("tipo").value = item.tipo;
    document.getElementById("link").value = item.link;

    editandoIndex = index;   /////substitui os elementos do projeto, através do index
}
