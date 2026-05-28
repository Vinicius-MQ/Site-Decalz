const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static("static"));

let lista_de_projetos = [];


app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "templates", "index.html"));

});


app.get("/crud", (req, res) => {

    res.sendFile(path.join(__dirname, "templates", "crud.html"));

});



app.get("/projetos", (req, res) => {

    console.log("Projetos listados com sucesso");
    console.log(lista_de_projetos);

    res.json(lista_de_projetos);

});


app.post("/projetos", (req, res) => {

    const { nome, tipo, link } = req.body;

    if (nome && tipo && link) {

        lista_de_projetos.push({
            nome,
            tipo,
            link
        });

        console.log("Projeto postado com sucesso");
        console.log(lista_de_projetos);

        return res.status(201).json({
            success: true
        });

    }

    res.status(400).json({
        error: "invalid data"
    });

});


// EDITAR
app.put("/projetos/:index", (req, res) => {

    const index = req.params.index;

    if (index >= 0 && index < lista_de_projetos.length) {

        const projeto = lista_de_projetos[index];

        projeto.nome = req.body.nome || projeto.nome;
        projeto.tipo = req.body.tipo || projeto.tipo;
        projeto.link = req.body.link || projeto.link;

        console.log("Projeto editado com sucesso");
        console.log(lista_de_projetos);

        return res.json({
            success: true
        });

    }

    res.status(404).json({
        error: "not found"
    });

});


// EXCLUIR
app.delete("/projetos/:index", (req, res) => {

    const index = req.params.index;

    if (index >= 0 && index < lista_de_projetos.length) {

        lista_de_projetos.splice(index, 1);

        console.log("Projeto excluído com sucesso");
        console.log(lista_de_projetos);

        return res.json({
            success: true
        });

    }

    res.status(404).json({
        error: "not found"
    });

});


// INICIAR SERVIDOR
app.listen(5000, () => {

    console.log("Servidor rodando na porta 5000");

});