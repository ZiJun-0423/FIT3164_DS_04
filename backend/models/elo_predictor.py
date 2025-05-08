from datetime import datetime

def get_latest_elo_before(elo_dict, team_id, current_date):
    # Extract all past ratings for this team
    past_ratings = [
        (date, rating) for (tid, date), rating in elo_dict.items()
        if tid == team_id and date < current_date
    ]

    if not past_ratings:
        return 1000  # fallback to default ELO if nothing is found

    # Return rating with the most recent date
    latest_date, latest_rating = max(past_ratings, key=lambda x: x[0])
    return latest_rating

def predict_from_elo(ratings, matches):
    elo_dict = { (r.team_id, r.date): r.rating_after for r in ratings }

    preds = []
    for match in matches:
        team1 = match.team1_id
        team2 = match.team2_id
        date = match.date

        # Lookup most recent rating before this match
        team1_elo = get_latest_elo_before(elo_dict, team1, date)
        team2_elo = get_latest_elo_before(elo_dict, team2, date)

        # Predict winner
        expected_team1 = 1 / (1 + 10 ** ((team2_elo - team1_elo) / 400))
        preds.append((match.id, expected_team1))
    
    return preds

def compute_accuracy(predictions, val_dict):
    correct = 0
    for match_id, expected_team1 in predictions:
        predicted_winner = 1 if expected_team1 > 0.5 else 0
        match = val_dict.get(match_id)
        if not match:
            continue  # or raise an error if you expect all matches to be found

        actual_winner = 1 if match.team1_score > match.team2_score else 0
        if predicted_winner == actual_winner:
            correct += 1
    total = len(predictions)
    return (correct / total) * 100 if total > 0 else 0.0

import numpy as np

def compute_log_loss(predictions, val_dict, eps=1e-15):
    losses = []
    for match_id, prob_team1 in predictions:
        match = val_dict.get(match_id)
        if not match:
            continue
        actual = 1 if match.team1_score > match.team2_score else 0
        prob_team1 = np.clip(prob_team1, eps, 1 - eps)
        loss = - (actual * np.log(prob_team1) + (1 - actual) * np.log(1 - prob_team1))
        losses.append(loss)
    return np.mean(losses) if losses else None
