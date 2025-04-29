import pandas as pd
import numpy as np

def clean_team_name(name):
     return name.strip().lower()
    
def clean_round(rounds):
    rounds_mapping = {
        'Preliminary Final': 'PF',
        'Qualifying Final': 'QF',
        'Elimination Final': 'EF',
        'Grand Final': 'GF',
        'Semi Final': 'SF'
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

# Read the CSV files
df_git = pd.read_csv("database/data/clean_data_git/git_data_merged.csv")
df_kaggle = pd.read_csv("database/data/clean_data_kaggle/cleaned_kaggle.csv")

#standardize round format
df_git['round_num'] = df_git['round_num'].astype(str).apply(clean_round)
df_kaggle['round'] = df_kaggle['round'].astype(str).apply(clean_round)

#standardize team names
# add rapidfuzz for better matching
# from rapidfuzz import process, fuzz

#generating match_id
# Match ID generation based on year, round, and sorted team names
df_kaggle['match_id'] = df_kaggle.apply(lambda row: (row['year'], row['round'], tuple(sorted([clean_team_name(row['team1']), clean_team_name(row['team2'])]))), axis=1)
df_git['match_id'] = df_git.apply(lambda row: (row['year'], row['round_num'], tuple(sorted([clean_team_name(row['team_1_team_name']), clean_team_name(row['team_2_team_name'])]))), axis=1)

df_merged = pd.merge(df_git, df_kaggle, how= 'left', on='match_id')

# drop unnecessary columns
df_merged = df_merged.drop(columns=['match_id', 'Unnamed: 0', 'team1', 'round', 'team2', 'goals_team1','goals_team2','behinds_team1',
'behinds_team2','score_team1','score_team2', 'year_y'])

# Rename columns to match the desired format
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
    'team_1_final_goals': 'team1_q4_goals',
    'team_1_final_behinds': 'team1_q4_behinds',
    'team_1_et_goals': 'team1_et_goals',
    'team_1_et_behinds': 'team1_et_behinds',
    'team_2_q1_goals': 'team2_q1_goals',
    'team_2_q1_behinds': 'team2_q1_behinds',
    'team_2_q2_goals': 'team2_q2_goals',
    'team_2_q2_behinds': 'team2_q2_behinds',
    'team_2_q3_goals': 'team2_q3_goals',
    'team_2_q3_behinds': 'team2_q3_behinds',
    'team_2_final_goals': 'team2_q4_goals',
    'team_2_final_behinds': 'team2_q4_behinds',
    'team_2_et_goals': 'team2_et_goals',
    'team_2_et_behinds': 'team2_et_behinds'
})

#standardise date format
def standardise_date(date_str):
    try:
        if "/" in date_str:
            return pd.to_datetime(date_str, format='%d/%m/%Y %H:%M', errors='coerce').strftime('%d/%m/%Y %H:%M')
        elif "-" in date_str:
            return pd.to_datetime(date_str, format='%Y-%m-%d %H:%M', errors='coerce',).strftime('%d/%m/%Y %H:%M')
    except Exception as e:
        print(f"Failed to parse {date_str}: {e}")
        return pd.NaT

df_merged['date'] = df_merged['date'].astype(str).apply(standardise_date)

#generating team scores 
def calculate_team_score(row, team_prefix):
    # Check if ET goals and ET behinds are not missing
    if row[f'{team_prefix}_et_goals'] > 0 and row[f'{team_prefix}_et_behinds'] > 0:
        total_goals = row[f'{team_prefix}_et_goals']
        total_behinds = row[f'{team_prefix}_et_behinds']
    else:
        total_goals = row[f'{team_prefix}_q4_goals']
        total_behinds = row[f'{team_prefix}_q4_behinds']
    
    return 6 * total_goals + total_behinds

df_merged[['team1_et_goals', 'team1_et_behinds', 'team2_et_goals', 'team2_et_behinds']] = df_merged[['team1_et_goals', 'team1_et_behinds', 'team2_et_goals', 'team2_et_behinds']].fillna(0).astype(int)
df_merged['team1_score'] = df_merged.apply(lambda row: calculate_team_score(row, 'team1'), axis=1)
df_merged['team2_score'] = df_merged.apply(lambda row: calculate_team_score(row, 'team2'), axis=1)

#generating winner column
# df_merged['winner'] = np.where(df_merged['team1_score'] > df_merged['team2_score'], df_merged['team1'], df_merged['team2'])
df_merged.to_csv("database/data/merged_data.csv")
print("data cleaned and merged!")