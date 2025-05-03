from datetime import datetime
from flask import Blueprint, jsonify
from sqlalchemy import extract, func, case
from sqlalchemy.exc import SQLAlchemyError
from backend.db_access.db_base import get_db_session
from backend.db_access.schema import Team, Match, EloRatings
# from backend.db_access.db_team import db_get_all_teams, db_get_team_by_id, db_get_team_rankings

teams_bp = Blueprint("teams", __name__, url_prefix="/teams")

@teams_bp.route("/", methods=["GET"])
def get_all_teams():
    """api route to get all teams
e7
    Returns:
        json: _description_
    """
    session = get_db_session()
    try:
        teams = session.query(Team).all()
        return jsonify([{"name": team.name,"id": team.id, "home venue": team.home_venue} for team in teams]), 200
    
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
    
    finally:
        session.close()
    
@teams_bp.route("/<int:team_id>", methods=["GET"])
def get_team_by_id(team_id):
    """api route to get a team by id

    Args:
        team_id (int): _description_

    Returns:
        json: _description_
    """
    session = get_db_session()
    try:
        team = session.query(Team).filter_by(id=team_id).first()
        if team:
            return jsonify({"name": team.name, "id": team.id, "home venue": team.home_venue}), 200
        else:
            return jsonify({"error": "Team not found"}), 404
             
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
    
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error"}), 500
        
    finally:
        session.close()
    
@teams_bp.route("/rankings/<string:date_str>", methods=["GET"])
def get_team_rankings(date_str):
    """
    Returns team rankings up to the input date.
    Format:
    {
        team_id,
        points_for,
        points_against,
        wins,
        losses,
        draws
    }
    """
    session = get_db_session()
    try:
        date = datetime.strptime(date_str, "%d-%m-%Y")

        # Get all teams that have played in the current year
        team_ids_query = (
            session.query(Match.team1_id)
            .filter(extract('year', Match.date) == date.year)
            .union(
                session.query(Match.team2_id).filter(extract('year', Match.date) == date.year)
            )
            .all()
        )
        team_ids = [t[0] for t in team_ids_query]

        rankings = []

        for team_id in team_ids:
            # team1 perspective
            t1 = session.query(
                func.sum(Match.team1_score).label("pf"),
                func.sum(Match.team2_score).label("pa"),
                func.sum(case((Match.winner == team_id, 1), else_=0)).label("wins"),
                func.sum(case((Match.winner == None, 1), else_=0)).label("draws"),
                func.sum(case(((Match.winner != team_id) & (Match.winner != None), 1), else_=0)).label("losses")
            ).filter(
                extract('year', Match.date) == date.year,
                Match.date < date,
                Match.team1_id == team_id
            )

            # team2 perspective
            t2 = session.query(
                func.sum(Match.team2_score).label("pf"),
                func.sum(Match.team1_score).label("pa"),
                func.sum(case((Match.winner == team_id, 1), else_=0)).label("wins"),
                func.sum(case((Match.winner == None, 1), else_=0)).label("draws"),
                func.sum(case(((Match.winner != team_id) & (Match.winner != None), 1), else_=0)).label("losses")
            ).filter(
                extract('year', Match.date) == date.year,
                Match.date < date,
                Match.team2_id == team_id
            )

            all_rows = t1.union_all(t2).all()

            # Accumulate totals
            total = {
                "team_id": team_id,
                "points_for": 0,
                "points_against": 0,
                "wins": 0,
                "losses": 0,
                "draws": 0
            }
            for row in all_rows:
                total["points_for"] += row.pf or 0
                total["points_against"] += row.pa or 0
                total["wins"] += row.wins or 0
                total["losses"] += row.losses or 0
                total["draws"] += row.draws or 0

            rankings.append(total)

        return jsonify(rankings), 200
    finally:
        session.close()
    
if __name__ == "__main__":
    # This is just for testing the blueprint independently
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(teams_bp)
    app.run(debug=True)