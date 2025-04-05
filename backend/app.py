from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
# from api.game_routes import game_routes
# from api.team_routes import user_routes

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
# load_dotenv()
# app.config['DB_ENDPOINT'] = os.getenv('DB_ENDPOINT')
# app.config['DB_USER'] = os.getenv('DB_USER')
# app.config['DB_PASSWORD'] = os.getenv('DB_PASSWORD')
# app.config['DB_NAME'] = os.getenv('DB_NAME')


@app.route("/")
def home():
    """verify that the Flask API is running
    This is the home route that returns a simple message indicating that the Flask API is running.

    Returns:
        _type_: _description_
    """
    return jsonify({"message": "Flask API is running!"})

if __name__ == "__main__":
    app.run(debug=True)