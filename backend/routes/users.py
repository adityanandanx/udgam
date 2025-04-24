from flask import Blueprint, jsonify

users_bp = Blueprint("users", __name__)


@users_bp.route("/me", methods=["GET"])
def get_current_user():
    """Get current user profile"""
    # TODO: Implement getting current user
    return (
        jsonify(
            {
                "id": "sample-uuid",
                "username": "username",
                "email": "user@example.com",
                "firstName": "First",
                "lastName": "Last",
                "createdAt": "2023-01-01T00:00:00Z",
            }
        ),
        200,
    )
