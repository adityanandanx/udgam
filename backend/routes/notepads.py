from flask import Blueprint, request, jsonify
from models.models import IdeaNotePad, Idea, db
from uuid import uuid4
from routes.auth import token_required

notepads_bp = Blueprint("notepads", __name__)


@notepads_bp.route("/ideas/<idea_id>/notepads", methods=["GET"])
@token_required
def list_notepads(current_user, idea_id):
    """List all notepads for a specific idea"""
    # Check if idea exists and belongs to the current user
    idea = Idea.query.get(idea_id)

    if not idea:
        return jsonify({"error": "Idea not found"}), 404

    # Check if idea belongs to the authenticated user
    if idea.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Query parameters: limit, offset
    limit = request.args.get("limit", 10, type=int)
    offset = request.args.get("offset", 0, type=int)

    # Get all notepads for this idea
    notepads = (
        IdeaNotePad.query.filter_by(idea_id=idea_id).limit(limit).offset(offset).all()
    )

    return (
        jsonify(
            [
                {
                    "id": notepad.id,
                    "idea_id": notepad.idea_id,
                    "user_id": notepad.user_id,
                    "title": notepad.title,
                    "content": notepad.content,
                    "createdAt": notepad.createdAt.isoformat() + "Z",
                    "updatedAt": notepad.updatedAt.isoformat() + "Z",
                }
                for notepad in notepads
            ]
        ),
        200,
    )


@notepads_bp.route("/ideas/<idea_id>/notepads", methods=["POST"])
@token_required
def create_notepad(current_user, idea_id):
    """Create a new notepad for an idea"""
    # Check if idea exists and belongs to the current user
    idea = Idea.query.get(idea_id)

    if not idea:
        return jsonify({"error": "Idea not found"}), 404

    # Check if idea belongs to the authenticated user
    if idea.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()

    if not data or not data.get("content"):
        return jsonify({"error": "Content is required"}), 400

    new_notepad = IdeaNotePad(
        id=str(uuid4()),
        idea_id=idea_id,
        user_id=current_user.id,
        title=data.get("title", "Untitled Notepad"),
        content=data["content"],
    )

    db.session.add(new_notepad)
    db.session.commit()

    return (
        jsonify(
            {
                "id": new_notepad.id,
                "idea_id": new_notepad.idea_id,
                "user_id": new_notepad.user_id,
                "title": new_notepad.title,
                "content": new_notepad.content,
                "createdAt": new_notepad.createdAt.isoformat() + "Z",
                "updatedAt": new_notepad.updatedAt.isoformat() + "Z",
            }
        ),
        201,
    )


@notepads_bp.route("/notepads/<notepad_id>", methods=["GET"])
@token_required
def get_notepad(current_user, notepad_id):
    """Get a specific notepad by ID"""
    notepad = IdeaNotePad.query.get(notepad_id)

    if not notepad:
        return jsonify({"error": "Notepad not found"}), 404

    # Check if notepad belongs to the authenticated user
    if notepad.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    return (
        jsonify(
            {
                "id": notepad.id,
                "idea_id": notepad.idea_id,
                "user_id": notepad.user_id,
                "title": notepad.title,
                "content": notepad.content,
                "createdAt": notepad.createdAt.isoformat() + "Z",
                "updatedAt": notepad.updatedAt.isoformat() + "Z",
            }
        ),
        200,
    )


@notepads_bp.route("/notepads/<notepad_id>", methods=["PUT"])
@token_required
def update_notepad(current_user, notepad_id):
    """Update a notepad"""
    data = request.get_json()
    notepad = IdeaNotePad.query.get(notepad_id)

    if not notepad:
        return jsonify({"error": "Notepad not found"}), 404

    # Check if notepad belongs to the authenticated user
    if notepad.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    if not data or not data.get("content"):
        return jsonify({"error": "Content is required"}), 400

    notepad.content = data["content"]

    # Only update title if provided
    if "title" in data:
        notepad.title = data["title"]

    db.session.commit()

    return (
        jsonify(
            {
                "id": notepad.id,
                "idea_id": notepad.idea_id,
                "user_id": notepad.user_id,
                "title": notepad.title,
                "content": notepad.content,
                "createdAt": notepad.createdAt.isoformat() + "Z",
                "updatedAt": notepad.updatedAt.isoformat() + "Z",
            }
        ),
        200,
    )


@notepads_bp.route("/notepads/<notepad_id>", methods=["DELETE"])
@token_required
def delete_notepad(current_user, notepad_id):
    """Delete a notepad"""
    notepad = IdeaNotePad.query.get(notepad_id)

    if not notepad:
        return jsonify({"error": "Notepad not found"}), 404

    # Check if notepad belongs to the authenticated user
    if notepad.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(notepad)
    db.session.commit()

    return "", 204
