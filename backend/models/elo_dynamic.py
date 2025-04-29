def calculate_elo_dynamic(matches, settings):
    """
    Dynamically calculated ELOs based on match history and user defined settings.
    Inputs:
    
    """
    from collections import defaultdict

    k = settings.get("k_value", 20)
    default_elo = settings.get("initial_elo", 1000)
    start_season = settings.get("start_season", 0)
    start_round = settings.get("start_round", 0)

    matches = sorted(matches, key=lambda m: (m["season"], m["round"]))
    elos = defaultdict(lambda: default_elo)
    elo_history = []

    for match in matches:
        season = match["season"]
        round_ = match["round"]
        if season < start_season or (season == start_season and round_ < start_round):
            continue

        home = match["home_team_id"]
        away = match["away_team_id"]
        team1_score = match["team1_score"]
        team2_score = match["team2_score"]

        expected_team1 = 1 / (1 + 10 ** ((elos[away] - elos[home]) / 400))
        expected_team2 = 1 - expected_team1

        actual_team1 = 1 if team1_score > team2_score else 0 if team1_score < team2_score else 0.5
        actual_team2 = 1 - actual_team1

        elos[home] += k * (actual_team1 - expected_team1)
        elos[away] += k * (actual_team2 - expected_team2)

        elo_history.append({
            "season": season,
            "round": round_,
            "team_id": home,
            "elo_rating": elos[home]
        })
        elo_history.append({
            "season": season,
            "round": round_,
            "team_id": away,
            "elo_rating": elos[away]
        })

    return elo_history
