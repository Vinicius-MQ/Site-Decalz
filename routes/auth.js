const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
    const { senha } = req.body;

    if (!senha) {
        return res.status(400).json({
            error: "Senha não fornecida"
        });
    }

    if (senha.trim() !== process.env.ADMIN_PASSWORD?.trim()) {
        return res.status(401).json({
            error: "Senha incorreta"
        });
    }

    try {
        const token = jwt.sign(
            { admin: true },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token });
    } catch {
        res.status(500).json({
            error: "Erro ao gerar token"
        });
    }
});

module.exports = router;