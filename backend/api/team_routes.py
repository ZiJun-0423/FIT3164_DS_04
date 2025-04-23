from flask import Blueprint, jsonify
from backend.db_access.db_team import db_get_all_teams
teams_bp = Blueprint("teams", __name__, url_prefix="/teams")

@teams_bp.route("/", methods=["GET"])
def get_all_teams():
    """api route to get all teams
e7
    Returns:
        json: _description_
    """
    teams = db_get_all_teams()
    return jsonify([{"name": team.name,"id": team.id, "home venue": team.home_venue} for team in teams]), 200

@teams_bp.route("/<int:team_id>", methods=["GET"])
def get_team_by_id(team_id):
    """api route to get a team by id

    Args:
        team_id (int): _description_

    Returns:
        json: _description_
    """
    teams = db_get_all_teams()
    team = next((team for team in teams if team.id == team_id), None)
    if team:
        return jsonify({"name": team.name, "id": team.id, "home venue": team.home_venue}), 200
    else:
        return jsonify({"error": "Team not found"}), 404

@teams_bp.route("/<string:team_name>", methods=["GET"])
def get_team_by_name(team_name):
    """api route to get a team by name

    Args:
        team_name (str): _description_

    Returns:
        json: _description_
    """
    teams = db_get_all_teams()
    team = next((team for team in teams if team.name.lower() == team_name.lower()), None)
    if team:
        return jsonify({"name": team.name, "id": team.id, "home venue": team.home_venue}), 200
    else:
        return jsonify({"error": "Team not found"}), 404
    
if __name__ == "__main__":
    # This is just for testing the blueprint independently
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(teams_bp)
    app.run(debug=True)