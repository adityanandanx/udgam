from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_caching import Cache

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
cache = Cache()


def init_extensions(app):
    """Initialize all Flask extensions"""
    db.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)
