const express = require("express");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const projetosRouter = require("./routes/projetos");

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

// ROTAS DE PROJETOS
app.use("/projetos", projetosRouter);


// START
app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});