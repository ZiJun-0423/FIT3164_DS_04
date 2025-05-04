from flask import Blueprint, jsonify
from sqlalchemy.exc import SQLAlchemyError
# from backend.db_access.db_match import db_get_all_matches
from backend.db_access.db_base import get_db_session
from backend.db_access.schema import Match
matches_bp = Blueprint("matches", __name__, url_prefix="/matches")

@matches_bp.route("/", methods=["GET"])
def get_all_matches():
    """api route to get all matches

    Returns:
        json: _description_
    """
    session = get_db_session()
    try:
        matches = session.query(Match).all()
        return jsonify([{"date": match.date, "round number": match.round_num, "team1 id": match.team1_id, "team2 id": match.team2_id, "team1 score": match.team1_score, "team2 score":match.team2_score, "winner":match.winner, "home team":match.home_team_id } for match in matches]), 200
    except SQLAlchemyError as e:
        print(f"sql error: {e}")
        return {"error": str(e)}, 500
    except Exception as e:
        print(f"error: {e}")
        return {"error": str(e)}, 500
    finally:
        session.close()
    
@matches_bp.route("/recent", methods=["GET"])
def get_recent_matches():
    """api route to get recent matches

    Returns:
        json: _description_
    """
    session = get_db_session()
    try:
        recent_matches = session.query(Match).order_by(Match.date.desc()).limit(5).all()
        return jsonify([{"date": match.date, "round number": match.round_num, "team1 id": match.team1_id, "team2 id": match.team2_id, "team1 score": match.team1_score, "team2 score":match.team2_score, "winner":match.winner, "home team":match.home_team_id } for match in recent_matches]), 200
    except SQLAlchemyError as e:
        print(f"sql error: {e}")
        return {"error": str(e)}, 500
    except Exception as e:
        print(f"error: {e}")
        return {"error": str(e)}, 500
    finally:
        session.close()
        
if __name__ == "__main__":
    # This is just for testing the blueprint independently
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(matches_bp)
    app.run(debug=True)