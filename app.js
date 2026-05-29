const express = require("express");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static("static"));


// PÁGINAS
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "index.html"));
});

app.get("/crud", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "crud.html"));
});


// LISTAR
app.get("/projetos", async (req, res) => {
    const projetos = await prisma.projeto.findMany();
    res.json(projetos);
});


// CRIAR
app.post("/projetos", async (req, res) => {
    const { nome, tipo, link } = req.body;

    const projeto = await prisma.projeto.create({
        data: { nome, tipo, link }
    });

    res.status(201).json(projeto);
});


// EDITAR (USANDO ID)
app.put("/projetos/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const atualizado = await prisma.projeto.update({
            where: { id },
            data: {
                nome: req.body.nome,
                tipo: req.body.tipo,
                link: req.body.link
            }
        });

        res.json(atualizado);
    } catch (err) {
        res.status(404).json({ error: "Projeto não encontrado" });
    }
});


// DELETAR (USANDO ID)
app.delete("/projetos/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.projeto.delete({
            where: { id }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(404).json({ error: "Projeto não encontrado" });
    }
});


// START
app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});