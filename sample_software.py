def calculate_elo(
    matches,
    k_value=20,
    initial_elo=1000,
    home_advantage=100
):
    """
    Dynamic ELO calculation formula based on match history. 
    accepts settings for k_value, initial_elo, home_advantage
    returns a list of EloRatings objects
    allows for calculation of all elo ratings for each team since 1897 - objective 1 in the RTM
    allows for dynamic k_value, initial_elo, home_advantage - objective 2 in the RTM

    Args:
        matches (list): List of Match objects
        k_value (int, optional): K-factor for ELO calculation.
        initial_elo (int, optional): Default ELO rating for existing teams.
        home_advantage (int, optional): Points added to home team ELO.
        previous_season_weightage (float, optional): Not used in static but kept for future.
        new_team_default (int, optional): Default ELO for completely new teams.

    Returns:
        list: List of EloRating entries.
    """

    elo_ratings = {}  # team_id -> current elo
    elo_history = []  # list to store the EloRatings objects

    for match in sorted(matches, key=lambda x: x.date):
        # Get match data from Match objects
        team1_id = match.team1_id
        team2_id = match.team2_id
        team1_score = match.team1_score
        team2_score = match.team2_score
        match_id = match.id
        match_date = match.date
        home_team_id = match.home_team_id

        # Get current ratings or initialize to settings' initial_elo
        team1_elo_before = elo_ratings.get(team1_id, initial_elo)
        team2_elo_before = elo_ratings.get(team2_id, initial_elo)

        # Apply home advantage to home team
        if home_team_id == team1_id:
            team1_elo_adjusted = team1_elo_before + home_advantage
            team2_elo_adjusted = team2_elo_before
        elif home_team_id == team2_id:
            team1_elo_adjusted = team1_elo_before
            team2_elo_adjusted = team2_elo_before + home_advantage
        else:
            team1_elo_adjusted = team1_elo_before
            team2_elo_adjusted = team2_elo_before

        # calculate expected scores
        expected_team1 = 1 / (1 + 10 ** ((team2_elo_adjusted - team1_elo_adjusted) / 400))
        expected_team2 = 1 - expected_team1

        # Actual win-loss.
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

        # append EloRatings object (SQLAlchemy obj) to history lists
        elo_history.append(
            EloRatings(date=match_date, team_id=team1_id, match_id=match_id, rating_before=team1_elo_before, rating_after=team1_elo_after, rating_change=team1_elo_after - team1_elo_before)
        )
        elo_history.append(
            EloRatings(date=match_date, team_id=team2_id, match_id=match_id, rating_before=team2_elo_before, rating_after=team2_elo_after, rating_change=team2_elo_after - team2_elo_before)
        )

        # Update current ratings dictionary
        elo_ratings[team1_id] = team1_elo_after
        elo_ratings[team2_id] = team2_elo_after

    return elo_history

#Example call in database_initializer.py to store static elo ratings in the database
session = get_db_session() 
matches = session.query(Match).all()
elo_ratings = calculate_elo(matches, k_value=20, initial_elo=1000, home_advantage=100) #call function to calculate elo ratings for all matches since 1897
session.bulk_save_objects(elo_ratings)#store elo_ratings in database
session.commit()
session.close()
print(f"{len(elo_ratings)} elo ratings added successfully!")