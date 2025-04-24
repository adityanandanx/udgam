from flask import Blueprint

documents_bp = Blueprint("documents", __name__)
# Document routes are handled in ideas.py with the path /ideas/{ideaId}/documents
