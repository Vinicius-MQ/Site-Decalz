const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("🔐 Middleware verifyToken acionado");
    console.log("   Headers.authorization:", authHeader ? authHeader.substring(0, 20) + "..." : "❌ Não fornecido");
    
    const token = authHeader?.split(" ")[1];

    if (!token) {
        console.error("❌ Nenhum token no header");
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
        console.log("   Validando token com JWT_SECRET:", process.env.JWT_SECRET?.substring(0, 10) + "...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token válido! Decodificado:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Token inválido:", err.message);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

module.exports = { verifyToken };
