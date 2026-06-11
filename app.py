from flask import Flask, render_template
from routes.projetos import register_projetos_routes

# Serve static from `static` and look for templates from project root
app = Flask(__name__, static_folder="static", template_folder='templates')

lista_de_projetos = []
register_projetos_routes(app, lista_de_projetos)

# 🏠 HOME
@app.route("/")
def index():
    return render_template("index.html")


# 📋 CRUD page (template will load JS which talks to the JSON API)
@app.route("/crud")
def crud():
    return render_template("crud.html")


if __name__ == "__main__":
    app.run(debug=True)