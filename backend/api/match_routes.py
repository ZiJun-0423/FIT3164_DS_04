from flask import Blueprint, jsonify
from backend.db_access.db_match import get_all_matches
matches_bp = Blueprint("matches", __name__, url_prefix="/matches")

@matches_bp.route("/", methods=["GET"])
def get_matches():
    """api route to get all matches

    Returns:
        json: _description_
    """
    matches = get_all_matches()
    return jsonify([{"date": match.date, "team1 id": match.team1_id, "team2 id": match.team2_id} for match in matches]), 200

if __name__ == "__main__":
    # This is just for testing the blueprint independently
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(matches_bp)
    app.run(debug=True)