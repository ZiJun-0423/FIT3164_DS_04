import joblib
import pandas as pd
import sklearn

model = joblib.load('backend/models/best_model.pkl')
scaler = joblib.load('backend/models/scaler.pkl')

features_df = pd.read_csv("backend/models/features_df.csv")

def predict_match(team1, team2,features_df, model):
    # Filter rows
    team1_row = features_df[features_df['team1_name'] == team1].sort_values('match_id', ascending=False).head(1)
    team2_row = features_df[features_df['team2_name'] == team2].sort_values('match_id', ascending=False).head(1)

    if team1_row.empty or team2_row.empty:
        return {"error": "Team does not exist"}

    # Combine features
    combined = team1_row.copy()
    for col in team2_row.columns:
        if col.startswith('f_'):
            combined[f'opponent_{col}'] = team2_row[col].values[0]

    # Extract model-ready features
    # Ensure only model features are included
    #X_input = combined.loc[:, model.feature_names_in_]
    input_features = combined[model.feature_names_in_]

    # Predict
    prob = model.predict_proba(input_features)[0][1]
    winner = team1 if prob >= 0.5 else team2
    confidence = prob if prob >= 0.5 else 1 - prob

    return {
        "team1": team1,
        "team2": team2,
        "predicted_winner": winner,
        "estimated_margin": int((confidence - 0.5) * 100)
    }

# Example usage for local test
if __name__ == "__main__":
    #result = predict_match("Fitzroy", "Carlton", features_df, model )
    #print(result)
    result = predict_match(team1, team2, features_df, model)
    