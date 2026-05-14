from flask import Flask, render_template, request, redirect, url_for, jsonify
from orm import projeto, session, engine, base

# Serve static from `static` and look for templates from project root
app = Flask(__name__, static_folder="static", template_folder='templates')

lista_de_projetos = []

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/crud")
def crud():
    return render_template("crud.html")


@app.route('/projetos', methods=['GET'])
def api_list_projetos():
    projetos = session.query(projeto).all()
    lista=[]
    for i in projetos:
        lista.append({
            "nome": i.nome,
            "tipo": i.tipo,
            "link": i.link
        })
    print("Projetos listados com sucesso")
    print(lista)
    return jsonify(lista)


@app.route('/projetos', methods=['POST'])
def api_create_projeto():
    data = request.get_json() or {}

    nome = data.get("nome")
    tipo = data.get("tipo")
    link = data.get("link")

    if nome and tipo and link:

        novo_projeto = projeto(nome, tipo, link)

        session.add(novo_projeto)
        session.commit()

        print("Projeto salvo no banco")

        return jsonify({"success": True}), 201

    return jsonify({"error": "invalid data"}), 400

@app.route('/projetos/<int:index>', methods=['PUT'])
def api_update_projeto(index):
    if 0 <= index < len(lista_de_projetos):
        data = request.get_json() or {}
        projeto = lista_de_projetos[index]
        projeto['nome'] = data.get('nome', projeto.get('nome'))
        projeto['tipo'] = data.get('tipo', projeto.get('tipo'))
        projeto['link'] = data.get('link', projeto.get('link'))
        print("Projeto editado com sucesso")
        print(lista_de_projetos)
        return jsonify({'success': True})
    return jsonify({'error': 'not found'}), 404


@app.route('/projetos/<string:nome>', methods=['DELETE'])
def api_delete_projeto(nome):
    registro = session.query(projeto).filter_by(nome=nome).first()
    if registro:
        session.delete(registro)
        session.commit()
        return jsonify({'success': True})
    
    return jsonify({'error': 'not found'}), 404


if __name__ == "__main__":
    app.run(debug=True)