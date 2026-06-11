from flask import request, jsonify


def register_projetos_routes(app, lista_de_projetos):
    @app.route('/projetos', methods=['GET'])
    def api_list_projetos():
        print("Projetos listados com sucesso")
        print(lista_de_projetos)
        return jsonify(lista_de_projetos)

    @app.route('/projetos', methods=['POST'])
    def api_create_projeto():
        data = request.get_json() or {}
        nome = data.get('nome')
        tipo = data.get('tipo')
        link = data.get('link')
        if nome and tipo and link:
            lista_de_projetos.append({'nome': nome, 'tipo': tipo, 'link': link})
            print("Projeto postado com sucesso")
            print(lista_de_projetos)
            return jsonify({'success': True}), 201
        return jsonify({'error': 'invalid data'}), 400

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

    @app.route('/projetos/<int:index>', methods=['DELETE'])
    def api_delete_projeto(index):
        if 0 <= index < len(lista_de_projetos):
            lista_de_projetos.pop(index)
            print("Projeto excluído com sucesso")
            print(lista_de_projetos)
            return jsonify({'success': True})
        return jsonify({'error': 'not found'}), 404
