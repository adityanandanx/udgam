from flask import Blueprint, jsonify
from routes.auth import token_required

users_bp = Blueprint("users", __name__)


@users_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    """Get current user profile"""
    return jsonify(current_user.to_dict()), 200
