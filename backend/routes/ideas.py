from flask import Blueprint, request, jsonify
from models.models import Idea, db
from uuid import uuid4
from routes.auth import token_required
from utils.idea_to_markdown import idea_to_markdown
from heatmap_agent.heatmap_agent import agent


ideas_bp = Blueprint("ideas", __name__)


@ideas_bp.route("", methods=["GET"])
@token_required
def list_ideas(current_user):
    """List all ideas for the authenticated user"""
    # Query parameters: limit, offset
    limit = request.args.get("limit", 10, type=int)
    offset = request.args.get("offset", 0, type=int)

    # Filter ideas by the current authenticated user
    ideas = (
        Idea.query.filter_by(user_id=current_user.id).limit(limit).offset(offset).all()
    )

    return (
        jsonify(
            [
                {
                    "id": idea.id,
                    "user_id": idea.user_id,
                    "title": idea.title,
                    "short_desc": idea.short_desc,
                    "nodes": idea.nodes,
                    "edges": idea.edges,
                }
                for idea in ideas
            ]
        ),
        200,
    )


@ideas_bp.route("", methods=["POST"])
@token_required
def create_idea(current_user):
    """Create a new idea"""
    data = request.get_json()

    if not data or not data.get("title") or not data.get("short_desc"):
        return jsonify({"error": "Missing required fields"}), 400

    new_idea = Idea(
        id=str(uuid4()),
        user_id=current_user.id,
        title=data["title"],
        short_desc=data["short_desc"],
        nodes=data.get("nodes"),
        edges=data.get("edges"),
    )

    db.session.add(new_idea)
    db.session.commit()

    return (
        jsonify(
            {
                "id": new_idea.id,
                "user_id": new_idea.user_id,
                "title": new_idea.title,
                "short_desc": new_idea.short_desc,
                "nodes": new_idea.nodes,
                "edges": new_idea.edges,
            }
        ),
        201,
    )


@ideas_bp.route("/<idea_id>", methods=["GET"])
@token_required
def get_idea(current_user, idea_id):
    """Get idea by ID"""
    idea = Idea.query.get(idea_id)

    if not idea:
        return jsonify({"error": "Idea not found"}), 404

    # Check if idea belongs to the authenticated user
    if idea.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    return (
        jsonify(
            {
                "id": idea.id,
                "user_id": idea.user_id,
                "title": idea.title,
                "short_desc": idea.short_desc,
                "nodes": idea.nodes,
                "edges": idea.edges,
            }
        ),
        200,
    )


@ideas_bp.route("/<idea_id>", methods=["PUT"])
@token_required
def update_idea(current_user, idea_id):
    """Update an idea"""
    data = request.get_json()
    idea = Idea.query.get(idea_id)

    if not idea:
        return jsonify({"error": "Idea not found"}), 404

    # Check if idea belongs to the authenticated user
    if idea.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    if "title" in data:
        idea.title = data["title"]
    if "short_desc" in data:
        idea.short_desc = data["short_desc"]
    if "nodes" in data:
        idea.nodes = data["nodes"]
    if "edges" in data:
        idea.edges = data["edges"]

    db.session.commit()

    return (
        jsonify(
            {
                "id": idea.id,
                "user_id": idea.user_id,
                "title": idea.title,
                "short_desc": idea.short_desc,
                "nodes": idea.nodes,
                "edges": idea.edges,
            }
        ),
        200,
    )


@ideas_bp.route("/<idea_id>", methods=["DELETE"])
@token_required
def delete_idea(current_user, idea_id):
    """Delete an idea"""
    idea = Idea.query.get(idea_id)

    if not idea:
        return jsonify({"error": "Idea not found"}), 404

    # Check if idea belongs to the authenticated user
    if idea.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(idea)
    db.session.commit()

    return "", 204


@ideas_bp.route("/<idea_id>/validate", methods=["POST"])
@token_required
def validate_idea(current_user, idea_id):
    """Validate an idea"""
    idea = Idea.query.get(idea_id)

    if not idea:
        return jsonify({"error": "Idea not found"}), 404

    # Check if idea belongs to the authenticated user
    if idea.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Simple placeholder validation
    validation_result = {
        "id": idea.id,
        "score": 7.5,
        "marketFitScore": 8.0,
        "feasibilityScore": 7.0,
        "innovationScore": 8.5,
        "insights": [
            {
                "aspect": "marketFit",
                "description": "The idea shows good market potential",
            },
            {
                "aspect": "implementation",
                "description": "Consider technological feasibility",
            },
        ],
    }

    return (
        jsonify(validation_result),
        200,
    )


@ideas_bp.route("/<idea_id>/generate-heatmap", methods=["GET"])
@token_required
def generate_heatmap(current_user, idea_id):
    """Generate heatmap of an idea"""
    idea = Idea.query.get(idea_id)

    if not idea:
        return jsonify({"error": "Idea not found"}), 404

    # Check if idea belongs to the authenticated user
    if idea.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    md = idea_to_markdown(idea)

    print(md)

    result = agent.invoke({"idea": md})

    return (
        jsonify(result["heatmap"]),
        200,
    )


# @ideas_bp.route("/generate", methods=["POST"])
# def generate_ideas():
#     """Generate new idea suggestions"""
#     # TODO: Implement idea generation
#     return (
#         jsonify(
#             {
#                 "ideas": [
#                     {
#                         "title": "Generated Idea",
#                         "description": "Description of generated idea",
#                         "problemStatement": "Problem statement",
#                         "potentialMarkets": ["Market 1", "Market 2"],
#                         "preliminaryScore": 8.0,
#                     }
#                 ]
#             }
#         ),
#         200,
#     )


# @ideas_bp.route("/refine", methods=["POST"])
# def refine_idea():
#     """Refine an existing idea"""
#     # TODO: Implement idea refinement
#     return (
#         jsonify(
#             {
#                 "originalIdea": {
#                     "id": "idea-uuid",
#                     "userId": "user-uuid",
#                     "title": "Original Idea",
#                     "status": "active",
#                 },
#                 "refinements": [
#                     {
#                         "aspect": "marketFit",
#                         "suggestion": "Target audience could be expanded",
#                         "reasoning": "Based on market trends",
#                     }
#                 ],
#             }
#         ),
#         200,
#     )


# @ideas_bp.route("/<idea_id>/documents", methods=["GET"])
# def list_documents(idea_id):
#     """List documents for an idea"""
#     # TODO: Implement document listing
#     return (
#         jsonify(
#             [
#                 {
#                     "id": "doc-uuid",
#                     "ideaId": idea_id,
#                     "type": "businessPlan",
#                     "content": "# Business Plan\nContent here",
#                     "format": "markdown",
#                     "createdAt": "2023-01-01T00:00:00Z",
#                 }
#             ]
#         ),
#         200,
#     )


# @ideas_bp.route("/<idea_id>/documents", methods=["POST"])
# def create_document(idea_id):
#     """Generate a new document for an idea"""
#     # TODO: Implement document creation
#     return (
#         jsonify(
#             {
#                 "id": "doc-uuid",
#                 "ideaId": idea_id,
#                 "type": "businessPlan",
#                 "content": "# Business Plan\nContent here",
#                 "format": "markdown",
#                 "createdAt": "2023-01-01T00:00:00Z",
#             }
#         ),
#         201,
#     )
