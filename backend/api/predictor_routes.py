from flask import Blueprint, request, jsonify
from sqlalchemy import extract
from sqlalchemy.exc import SQLAlchemyError

from backend.db_access.db_base import get_db_session
from backend.db_access.schema import Match

from backend.models.elo_predictor import predict_from_elo
from backend.models.elo_formula import calculate_elo

# from backend.models.model_trainer import ModelTrainer
# from backend.models.model_predictor import ModelPredictor

predictor_bp = Blueprint("predictor", __name__, url_prefix="/predictor")

@predictor_bp.route("/elo_model", methods=['POST'])
def elo_predict():
    prediction_request = request.get_json()
    session = get_db_session()

    if not prediction_request:
        return jsonify({"error": "Invalid JSON payload"}), 400

    try:
        k_value = prediction_request.get("k_value", 20)
        initial_elo = prediction_request.get("initial_elo", 1000)
        start_season = prediction_request.get("start_season", 2005)
        home_advantage = prediction_request.get("home_adv", 100)
        team1_id = prediction_request.get("team1_id")
        team2_id = prediction_request.get("team2_id")

        if team1_id is None or team2_id is None:
            return jsonify({"error": "Missing required fields: team1_id and/or team2_id"}), 400

        matches = (
            session.query(Match)
            .filter(extract('year', Match.date) >= start_season)
            .all()
        )

        elo_ratings = calculate_elo(matches, k_value, initial_elo, home_advantage)

        # Create a dict with keys as (team_id, date) and values as rating_after
        elo_dict = {
            (rating.team_id, rating.date): rating.rating_after for rating in elo_ratings
        }

        def get_latest_elo(team_id):
            # Filter all ratings for the team and get the one with the latest date
            team_elos = [(date, rating) for (tid, date), rating in elo_dict.items() if tid == team_id]
            if not team_elos:
                return initial_elo
            latest = max(team_elos, key=lambda x: x[0])
            return latest[1]

        team1_elo = get_latest_elo(team1_id)
        team2_elo = get_latest_elo(team2_id)

        expected_team1 = 1 / (1 + 10 ** ((team2_elo - team1_elo) / 400))
        expected_team2 = 1 - expected_team1

        return jsonify({
            "team1_id": team1_id,
            "team2_id": team2_id,
            "team1_elo": team1_elo,
            "team2_elo": team2_elo,
            "expected_team1": expected_team1,
            "expected_team2": expected_team2
        }), 200

    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500

    finally:
        session.close()