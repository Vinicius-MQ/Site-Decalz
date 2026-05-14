from orm import projeto, session


class ProjetoRepository:

    def ListarTodos(self):
        projetos = session.query(projeto).all()
        return [
            {
                "nome": p.nome,
                "tipo": p.tipo,
                "link": p.link
            }
            for p in projetos
        ]

    def Criar(self, nome, tipo, link):
        novo = projeto(nome, tipo, link)
        session.add(novo)
        session.commit()
        return novo

    def BuscarPorNome(self, nome):
        return session.query(projeto).filter_by(nome=nome).first()

    def ExcluirPorNome(self, nome):
        registro = self.BuscarPorNome(nome)
        if registro:
            session.delete(registro)
            session.commit()
            return True
        return False

    def AtualizarPorNome(self, nome, dados):
        registro = self.BuscarPorNome(nome)
        if not registro:
            return False

        registro.nome = dados.get("nome", registro.nome)
        registro.tipo = dados.get("tipo", registro.tipo)
        registro.link = dados.get("link", registro.link)

        session.commit()
        return True