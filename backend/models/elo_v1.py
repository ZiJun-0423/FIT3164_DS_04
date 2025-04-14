def calc_elo(team_rating: float, opponent_rating: float, result: float, k: float = 32) -> float:
    """
    Calculate the new Elo rating for a team after a match.

    :param team_rating: The current Elo rating of the team.
    :param opponent_rating: The current Elo rating of the opponent.
    :param result: The result of the team (1 for win, 0.5 for draw, 0 for loss).
    :param k: The K-factor, which determines the sensitivity of the rating change.
               Default is 32, which is commonly used in Elo rating systems.
    :return: The new Elo rating for the team.
    """
    k = 32
    expected_score = 1 / (1 + 10 ** ((opponent_rating - team_rating) / 400))
    new_rating = team_rating + k * (result - expected_score)
    return new_rating