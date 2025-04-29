from mysql.connector import Error
from backend.db_access.db_base import get_db_session
from database.schema import EloRatings
from sqlalchemy.exc import SQLAlchemyError

def db_get_all_elo():
    """access the database and get all ELO ratings.

    Returns:
        list: list of EloRatings objects.
        dict: error message if an error occurs.
    """
    session = get_db_session()
    try:
        elo_ratings = session.query(EloRatings).all()
        return elo_ratings
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Database error occurred: {e}")
        return {"error": str(e)}
    finally:
        session.close()

def db_get_elo_by_team_id(team_id):
    session = get_db_session()
    try:
        elo_ratings = session.query(EloRatings).filter(EloRatings.team_id == team_id).all()
        return elo_ratings
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Database error occurred: {e}")
        return {"error": str(e)}
    finally:
        session.close()

def db_update_elo_rating(team_id, date, new_rating):
    pass
def db_create_elo_rating(elo_ratings: list):
    """
    Create ELO ratings in the database.

    Args:
        elo_ratings (list): List of ELO ratings to create.
    """
    session = get_db_session()
    try:
        session.bulk_save_objects(elo_ratings)
        session.commit()
        
    except SQLAlchemyError as e:
        session.rollback()  # <- important: roll back the session on error
        print(f"Database error occurred: {e}")
        return {"error": str(e)}
    
    finally:
        session.close()
        
def db_delete_all_elo_rating(elo_ratings: list):
    """
    Delete ELO ratings from the database.

    Args:
        elo_ratings (list): List of ELO ratings to delete.
    """
    session = get_db_session()
    try:
        session.query(EloRatings).delete()
        session.commit()
        
    except SQLAlchemyError as e:
        session.rollback()  # <- important: roll back the session on error
        print(f"Database error occurred: {e}")
        return {"error": str(e)}
    
    finally:
        session.close()
        
if __name__ == "__main__":
    # Example usage
    elo_ratings = db_get_all_elo()
    print(elo_ratings)
    elo_by_team = db_get_elo_by_team_id(1)
    print(elo_by_team)