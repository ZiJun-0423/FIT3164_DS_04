from flask import Blueprint, jsonify, request
from sqlalchemy import extract
# import backend.db_access.db_elo as db_elo
from backend.models.elo_formula import calculate_elo
from backend.db_access.db_base import get_db_session
from backend.db_access.schema import EloRatings, Match
from sqlalchemy.exc import SQLAlchemyError
elo_bp = Blueprint("elo", __name__, url_prefix="/elo")

@elo_bp.route("/", methods=["GET"])
def get_all_elo():
    """API route to get all ELO ratings."""
    session = get_db_session()
    try:
        elo_ratings = (session
            .query(EloRatings)
            .order_by(EloRatings.date.desc())
            .all()
        )
        
        return jsonify([{
            "date": rating.date, 
            "match_id": rating.match_id, 
            "team_id": rating.team_id, 
            "rating_after": round(rating.rating_after, 2), 
            "rating_before": round(rating.rating_before, 2), 
            "rating_change": round(rating.rating_change, 2)
        } for rating in elo_ratings]), 200
        
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        session.close()
        
@elo_bp.route("/filter_by_team_id/<int:team_id>", methods=["GET"])
def get_elo_by_team_id(team_id):
    """API route to get ELO ratings by team ID."""
    session = get_db_session()
    try:
        elo_ratings = (session
            .query(EloRatings)
            .filter(EloRatings.team_id == team_id)
            .order_by(EloRatings.date.desc())
            .all()
        )
        return jsonify([{
            "date": rating.date, 
            "match_id": rating.match_id, 
            "team_id": rating.team_id, 
            "rating_after": round(rating.rating_after, 2), 
            "rating_before": round(rating.rating_before, 2), 
            "rating_change": round(rating.rating_change, 2)
        } for rating in elo_ratings]), 200
        
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        session.close()

@elo_bp.route("/dynamic", methods=["POST"])
def get_dynamic_elo():
    """API route to get dynamic ELO ratings.
    """
    settings = request.get_json()
    session = get_db_session()
    if not settings:
        return jsonify({"error": "Invalid JSON payload"}), 400
    try:
        try:
            k_value = settings.get("k_value", 20)
            initial_elo = settings.get("initial_elo", 1000)
            start_season = settings.get("start_season", 2005)
            home_advantage = settings.get("home_adv",100)
        except KeyError as e:
            return jsonify({"error": f"Missing setting: {e}"}), 400
        
        matches = (session.query(Match)
                   .filter(extract('year', Match.date) >= start_season)
                   .all())
        elo_ratings = calculate_elo(matches, k_value, initial_elo, home_advantage)
        
        return jsonify([{
            "date": rating.date, 
            "match_id": rating.match_id, 
            "team_id": rating.team_id, 
            "rating_after": round(rating.rating_after, 2), 
            "rating_before": round(rating.rating_before, 2), 
            "rating_change": round(rating.rating_change, 2)
        } for rating in elo_ratings]), 200
        
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        session.close()