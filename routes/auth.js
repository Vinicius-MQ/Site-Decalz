const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// LOGIN - Gera JWT se a senha estiver correta
router.post("/login", (req, res) => {
    const { senha } = req.body;

    console.log("🔑 POST /login recebido");
    console.log("   Senha recebida:", senha ? "✅ Sim" : "❌ Não");
    console.log("   ADMIN_PASSWORD no .env:", process.env.ADMIN_PASSWORD ? "✅ Carregado" : "❌ Não carregado");

    // Verificar se a senha foi fornecida
    if (!senha) {
        console.error("❌ Senha não fornecida");
        return res.status(400).json({ error: "Senha não fornecida" });
    }

    // Verificar se a senha está correta (com trim para remover espaços)
    const senhaCorreta = senha.trim() === process.env.ADMIN_PASSWORD?.trim();
    console.log("   Senha digitada:", senha.trim());
    console.log("   Senha esperada:", process.env.ADMIN_PASSWORD?.trim());
    console.log("   Senhas coincidem?", senhaCorreta ? "✅ Sim" : "❌ Não");
    
    if (!senhaCorreta) {
        console.error("❌ Senha incorreta");
        return res.status(401).json({ error: "Senha incorreta" });
    }

    // Gerar JWT com vencimento de 7 dias
    try {
        const token = jwt.sign(
            { admin: true },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }  // ← Aumentado de 24h para 7 dias
        );
        
        console.log("✅ Token gerado com sucesso:", token.substring(0, 20) + "...");
        return res.json({ token });
    } catch (err) {
        console.error("❌ Erro ao gerar token:", err);
        return res.status(500).json({ error: "Erro ao gerar token" });
    }
});

module.exports = router;
