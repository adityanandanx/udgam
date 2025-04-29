from flask import Flask
from flask_cors import CORS
import os
from models.models import db
from routes.auth import auth_bp
from routes.users import users_bp
from routes.ideas import ideas_bp
from routes.market import market_bp
from routes.documents import documents_bp
from routes.notepads import notepads_bp
from flask_migrate import Migrate


def create_app(test_config=None):
    # Create Flask app
    app = Flask(__name__)

    # Configure app
    if test_config is None:
        # Default configuration
        app.config.from_mapping(
            SECRET_KEY=os.environ.get("SECRET_KEY", "dev_key_for_testing"),
            SQLALCHEMY_DATABASE_URI=os.environ.get(
                "DATABASE_URL", "sqlite:///udgam.db"
            ),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
        )
    else:
        # Test configuration
        app.config.from_mapping(test_config)

    # Initialize extensions
    CORS(app, origins=["*"], supports_credentials=True)
    db.init_app(app)
    migrate = Migrate(app, db)

    # Create tables if they don't exist
    # with app.app_context():
    #     db.create_all()

    # Register API prefix
    api_prefix = "/v1"

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix=f"{api_prefix}/auth")
    app.register_blueprint(users_bp, url_prefix=f"{api_prefix}/users")
    app.register_blueprint(ideas_bp, url_prefix=f"{api_prefix}/ideas")
    app.register_blueprint(market_bp, url_prefix=f"{api_prefix}/market")
    app.register_blueprint(documents_bp, url_prefix=f"{api_prefix}/documents")
    app.register_blueprint(notepads_bp, url_prefix=f"{api_prefix}")

    @app.route("/")
    def health_check():
        return {"status": "ok"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
