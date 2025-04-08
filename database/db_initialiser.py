import os
from datetime import datetime
import logging
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from schema import Base, Team, Match, MatchStats
import dotenv

logging.getLogger('sqlalchemy.engine').setLevel(logging.ERROR)

dotenv.load_dotenv()
DB_URL = 'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}'.format(
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_ENDPOINT'),
    port=os.getenv('DB_PORT'),
    database=os.getenv('DB_NAME')
)

#engine creation
engine = create_engine(DB_URL, echo=True, future=True)

#create schema with engine
Base.metadata.create_all(engine)

#load data from csv
merged_df = pd.read_csv("database/data/merged_data.csv")

#finding unique team names
unique_teams = pd.unique(merged_df[['team1', 'team2']].values.ravel())

Session = sessionmaker(bind=engine)

#input team names into database
with Session() as session:
    for team in unique_teams:
        existing_team = session.query(Team).filter_by(name=team).first()
        if not existing_team:
                new_team = Team(name=team)
                session.add(new_team)
    session.commit()
    print("Teams added successfully!")

#input match data into database
with Session() as session:
    team_name_to_id = {team.name: team.id for team in session.query(Team).all()}
    matches_to_add = []
    for _, row in merged_df.iterrows():
        match = Match(
            date=datetime.strptime(row['date'], '%d/%m/%Y %H:%M'),
            year=row['year'],
            round=row['round'],
            team1_id=team_name_to_id[row['team1']],
            team2_id=team_name_to_id[row['team2']],
            score_team1=row['team1_score'],
            score_team2=row['team2_score'],
            winner=team_name_to_id[row['winner']]
        )
        matches_to_add.append(match)
    session.bulk_save_objects(matches_to_add)
    session.commit()
    print(f"{len(matches_to_add)} matches added successfully!")
    
# Add match stats
merged_df = merged_df.where(pd.notna(merged_df), None)
with Session() as session:
    match_stats_to_add = []
    for _, row in merged_df.iterrows():
        match_stats = MatchStats(
            match_id=session.query(Match).filter_by(date=datetime.strptime(row['date'], '%d/%m/%Y %H:%M')).first().id,
            team_id=team_name_to_id[row['team1']],
            q1_goals=row['team1_q1_goals'],
            q2_goals=row['team1_q2_goals'],
            q3_goals=row['team1_q3_goals'],
            q4_goals=row['team1_q4_goals'],
            et_goals=row['team1_et_goals'],
            q1_behinds=row['team1_q1_behinds'],
            q2_behinds=row['team1_q2_behinds'],
            q3_behinds=row['team1_q3_behinds'],
            q4_behinds=row['team1_q4_behinds'],
            et_behinds=row['team1_et_behinds'],
            total_goals=row['team1_q1_goals'] + row['team1_q2_goals'] + row['team1_q3_goals'] + row['team1_q4_goals'] + row['team1_et_goals'],
            total_behinds=row['team1_q1_behinds'] + row['team1_q2_behinds'] + row['team1_q3_behinds'] + row['team1_q4_behinds'] + row['team1_et_behinds'],
            total_score=(row['team1_q1_goals'] + row['team1_q2_goals'] + row['team1_q3_goals'] + row['team1_q4_goals'] + row['team1_et_goals']) * 6 + (row['team1_q1_behinds'] + row['team1_q2_behinds'] + row['team1_q3_behinds'] + row['team1_q4_behinds'] + row['team1_et_behinds']),
            
            kicks=None if pd.isna(row['kicks_team1']) else row['kicks_team1'],
            marks=None if pd.isna(row['marks_team1']) else row['marks_team1'],
            handballs=None if pd.isna(row['handballs_team1']) else row['handballs_team1'],
            disposals=None if pd.isna(row['disposals_team1']) else row['disposals_team1'],
            hitouts=None if pd.isna(row['hit_outs_team1']) else row['hit_outs_team1'],
            tackles=None if pd.isna(row['tackles_team1']) else row['tackles_team1'],
            rebounds_50s=None if pd.isna(row['rebound_50s_team1']) else row['rebound_50s_team1'],
            inside_50s=None if pd.isna(row['inside_50s_team1']) else row['inside_50s_team1'],
            clearances=None if pd.isna(row['clearances_team1']) else row['clearances_team1'],
            clangers=None if pd.isna(row['clangers_team1']) else row['clangers_team1'],
            freekicks_for=None if pd.isna(row['freekicks_for_team1']) else row['freekicks_for_team1'],
            freekicks_against=None if pd.isna(row['freekicks_agains_team1']) else row['freekicks_agains_team1'],
            brownlow_votes=None if pd.isna(row['brownlow_votes_team1']) else row['brownlow_votes_team1'],
            contested_possessions=None if pd.isna(row['contested_possesions_team1']) else row['contested_possesions_team1'],
            uncontested_possessions=None if pd.isna(row['uncontested_possesions_team1']) else row['uncontested_possesions_team1'],
            contested_marks=None if pd.isna(row['contested_marks_team1']) else row['contested_marks_team1'],
            marks_inside_50s=None if pd.isna(row['marks_inside_50_team1']) else row['marks_inside_50_team1'],
            one_percenters=None if pd.isna(row['one_percenters_team1']) else row['one_percenters_team1'],
            bounces=None if pd.isna(row['bounces_team1']) else row['bounces_team1'],
            goals_assists=None if pd.isna(row['goal_assist_team1']) else row['goal_assist_team1']
        )
        match_stats_to_add.append(match_stats)

        # Add stats for team 2
        match_stats = MatchStats(
            match_id=session.query(Match).filter_by(date=datetime.strptime(row['date'], '%d/%m/%Y %H:%M')).first().id,
            team_id=team_name_to_id[row['team2']],
            q1_goals=row['team2_q1_goals'],
            q2_goals=row['team2_q2_goals'],
            q3_goals=row['team2_q3_goals'],
            q4_goals=row['team2_q4_goals'],
            et_goals=row['team2_et_goals'],
            q1_behinds=row['team2_q1_behinds'],
            q2_behinds=row['team2_q2_behinds'],
            q3_behinds=row['team2_q3_behinds'],
            q4_behinds=row['team2_q4_behinds'],
            et_behinds=row['team2_et_behinds'],
            total_goals=row['team2_q1_goals'] + row['team2_q2_goals'] + row['team2_q3_goals'] + row['team2_q4_goals'] + row['team2_et_goals'],
            total_behinds=row['team2_q1_behinds'] + row['team2_q2_behinds'] + row['team2_q3_behinds'] + row['team2_q4_behinds'] + row['team2_et_behinds'],
            total_score=(row['team2_q1_goals'] + row['team2_q2_goals'] + row['team2_q3_goals'] + row['team2_q4_goals'] + row['team2_et_goals']) * 6 + (row['team2_q2_behinds'] + row['team2_q2_behinds'] + row['team2_q3_behinds'] + row['team2_q4_behinds'] + row['team2_et_behinds']),
            
            kicks=None if pd.isna(row['kicks_team2']) else row['kicks_team2'],
            marks=None if pd.isna(row['marks_team2']) else row['marks_team2'],
            handballs=None if pd.isna(row['handballs_team2']) else row['handballs_team2'],
            disposals=None if pd.isna(row['disposals_team2']) else row['disposals_team2'],
            hitouts=None if pd.isna(row['hit_outs_team2']) else row['hit_outs_team2'],
            tackles=None if pd.isna(row['tackles_team2']) else row['tackles_team2'],
            rebounds_50s=None if pd.isna(row['rebound_50s_team2']) else row['rebound_50s_team2'],
            inside_50s=None if pd.isna(row['inside_50s_team2']) else row['inside_50s_team2'],
            clearances=None if pd.isna(row['clearances_team2']) else row['clearances_team2'],
            clangers=None if pd.isna(row['clangers_team2']) else row['clangers_team2'],
            freekicks_for=None if pd.isna(row['freekicks_for_team2']) else row['freekicks_for_team2'],
            freekicks_against=None if pd.isna(row['freekicks_agains_team2']) else row['freekicks_agains_team2'],
            brownlow_votes=None if pd.isna(row['brownlow_votes_team2']) else row['brownlow_votes_team2'],
            contested_possessions=None if pd.isna(row['contested_possesions_team2']) else row['contested_possesions_team2'],
            uncontested_possessions=None if pd.isna(row['uncontested_possesions_team2']) else row['uncontested_possesions_team2'],
            contested_marks=None if pd.isna(row['contested_marks_team2']) else row['contested_marks_team2'],
            marks_inside_50s=None if pd.isna(row['marks_inside_50_team2']) else row['marks_inside_50_team2'],
            one_percenters=None if pd.isna(row['one_percenters_team2']) else row['one_percenters_team2'],
            bounces=None if pd.isna(row['bounces_team2']) else row['bounces_team2'],
            goals_assists=None if pd.isna(row['goal_assist_team2']) else row['goal_assist_team2']
        )
        match_stats_to_add.append(match_stats)
    session.bulk_save_objects(match_stats_to_add)
    session.commit()
    print(f"{len(match_stats_to_add)} match stats added successfully!")