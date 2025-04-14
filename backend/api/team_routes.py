from flask import Blueprint, jsonify
from backend.db_access.db_team import get_all_teams
teams_bp = Blueprint("teams", __name__, url_prefix="/teams")

@teams_bp.route("/", methods=["GET"])
def get_teams():
    """api route to get all teams

    Returns:
        json: _description_
    """
    teams = get_all_teams()
    return jsonify([{"name": team.name,"id": team.id, "home venue": team.home_venue} for team in teams]), 200

if __name__ == "__main__":
    # This is just for testing the blueprint independently
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(teams_bp)
    app.run(debug=True)