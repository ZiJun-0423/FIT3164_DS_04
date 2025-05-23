import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.db_access.schema import Base, Team, EloRatings, Match, MatchStats
from backend.db_access.db_base import get_db_session

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()
        
def test_insert_team(test_db):
    team = Team(name="Team 1", home_venue = "Home 1")
    test_db.add(team)
    test_db.commit()
    
    result = test_db.query(Team).filter(Team.name == "Team 1").first()
    assert team.id is not None
    assert result.name == "Team 1"
    assert result.home_venue == "Home 1"
    
    
    