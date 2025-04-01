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
        