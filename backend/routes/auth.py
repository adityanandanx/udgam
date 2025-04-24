from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user"""
    # Request contains username and password
    # TODO: Implement authentication logic
    return (
        jsonify(
            {
                "token": "sample_token",
                "user": {
                    "id": "sample-uuid",
                    "username": "username",
                    "email": "user@example.com",
                },
            }
        ),
        200,
    )


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register new user"""
    # Request contains username, email, password, firstName, lastName
    # TODO: Implement user registration
    return (
        jsonify(
            {
                "id": "sample-uuid",
                "username": "new_user",
                "email": "new_user@example.com",
                "firstName": "First",
                "lastName": "Last",
                "createdAt": "2023-01-01T00:00:00Z",
            }
        ),
        201,
    )
