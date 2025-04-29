from flask import Flask, jsonify
from flask_cors import CORS
from backend.api.match_routes import matches_bp
from backend.api.team_routes import teams_bp
from backend.api.elo_routes import elo_bp

app = Flask(__name__)
CORS(app)

# register blueprints for different routes
app.register_blueprint(matches_bp, url_prefix="/matches")
# app.register_blueprint(user_routes, url_prefix="/api/user")
app.register_blueprint(teams_bp, url_prefix="/teams")
app.register_blueprint(elo_bp, url_prefix="/elo")

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