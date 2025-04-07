import os
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, UniqueConstraint, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from sqlalchemy import inspect

Base = declarative_base()

class Team(Base):
    __tablename__ = 'teams'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    established_year = Column(Integer, nullable=True)
    
class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True, autoincrement=True)
    year = Column(Integer, nullable=False)
    round = Column(String(3), nullable=False)
    date = Column(String(50), nullable=False)
    team1_id = Column(Integer, nullable=False)
    team2_id = Column(Integer, nullable=False)
    score_team1 = Column(Integer, nullable=True)
    score_team2 = Column(Integer, nullable=True)
    winner = Column(String(50), nullable=True)
    
    __table_args__ = (UniqueConstraint('date', 'round', 'team1_id', 'team2_id', name='unique_match_constraint'),)
    
class MatchStats(Base):
    __tablename__ = 'match_stats'
    id = Column(Integer, primary_key=True, autoincrement=True)
    match_id = Column(Integer, nullable=False)
    team_id = Column(Integer, nullable=False)
    q1_goals = Column(Integer, nullable=True)
    q2_goals = Column(Integer, nullable=True)
    Q3_goals = Column(Integer, nullable=True)
    q4_goals = Column(Integer, nullable=True)
    et_goals = Column(Integer, nullable=True)
    q1_behinds = Column(Integer, nullable=True)
    q2_behinds = Column(Integer, nullable=True)
    q3_behinds = Column(Integer, nullable=True)
    q4_behinds = Column(Integer, nullable=True)
    et_behinds = Column(Integer, nullable=True)
    total_goals = Column(Integer, nullable=True)
    total_behinds = Column(Integer, nullable=True)
    total_score = Column(Integer, nullable=True)
    #quarterly score omitted as unsure carry over to other matches
    
    kicks = Column(Integer, nullable=True)
    marks = Column(Integer, nullable=True)
    handballs = Column(Integer, nullable=True)
    disposals = Column(Integer, nullable=True)
    hitouts = Column(Integer, nullable=True)
    tackles = Column(Integer, nullable=True)
    rebounds_50s = Column(Integer, nullable=True)
    inside_50s = Column(Integer, nullable=True)
    clearances = Column(Integer, nullable=True)
    clangers = Column(Integer, nullable=True)
    freekicks_for = Column(Integer, nullable=True)
    freekicks_against = Column(Integer, nullable=True)
    brownlow_votes = Column(Integer, nullable=True)
    contested_possessions = Column(Integer, nullable=True)
    uncontested_possessions = Column(Integer, nullable=True)
    contested_marks = Column(Integer, nullable=True)
    marks_inside_50s = Column(Integer, nullable=True)
    one_percenters = Column(Integer, nullable=True)
    bounces = Column(Integer, nullable=True)
    goals_assists = Column(Integer, nullable=True)
    
    
class elo_ratings(Base):
    __tablename__ = 'elo_ratings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer, nullable=False)
    rating_before = Column(Integer, nullable=False)
    rating_after = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)