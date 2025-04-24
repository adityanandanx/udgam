from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
from datetime import datetime, timedelta
import re
from functools import wraps

# Import User model and database
from models.models import User, db

auth_bp = Blueprint("auth", __name__)

# Email validation regex
EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check if token is in headers
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            # Decode token
            payload = jwt.decode(
                token, current_app.config.get("SECRET_KEY"), algorithms=["HS256"]
            )
            user_id = payload.get("user_id")
            current_user = User.query.get(user_id)

            if current_user is None:
                return jsonify({"error": "User not found"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except (jwt.InvalidTokenError, KeyError):
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user"""
    data = request.json

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing username or password"}), 400

    username = data.get("username")
    password = data.get("password")

    # Find user by username
    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Generate JWT token
    token_payload = {
        "user_id": user.id,
        "username": user.username,
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    token = jwt.encode(
        token_payload, current_app.config.get("SECRET_KEY"), algorithm="HS256"
    )

    return (
        jsonify(
            {
                "token": token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                },
            }
        ),
        200,
    )


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register new user"""
    data = request.json
    print(data)

    # Validate required fields
    required_fields = ["username", "email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate username format
    if not data["username"] or len(data["username"]) < 3:
        return jsonify({"error": "Username must be at least 3 characters"}), 400

    # Validate email format
    if not EMAIL_REGEX.match(data["email"]):
        return jsonify({"error": "Invalid email format"}), 400

    # Validate password length
    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    # Check if username already exists
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 400

    # Check if email already exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    # Create new user
    user_id = str(uuid.uuid4())
    new_user = User(
        id=user_id,
        username=data["username"],
        email=data["email"],
        firstName=data.get("firstName", ""),
        lastName=data.get("lastName", ""),
        password_hash=generate_password_hash(data["password"]),
        createdAt=datetime.utcnow(),
    )

    # Store user in database
    db.session.add(new_user)
    db.session.commit()

    # Return user data (excluding password)
    return jsonify(new_user.to_dict()), 201


# Helper function to get current user from token (for /users/me endpoint)
def get_user_from_token(token):
    """Extract user information from JWT token"""
    try:
        # Decode token
        payload = jwt.decode(
            token, current_app.config.get("SECRET_KEY"), algorithms=["HS256"]
        )
        user_id = payload.get("user_id")

        # Get user from database
        return User.query.get(user_id)

    except jwt.ExpiredSignatureError:
        return None
    except (jwt.InvalidTokenError, KeyError):
        return None

    return None
