import json
import os
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

PROJETOS_FILE = os.path.join(os.path.dirname(__file__), "projetos.json")


def _carregar():
    if not os.path.exists(PROJETOS_FILE):
        return []
    with open(PROJETOS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _salvar(projetos):
    with open(PROJETOS_FILE, "w", encoding="utf-8") as f:
        json.dump(projetos, f, ensure_ascii=False, indent=2)


# ── Páginas ──────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/crud")
def crud():
    return render_template("crud.html")


# ── API REST ─────────────────────────────────────────────────────────────────

@app.route("/api/projetos", methods=["GET"])
def listar_projetos():
    return jsonify(_carregar())


@app.route("/api/projetos", methods=["POST"])
def criar_projeto():
    dados = request.get_json(silent=True)
    if not dados or not all(k in dados for k in ("nome", "tipo", "link")):
        return jsonify({"erro": "Campos obrigatórios: nome, tipo, link"}), 400

    projetos = _carregar()
    proximo_id = max((p["id"] for p in projetos), default=0) + 1
    projeto = {
        "id": proximo_id,
        "nome": dados["nome"].strip(),
        "tipo": dados["tipo"].strip(),
        "link": dados["link"].strip(),
    }
    projetos.append(projeto)
    _salvar(projetos)
    return jsonify(projeto), 201


@app.route("/api/projetos/<int:projeto_id>", methods=["PUT"])
def atualizar_projeto(projeto_id):
    dados = request.get_json(silent=True)
    if not dados:
        return jsonify({"erro": "Body JSON obrigatório"}), 400

    projetos = _carregar()
    for p in projetos:
        if p["id"] == projeto_id:
            p["nome"] = dados.get("nome", p["nome"]).strip()
            p["tipo"] = dados.get("tipo", p["tipo"]).strip()
            p["link"] = dados.get("link", p["link"]).strip()
            _salvar(projetos)
            return jsonify(p)

    return jsonify({"erro": "Projeto não encontrado"}), 404


@app.route("/api/projetos/<int:projeto_id>", methods=["DELETE"])
def excluir_projeto(projeto_id):
    projetos = _carregar()
    novos = [p for p in projetos if p["id"] != projeto_id]
    if len(novos) == len(projetos):
        return jsonify({"erro": "Projeto não encontrado"}), 404

    _salvar(novos)
    return jsonify({"mensagem": "Projeto excluído com sucesso"})


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(debug=debug)
