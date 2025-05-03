from datetime import datetime
from collections import defaultdict
from sqlalchemy import extract
from backend.db_access.db_base import get_db_session
from backend.db_access.schema import Team, Match, EloRatings
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

def db_add_team(team_data:list):
    """Function to add team to db

    Args:
        team_data (list): list of dicts in the format:
        {
            name: (str),
            home_venue: (str)
        }
    """
    input_data = []
    for team in team_data:
        input_data.append(
            Team(
                name=team['name'],
                home_venue=team['home_venue']
            )
        )
    session = get_db_session()
    try:
        session.bulk_save_objects(input_data)
        session.commit
        
    except Exception as e:
        session.rollback()
        print(f"Error adding teams to database: {e}")
    finally:
        session.close()
        
def db_update_team(team_id, team_data):
    pass

def db_delete_team(team_id):
    pass

def db_get_team_rankings(date: datetime):
    """function to team ranking data in the date's season, up to specified date

    Args:
        date (datetime): 'current' date
    """
    session = get_db_session()
    try:
        current_teams = (
            session.query(Match.team1_id)
            .filter(
                extract('year', Match.date) == date.year
            )
            .union(
                session.query(Match.team2_id)
                .filter(
                    extract('year', Match.date) == date.year
                )
            )
            .distinct()
            .all()
        )
        current_team_ids = [tid[0] for tid in current_teams]

        team_stats = defaultdict(lambda: {
            'points_for': 0,
            'points_against': 0,
            'wins': 0,
            'losses': 0,
            'win_streak': 0,
            'last_result': None  # track whether previous was a win/loss
        })

        for match in matches:
            t1 = match.team1_id
            t2 = match.team2_id
            s1 = match.team1_score
            s2 = match.team2_score

            # Update points for/against
            team_stats[t1]['points_for'] += s1
            team_stats[t1]['points_against'] += s2
            team_stats[t2]['points_for'] += s2
            team_stats[t2]['points_against'] += s1

            # Determine winner and update win/loss + streaks
            if s1 > s2:
                winner, loser = t1, t2
            elif s2 > s1:
                winner, loser = t2, t1
            else:
                winner = loser = None  # A draw, handle if needed

            for team_id in [t1, t2]:
                if team_id == winner:
                    team_stats[team_id]['wins'] += 1
                    # update streak
                    if team_stats[team_id]['last_result'] == 'W':
                        team_stats[team_id]['win_streak'] += 1
                    else:
                        team_stats[team_id]['win_streak'] = 1
                    team_stats[team_id]['last_result'] = 'W'
                elif team_id == loser:
                    team_stats[team_id]['losses'] += 1
                    team_stats[team_id]['win_streak'] = 0
                    team_stats[team_id]['last_result'] = 'L'

        # Optional: format this as a list of dicts or with ranks/percentages
        return team_stats
    
    except Exception as e:
        session.rollback()  # Rollback the transaction in case of an error
        print(f"Error fetching team rankings: {e}")
        return None

if __name__ == "__main__":
    # Example usage
    # teams = db_get_all_teams()
    # print(teams)
    # team = db_get_team_by_id(1)
    # print(team)
    stats = db_get_team_rankings(datetime(2023, 4, 23))
    print(stats)
