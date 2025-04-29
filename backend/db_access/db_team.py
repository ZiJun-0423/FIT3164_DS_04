from backend.db_access.db_base import get_db_session
from backend.db_access.schema import Team
# from sqlalchemy.exc import IntegrityError

def db_get_all_teams():
    """get teams from database

    Returns:
       list of teams
    """
    session = get_db_session()
    try:
        return session.query(Team).all()
    
    finally:
        session.close()
    
def db_get_team_by_id(team_id:int):
    """get team by id from database
    this function retrieves a team from the database using the provided team ID.

    Args:
        team_id (int): ID number of team to retrieve
    """
    session = get_db_session()
    try:
        return session.query(Team).filter_by(id=team_id).first()
         
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
    
    finally:
        session.close()

def db_add_team(team_data):
    pass

def db_update_team(team_id, team_data):
    pass

def db_delete_team(team_id):
    pass

if __name__ == "__main__":
    # Example usage
    teams = db_get_all_teams()
    print(teams)
    team = db_get_team_by_id(1)
    print(team)