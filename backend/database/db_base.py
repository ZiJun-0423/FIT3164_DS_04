import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

def get_db_connection():
    """get connection to MySQL database in AWS

    Returns:
       mysql.connector obj
    """
    try:
        
        # Load environment variables from .env file
        load_dotenv()
        connection = mysql.connector.connect(
            host= os.getenv("DB_ENDPOINT"),
            user= os.getenv("DB_USER"),
            password= os.getenv("DB_PASSWORD"),
            database= os.getenv("DB_NAME"),
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None
        