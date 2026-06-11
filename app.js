const express = require("express");
const path = require("path");
require("dotenv").config();

const projetosRouter = require("./routes/projetos");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(express.static("static"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "index.html"));
});

app.get("/crud", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "crud.html"));
});

app.use("/auth", authRouter);
app.use("/projetos", projetosRouter);

app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});