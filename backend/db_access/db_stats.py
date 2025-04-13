from database.schema import MatchStats
from backend.db_access.db_base import get_db_session

def get_stats_by_match(game_id: int):
    """Function to retrieve match statistics for a specific game from the database.

    Args:
        game_id (int): id of the game to retrieve stats for

    Returns:
        _type_: _description_
    """
    session = get_db_session()
    try:
        stats = session.query(MatchStats).filter(MatchStats.match_id == game_id).all()
        return stats
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
    finally:
        session.close()
        
def get_stats_by_team(team_id: int):
    """Function to retrieve all match statistics for a specific team from the database.
    
    Args:
        team_id (int): ID number of the team to retrieve statistics for.
    Returns:
        list: A list of MatchStats objects representing the match statistics for the specified team.
    """
    session = get_db_session()
    try:
        stats = session.query(MatchStats).filter(MatchStats.team_id == team_id).all()
        return stats
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
    finally:
        session.close()

def get_stats_by_match_and_team(match_id: int, team_id:int):
    """Function to retrieve match statistics for a specific game and team from the database.

    Args:
        game_id (int): id of the game to retrieve stats for
        team_id (int): id of the team to retrieve stats for

    Returns:
        : _description_
    """
    session = get_db_session()
    try:
        stats = session.query(MatchStats).filter(MatchStats.match_id == match_id, MatchStats.team_id == team_id).first()
        return stats
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
    finally:
        session.close()
        

def add_stat(stat_data):
    pass

def update_stat(stat_id, stat_data):
    pass

def delete_stat(stat_id):
    pass

if __name__ == "__main__":  
    # Example usage
    stats = get_stats_by_match(1)
    print(stats)
    stats = get_stats_by_team(1)
    print(stats)
    stats = get_stats_by_match_and_team(1, 1)
    print(stats)