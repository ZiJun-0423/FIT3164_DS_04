import mysql.connector
from mysql.connector import Error
from flask import current_app as app

def get_db_connection():
    """get connection to MySQL database in AWS

    Returns:
       mysql.connector obj
    """
    try:
        connection = mysql.connector.connect(
            host= app.config["DB_ENDPOINT"],
            user=app.config["DB_USER"],
            password= app.config["DB_PASSWORD"],
            database= app.config["DB_NAME"]
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None
    

def get_games():
    pass

def get_game_by_id(game_id):
    pass

def add_game(game_data):
    pass

def update_game(game_id, game_data):
    pass

def delete_game(game_id):
    pass

def add_stat(stat_data):
    pass

def update_stat(stat_id, stat_data):
    pass

def delete_stat(stat_id):
    pass

def get_stats_by_game(game_id):
    pass

def get_stats_by_team(team_id):
    pass

def get_stats_by_game_and_team(game_id, team_id):
    pass

def get_elo_ratings():
    pass

def get_elo_rating_by_team(team_id):
    pass