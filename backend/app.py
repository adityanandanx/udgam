from flask import Flask
from routes.auth import auth_bp
from routes.users import users_bp
from routes.ideas import ideas_bp
from routes.market import market_bp
from routes.documents import documents_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/v1/auth")
app.register_blueprint(users_bp, url_prefix="/v1/users")
app.register_blueprint(ideas_bp, url_prefix="/v1/ideas")
app.register_blueprint(market_bp, url_prefix="/v1/market")

if __name__ == "__main__":
    app.run(debug=True)
