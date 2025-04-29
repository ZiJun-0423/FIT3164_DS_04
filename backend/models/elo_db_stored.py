from backend.db_access.schema import EloRatings
import math
def calculate_elo_static(
    matches,
    k_value=20,
    initial_elo=1000,
    home_advantage=100,
    previous_season_weightage=0.75,
    new_team_default=1000
):
    """
    Static ELO calculation based on match history.

    Args:
        matches (list): List of Match objects
        k_value (int, optional): K-factor for ELO calculation.
        initial_elo (int, optional): Default ELO rating for existing teams.
        home_advantage (int, optional): Points added to home team ELO.
        previous_season_weightage (float, optional): Not used in static but kept for future.
        new_team_default (int, optional): Default ELO for completely new teams.

    Returns:
        list: List of [id, date, team_id, match_id, elo_before, elo_after] entries.
    """

    elo_ratings = {}  # team_id -> current elo
    elo_history = []  # list to store the output

    for match in sorted(matches, key=lambda x: x.date):
        team1_id = match.team1_id
        team2_id = match.team2_id
        team1_score = match.team1_score
        team2_score = match.team2_score
        match_id = match.id
        match_date = match.date
        home_team_id = match.home_team_id

        # Get current ratings or initialize
        team1_elo_before = elo_ratings.get(team1_id, initial_elo)
        team2_elo_before = elo_ratings.get(team2_id, initial_elo)

        # Apply home advantage
        if home_team_id == team1_id:
            team1_elo_adjusted = team1_elo_before + home_advantage
            team2_elo_adjusted = team2_elo_before
        elif home_team_id == team2_id:
            team1_elo_adjusted = team1_elo_before
            team2_elo_adjusted = team2_elo_before + home_advantage
        else:
            team1_elo_adjusted = team1_elo_before
            team2_elo_adjusted = team2_elo_before

        # Expected scores
        expected_team1 = 1 / (1 + 10 ** ((team2_elo_adjusted - team1_elo_adjusted) / 400))
        expected_team2 = 1 - expected_team1

        # Actual scores
        if team1_score > team2_score:
            actual_team1 = 1
            actual_team2 = 0
        elif team1_score < team2_score:
            actual_team1 = 0
            actual_team2 = 1
        else:
            actual_team1 = 0.5
            actual_team2 = 0.5

        # Margin of victory adjustment
        margin = abs(team1_score - team2_score)
        elo_diff = team1_elo_before - team2_elo_before

        mov_multiplier = math.log(margin + 1) * (2.2 / ((abs(elo_diff) * 0.001) + 2.2))
            
        # Update ELO ratings
        team1_elo_after = team1_elo_before + k_value * (actual_team1 - expected_team1) * mov_multiplier
        team2_elo_after = team2_elo_before + k_value * (actual_team2 - expected_team2)  * mov_multiplier

        # Save to history
        elo_history.append(
            EloRatings(date=match_date, team_id=team1_id, match_id=match_id, rating_before=team1_elo_before, rating_after=team1_elo_after)
        )
        elo_history.append(
            EloRatings(date=match_date, team_id=team2_id, match_id=match_id, rating_before=team2_elo_before, rating_after=team2_elo_after)
        )

        # Update current ratings
        elo_ratings[team1_id] = team1_elo_after
        elo_ratings[team2_id] = team2_elo_after

    return elo_history

if __name__ == "__main__":
    # Simple test
    from backend.db_access.db_match import db_get_all_matches
    matches = db_get_all_matches()
    
    elo_ratings = calculate_elo_static(matches, k_value=20, initial_elo=1000, home_advantage=100)
    from backend.db_access.db_base import get_db_session
    session = get_db_session()
    session.bulk_save_objects(elo_ratings)
    session.commit()
    session.close()