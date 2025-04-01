from backend.database.db_base import get_db_connection
from mysql.connector import Error

def get_teams():
    """get teams from database

    Returns:
       list of teams
    """
    try:
        connection = get_db_connection()
        if connection is None:
            return {"error": "Failed to connect to the database"}, 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM teams")
        teams = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return teams
    except Error as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500
    
def get_team_by_id(team_id):
    pass

def add_team(team_data):
    pass

def update_team(team_id, team_data):
    pass

def delete_team(team_id):
    pass