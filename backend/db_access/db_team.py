from mysql.connector import Error
from .db_base import get_db_connection


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
    """get team by id from database
    this function retrieves a team from the database using the provided team ID.

    Args:
        team_id (int): _description_
    """
    try:
        connection = get_db_connection()
        if connection is None:
            return {"error": "Failed to connect to the database"}, 500  
              
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM teams WHERE id = %s", (team_id,))
        team = cursor.fetchone()
        cursor.close()
        connection.close()
        
        if team is None:
            return {"error": "Team not found"}, 404
        
        return team
    except Error as e:
        print(f"Error: {e}")
        return {"error": str(e)}, 500

def add_team(team_data):
    pass

def update_team(team_id, team_data):
    pass

def delete_team(team_id):
    pass