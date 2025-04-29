from flask import Blueprint, jsonify, request
from backend.db_access.db_stats import db_get_all_stats, db_get_stats_by_team_id, db_get_stats_by_match_and_team
stats_bp = Blueprint("stats", __name__, url_prefix="/stats")

@stats_bp.route("/", methods=["GET"])
def get_all_stats():
    """API route to get all match statistics."""
    stats = db_get_all_stats()
    return jsonify([{"match_id": stat.match_id, "team_id": stat.team_id} for stat in stats]), 200

@stats_bp.route("/filter_by_team_id/<int:team_id>", methods=["GET"])
def get_stats_by_team_id(team_id):
    """API route to get match statistics for a specific team."""
    stats = db_get_stats_by_team_id(team_id)
    return jsonify([{"match_id": stat.match_id, "team_id": stat.team_id} for stat in stats]), 200

@stats_bp.route("/filter_by_match_id/<int:match_id>", methods=["GET"])
def get_stats_by_match_id(match_id):
    """API route to get match statistics for a specific match."""
    stats = db_get_stats_by_match_id(match_id)
    if stats:
        return jsonify([{"match_id": stat.match_id, "team_id": stat.team_id} for stat in stats]), 200
    else:
        return jsonify({"error": "No statistics found for this match"}), 404
    
@stats_bp.route("/filter_by_team_id_and_match_id/<int:team_id>/<int:match_id>", methods=["GET"])
def get_stats_by_team_id_and_match_id(team_id, match_id):
    """API route to get match statistics for a specific team and match."""
    stats = db_get_stats_by_match_and_team(match_id, team_id)
    if stats:
        return jsonify([{"match_id": stat.match_id, "team_id": stat.team_id} for stat in stats]), 200
    else:
        return jsonify({"error": "No statistics found for this match and team"}), 404