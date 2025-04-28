from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import UniqueConstraint, ForeignKey, CheckConstraint
from sqlalchemy.orm import DeclarativeBase, relationship
class Base(DeclarativeBase):
    pass

class Team(Base):
    __tablename__ = 'teams'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    home_venue = Column(String(50), nullable=True)


    #relationships
    matches_as_team1 = relationship("Match", foreign_keys='Match.team1_id', back_populates="team1")
    matches_as_team2 = relationship("Match", foreign_keys='Match.team2_id', back_populates="team2")
    elo_ratings = relationship("EloRatings", back_populates="team")
    team_stats = relationship("MatchStats", back_populates="team")
    
    def __repr__(self):
        return f"<Team(id={self.id}, name={self.name})>"
    
class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, nullable=False)
    round_num = Column(String(3), nullable=False)
    venue = Column(String(50), nullable=False)
    team1_id = Column(Integer, ForeignKey('teams.id'), nullable=False, index=True)
    team2_id = Column(Integer, ForeignKey('teams.id'), nullable=False, index=True)
    team1_score = Column(Integer, nullable=False)
    team2_score = Column(Integer, nullable=False)
    winner = Column(Integer, ForeignKey('teams.id'), nullable=False)
    home_team_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    
    #relationships
    team1 = relationship("Team", foreign_keys=[team1_id], back_populates="matches_as_team1")
    team2 = relationship("Team", foreign_keys=[team2_id], back_populates="matches_as_team2")
    match_stats = relationship("MatchStats", back_populates="match")
    elo_ratings = relationship("EloRatings", back_populates="match")
    
    #constraints
    __table_args__ = (UniqueConstraint('date', 'round_num', 'team1_id', 'team2_id', name='unique_match_constraint'),)
    
    def __repr__(self):
        return f"<Match(id={self.id}, date={self.date}, round_num={self.round_num}, team1_id={self.team1_id}, team2_id={self.team2_id})>"
class MatchStats(Base):
    __tablename__ = 'match_stats'
    id = Column(Integer, primary_key=True, autoincrement=True)
    match_id = Column(Integer, ForeignKey('matches.id'),nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=False)
    q1_goals = Column(Integer, nullable=False)
    q2_goals = Column(Integer, nullable=False)
    q3_goals = Column(Integer, nullable=False)
    q4_goals = Column(Integer, nullable=False)
    et_goals = Column(Integer, nullable=False, default=0)
    q1_behinds = Column(Integer, nullable=False)
    q2_behinds = Column(Integer, nullable=False)
    q3_behinds = Column(Integer, nullable=False)
    q4_behinds = Column(Integer, nullable=False)
    et_behinds = Column(Integer, nullable=False, default=0)
    total_goals = Column(Integer, nullable=False)
    total_behinds = Column(Integer, nullable=False)
    total_score = Column(Integer, nullable=False)
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
    
    #relationships
    match = relationship("Match", foreign_keys=[match_id], back_populates="match_stats")
    team = relationship("Team", foreign_keys=[team_id], back_populates="team_stats")
    
    #constraints
    __table_args__ = (UniqueConstraint('match_id', 'team_id', name='unique_match_stats_constraint'),
                      CheckConstraint('total_goals >= 0', name='check_total_goals_positive'),
                      CheckConstraint('total_behinds >= 0', name='check_total_behinds_positive'),
                      CheckConstraint('total_score >= 0', name='check_total_score_positive'),
                      CheckConstraint('q1_goals >= 0', name='check_q1_goals_positive'),
                      CheckConstraint('q2_goals >= 0', name='check_q2_goals_positive'),
                      CheckConstraint('q3_goals >= 0', name='check_q3_goals_positive'),
                      CheckConstraint('q4_goals >= 0', name='check_q4_goals_positive'),
                      CheckConstraint('total_goals = q1_goals + q2_goals + q3_goals + q4_goals + et_goals', name='check_total_goals_match_stats'),
                      CheckConstraint('total_behinds = q1_behinds + q2_behinds + q3_behinds + q4_behinds + et_behinds', name='check_total_behinds_match_stats'),)
    
    def __repr__(self):
        return f"<MatchStats(id={self.id}, match_id={self.match_id}, team_id={self.team_id})>"
class EloRatings(Base):
    __tablename__ = 'elo_ratings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=False)
    match_id = Column(Integer, ForeignKey('matches.id'), nullable=False)
    rating_before = Column(Integer, nullable=False)
    rating_after = Column(Integer, nullable=False)

    
    #relationships
    team = relationship("Team", foreign_keys=[team_id], back_populates="elo_ratings")
    match = relationship("Match", foreign_keys=[match_id], back_populates="elo_ratings")
    #constraints
    __table_args__ = (UniqueConstraint('team_id', 'match_id', 'date', name='unique_elo_ratings_constraint'),
                      CheckConstraint('rating_after >= 0', name='check_rating_after_positive'))
    
    def __repr__(self):
        return f"<EloRating(id={self.id}, team_id={self.team_id}, match_id={self.match_id}, rating_before={self.rating_before}, rating_after={self.rating_after})>"