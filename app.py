from flask import Flask, render_template, request, jsonify
from repository.ProjetoRepository import ProjetoRepository

app = Flask(__name__, static_folder="static", template_folder="templates")

repositorio = ProjetoRepository()

@app.route("/")
def Index():
    return render_template("index.html")


@app.route("/crud")
def Crud():
    return render_template("crud.html")



@app.route('/projetos', methods=['GET'])
def ListarProjetos():
    return jsonify(repositorio.ListarTodos())



@app.route('/projetos', methods=['POST'])
def CriarProjeto():
    data = request.get_json() or {}

    nome = data.get("nome")
    tipo = data.get("tipo")
    link = data.get("link")

    if nome and tipo and link:
        repositorio.Criar(nome, tipo, link)
        return jsonify({"success": True}), 201

    return jsonify({"error": "invalid data"}), 400


@app.route('/projetos/<string:nome>', methods=['PUT'])
def AtualizarProjeto(nome):
    data = request.get_json() or {}

    ok = repositorio.AtualizarPorNome(nome, data)

    if ok:
        return jsonify({"success": True})

    return jsonify({"error": "not found"}), 404


@app.route('/projetos/<string:nome>', methods=['DELETE'])
def ExcluirProjeto(nome):
    ok = repositorio.ExcluirPorNome(nome)

    if ok:
        return jsonify({"success": True})

    return jsonify({"error": "not found"}), 404



if __name__ == "__main__":
    app.run(debug=True)