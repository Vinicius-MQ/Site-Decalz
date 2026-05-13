from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import DeclarativeBase, sessionmaker

engine = create_engine("sqlite:///banco.db")


class base(DeclarativeBase):
    pass


session = sessionmaker(bind=engine)()


class projeto(base):
    __tablename__ = "projetos"


    nome = Column(String,primary_key=True)
    tipo = Column(String)
    link = Column(String)
    def __init__(self,nome,tipo,link):
        self.nome=nome
        self.tipo=tipo
        self.link=link


base.metadata.create_all(engine)