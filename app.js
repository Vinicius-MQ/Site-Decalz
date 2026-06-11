const express = require("express");
const path = require("path");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const projetosRouter = require("./routes/projetos");
const authRouter = require("./routes/auth");

const app = express();
const prisma = new PrismaClient();

// Debug: Verificar se as variáveis de ambiente foram carregadas
console.log("🔧 Variáveis de ambiente:");
console.log("   JWT_SECRET:", process.env.JWT_SECRET ? "✅ Carregado" : "❌ Não carregado");
console.log("   ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "✅ Carregado" : "❌ Não carregado");

app.use(express.json());
app.use(express.static("static"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "index.html"));
});

app.get("/crud", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "crud.html"));
});

// Rota de autenticação (pública)
app.use("/auth", authRouter);

// ROTA DE DEBUG (verificar variáveis)
app.get("/debug", (req, res) => {
    res.json({
        jwt_secret_loaded: !!process.env.JWT_SECRET,
        admin_password_loaded: !!process.env.ADMIN_PASSWORD,
        jwt_secret_sample: process.env.JWT_SECRET?.substring(0, 10) + "...",
        admin_password_value: process.env.ADMIN_PASSWORD
    });
});

// Rotas de projetos (com proteção integrada)
app.use("/projetos", projetosRouter);


app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});