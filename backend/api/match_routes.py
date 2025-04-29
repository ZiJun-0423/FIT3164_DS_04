from flask import Blueprint, jsonify
from backend.db_access.db_match import db_get_all_matches
matches_bp = Blueprint("matches", __name__, url_prefix="/matches")

@matches_bp.route("/", methods=["GET"])
def get_matches():
    """api route to get all matches

    Returns:
        json: _description_
    """
    matches = db_get_all_matches()
    return jsonify([{"date": match.date, "round number": match.round_num, "team1 id": match.team1_id, "team2 id": match.team2_id, "team1 score": match.team1_score, "team2 score":match.team2_score, "winner":match.winner, "home team":match.home_team_id } for match in matches]), 200

if __name__ == "__main__":
    # This is just for testing the blueprint independently
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(matches_bp)
    app.run(debug=True)