const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../middleware/authJwt");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    const projetos = await prisma.projeto.findMany();
    res.json(projetos);
});

router.post("/", verifyToken, async (req, res) => {
    const { nome, tipo, link } = req.body;

    const projeto = await prisma.projeto.create({
        data: { nome, tipo, link }
    });

    res.status(201).json(projeto);
});

router.put("/:id", verifyToken, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const atualizado = await prisma.projeto.update({
            where: { id },
            data: req.body
        });

        res.json(atualizado);
    } catch {
        res.status(404).end();
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.projeto.delete({
            where: { id }
        });

        res.json({ success: true });
    } catch {
        res.status(404).end();
    }
});

module.exports = router;