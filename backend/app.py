from flask import Flask, jsonify
from flask_cors import CORS
from backend.api.team_routes import teams_bp
from backend.api.match_routes import matches_bp
from backend.api.stats_routes import stats_bp
from backend.api.elo_routes import elo_bp
from backend.api.user_routes import user_bp
# from backend.api.predictor_routes import predictor_bp


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# register blueprints for different routes
app.register_blueprint(teams_bp, url_prefix="/teams")
app.register_blueprint(matches_bp, url_prefix="/matches")
app.register_blueprint(stats_bp, url_prefix="/stats")
app.register_blueprint(elo_bp, url_prefix="/elo")
# app.register_blueprint(predictor_bp, url_prefix="/predictor")
app.register_blueprint(user_bp, url_prefix="/api/user")

@app.route("/")
def home():
    """verify that the Flask API is running
    This is the home route that returns a simple message indicating that the Flask API is running.

    Returns:
        _type_: _description_
    """
    return jsonify({"message": "Flask API is running! Welcome to the Football Stats API!"}), 200

if __name__ == "__main__":
    app.run(debug=True)