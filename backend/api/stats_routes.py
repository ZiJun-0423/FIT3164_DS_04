from flask import Blueprint, jsonify, request
from backend.db_access.db_base import get_db_session
from sqlalchemy.exc import SQLAlchemyError
from backend.db_access.schema import MatchStats
stats_bp = Blueprint("stats", __name__, url_prefix="/stats")

@stats_bp.route("/", methods=["GET"])
def get_all_stats():
    """API route to get all match statistics.
    input: None
    returns: JSON list of all match statistics
    """
    session = get_db_session()
    try:
        stats = session.query(MatchStats).all()
        return jsonify([s.to_dict() for s in stats]), 200
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        session.close()
        
@stats_bp.route("/filter_by_team_id/<int:team_id>", methods=["GET"])
def get_stats_by_team_id(team_id:int):
    """API route to get match statistics for a specific team.
    input: team_id(int)
    output: JSON list of all match statistics for the team
    """
    session = get_db_session()
    try:
        stats = session.query(MatchStats).filter(MatchStats.team_id == team_id).all()
        if stats:
            return jsonify([s.to_dict() for s in stats]), 200
        else:
            return jsonify({"error": "No statistics found for this team"}), 404
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        session.close()
        
@stats_bp.route("/filter_by_match_id/<int:match_id>", methods=["GET"])
def get_stats_by_match_id(match_id:int):
    """API route to get match statistics for a specific match.

    Args:
        match_id (int): match_id

    Returns:
        JSON list of all match statistics for the match
    """
    session = get_db_session()
    try:
        stats = (session.query(MatchStats)
            .filter(MatchStats.match_id == match_id)
            .all()
        )
        if stats:
            return jsonify([s.to_dict() for s in stats]), 200
        else:
            return jsonify({"error": "No statistics found for this match"}), 404
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        session.close()
    
@stats_bp.route("/filter_by_match_id_and_team_id/<int:match_id>/<int:team_id>", methods=["GET"])
def get_stats_by_team_id_and_match_id(team_id, match_id):
    """API route to get match statistics for a specific team and match.
    input: team_id(int), match_id(int)
    output: JSON list of all match statistics for the team and match
    """
    session = get_db_session()
    try:
        stats = (session.query(MatchStats)
            .filter(MatchStats.match_id == match_id)
            .filter(MatchStats.team_id == team_id)
            .all()
        )
        if stats:
            return jsonify([s.to_dict() for s in stats]), 200
        else:
            return jsonify({"error": "No statistics found for this team and match."}), 404
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        session.close()