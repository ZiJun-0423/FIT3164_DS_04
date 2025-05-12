import joblib
import pandas as pd

model = joblib.load('backend/models/best_model.pkl')
scaler = joblib.load('backend/models/scaler.pkl')

features_df = break

def predict_match(team1, team2):
    team1_row = 