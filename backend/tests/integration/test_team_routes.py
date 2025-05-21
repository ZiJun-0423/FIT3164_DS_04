import pytest
from backend.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
        
def test_get_all_teams(client):
    teams = client.get('/teams/')
    assert teams.status_code == 200
    assert len(teams.json) > 0
    
    for team in teams.json:
        assert 'id' in team
        assert 'name' in team
        assert 'home venue' in team

