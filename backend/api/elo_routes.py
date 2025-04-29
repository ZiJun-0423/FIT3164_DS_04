from flask import Blueprint, jsonify, request
import backend.db_access.db_elo as db_elo
from backend.models.elo_db_stored import calculate_elo_static
elo_bp = Blueprint("elo", __name__, url_prefix="/elo")

@elo_bp.route("/", methods=["GET"])
def get_all_elo():
    """API route to get all ELO ratings."""
    elo_ratings = db_elo.db_get_all_elo()
    if isinstance(elo_ratings, dict) and "error" in elo_ratings:
        return jsonify({"error": elo_ratings["error"]}), 500
    return jsonify([{"date": rating.date, "team_id": rating.team_id, "rating": rating.rating_after} for rating in elo_ratings]), 200

@elo_bp.route("/filter_by_team_id/<int:team_id>", methods=["GET"])
def get_elo_by_team_id(team_id):
    """API route to get ELO ratings by team ID."""
    elo_ratings = db_elo.db_get_elo_by_team_id(team_id)
    if isinstance(elo_ratings, dict) and "error" in elo_ratings:
        return jsonify({"error": elo_ratings["error"]}), 500
    return jsonify([{"date": rating.date, "team_id": rating.team_id, "rating": rating.rating_after} for rating in elo_ratings]), 200

@elo_bp.route("/force_update_on_user", methods=["POST"])
def force_update_db_elo():
    """API route to force update ELO ratings in the database on user settings."""
    data = request.get_json()
    if not data or "matches" not in data:
        return jsonify({"error": "Invalid input"}), 400

    matches = data["matches"]
    k_value = data.get("k_value", 20)
    initial_elo = data.get("initial_elo", 1000)
    home_advantage = data.get("home_advantage", 100)

    elo_ratings = calculate_elo_static(matches, k_value, initial_elo, home_advantage)

    db_elo.db_create_elo_rating(elo_ratings)
    return jsonify({"message": "ELO ratings updated successfully"}), 200