from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    """get connection to MySQL database in AWS

    Returns:
       mysql.connector obj
    """
    return mysql.connector.connect(
        host=os.getenv("DB_ENDPOINT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

@app.route("/")
def home():
    return jsonify({"message": "Flask API is running!"})

@app.route("/teams", methods= ["get"])
def get_teams():
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM teams")
        teams = cursor.fetchall()
        db.close()
        return jsonify(teams)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)  # Runs on http://127.0.0.1:5000