import pandas as pd
import numpy as np

def clean_team_name(name):
     return name.strip().lower()
    
def clean_round(rounds):
    rounds_mapping = {
        'Preliminary Final': 'PF',
        'Qualifying Final': 'QF',
        'Elimination Final': 'EF',
        'Grand Final': 'GF'
    }
    
    if isinstance(rounds, str):
        rounds = rounds.strip()  # Remove extra spaces

        # Handle cases like "R1" and convert to "R01"
        if rounds.startswith('R') and rounds[1:].isdigit():
            return f'R{int(rounds[1:]):02}'

        # Handle cases where it's just a number (e.g., "1", "2")
        if rounds.isdigit():
            return f'R{int(rounds):02}'

        # Check the mapping for special rounds
        return rounds_mapping.get(rounds, rounds)
    
    return rounds  # If it's already numeric or NaN, return as is

    

df_git = pd.read_csv("backend/data/clean_data_git/git_data_merged.csv")
df_kaggle = pd.read_csv("backend/data/clean_data_kaggle/cleaned_kaggle.csv")

df_git['round_num'] = df_git['round_num'].apply(clean_round)
df_kaggle['round'] = df_kaggle['round'].apply(clean_round)

df_git['team_1_team_name'] = df_git['team_1_team_name'].astype(str).apply(clean_team_name)
df_git['team_2_team_name'] = df_git['team_2_team_name'].astype(str).apply(clean_team_name)
df_kaggle['team1'] = df_kaggle['team1'].apply(clean_team_name)
df_kaggle['team2'] = df_kaggle['team2'].apply(clean_team_name)


df_kaggle['match_id'] = df_kaggle.apply(lambda row: (row['year'], row['round'], tuple(sorted([row['team1'], row['team2']]))), axis=1)
df_git['match_id'] = df_git.apply(lambda row: (row['year'], row['round_num'], tuple(sorted([row['team_1_team_name'], row['team_2_team_name']]))), axis=1)

df_merged = pd.merge(df_git, df_kaggle, how= 'left')

# df_merged = df_merged.drop(columns=['match_id', 'Unnamed: 0', 'team1', 'round', 'team2', 'goals_team1','goals_team2','behinds_team1',
# 'behinds_team2','score_team1','score_team2'])


df_merged = df_merged.rename(columns={
    'round_num': 'round',
    'team_1_team_name': 'team1',
    'team_2_team_name': 'team2',
    'team_1_q1_goals': 'team1_q1_goals',
    'team_1_q1_behinds': 'team1_q1_behinds',
    'team_1_q2_goals': 'team1_q2_goals',
    'team_1_q2_behinds': 'team1_q2_behinds',
    'team_1_q3_goals': 'team1_q3_goals',
    'team_1_q3_behinds': 'team1_q3_behinds',
    'team_1_final_goals': 'team1_final_goals',
    'team_1_final_behinds': 'team1_final_behinds',
    'team_2_q1_goals': 'team2_q1_goals',
    'team_2_q1_behinds': 'team2_q1_behinds',
    'team_2_q2_goals': 'team2_q2_goals',
    'team_2_q2_behinds': 'team2_q2_behinds',
    'team_2_q3_goals': 'team2_q3_goals',
    'team_2_q3_behinds': 'team2_q3_behinds',
    'team_2_final_goals': 'team2_final_goals',
    'team_2_final_behinds': 'team2_final_behinds'
})
df_merged['team1_score'] = 6 * df_merged['team1_final_goals'] + df_merged['team1_final_behinds']
df_merged['team2_score'] = 6 * df_merged['team2_final_goals'] + df_merged['team2_final_behinds']
df_merged[df_merged['team1_score'].isna()].to_csv("aa.csv")
df_merged.to_csv("backend/data/merged_data.csv")
print("data cleaned and merged!")