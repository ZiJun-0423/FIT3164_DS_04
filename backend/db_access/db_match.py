from .db_base import get_db_session
from backend.db_access.schema import Match

def db_get_all_matches():
    """get all matches from database

    Returns:
        list of matches
    """
    session = get_db_session()
    try:
        return session.query(Match).all()
    
    finally:
        session.close()

def db_get_match_by_id(game_id):
    """get game by id from database
    this function retrieves a game from the database using the provided game ID.

    Args:
        game_id (int): ID number of game to retrieve
    """
    session = get_db_session()
    try:
        return session.query(Match).filter_by(id=game_id).first()
            
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
    
    finally:
        session.close()

def db_add_game(game_data):
    pass

def Db_update_game(game_id, game_data):
    pass

def db_delete_game(game_id):
    pass

if __name__ == "__main__":
    # Example usage
    matches = db_get_all_matches()
    print(matches)
    match = db_get_match_by_id(1)
    print(match)