from flask import Blueprint, request, jsonify

market_bp = Blueprint("market", __name__)


@market_bp.route("/insights", methods=["GET"])
def get_market_insights():
    """Get market insights for a location"""
    # Query parameters: location, domain(optional)
    # TODO: Implement getting market insights
    return (
        jsonify(
            {
                "location": request.args.get("location", ""),
                "problems": [
                    {
                        "title": "Sample Problem",
                        "description": "Description of a problem in this market",
                        "severity": 7.5,
                        "opportunities": ["Opportunity 1", "Opportunity 2"],
                    }
                ],
                "demographics": {"population": 1000000, "averageIncome": 50000},
                "competitorCount": 5,
            }
        ),
        200,
    )
