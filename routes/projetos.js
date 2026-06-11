const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../middleware/authJwt");

const prisma = new PrismaClient();

// LISTAR (público)
router.get("/", async (req, res) => {
    const projetos = await prisma.projeto.findMany();
    res.json(projetos);
});

// CRIAR (protegido)
router.post("/", verifyToken, async (req, res) => {
    const { nome, tipo, link } = req.body;

    const projeto = await prisma.projeto.create({
        data: { nome, tipo, link }
    });

    res.status(201).json(projeto);
});

// EDITAR (protegido)
router.put("/:id", verifyToken, async (req, res) => {
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

// DELETAR (protegido)
router.delete("/:id", verifyToken, async (req, res) => {
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

module.exports = router;
