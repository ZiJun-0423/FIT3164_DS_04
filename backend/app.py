from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from backend.db_access.db_base import get_db_session
from backend.api.team_routes import teams_bp
from backend.api.match_routes import matches_bp
from backend.api.stats_routes import stats_bp
from backend.api.elo_routes import elo_bp
from backend.api.user_routes import user_bp
# from backend.api.predictor_routes import predictor_bp


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

# register blueprints for different routes
app.register_blueprint(teams_bp, url_prefix="/teams")
app.register_blueprint(matches_bp, url_prefix="/matches")
app.register_blueprint(stats_bp, url_prefix="/stats")
app.register_blueprint(elo_bp, url_prefix="/elo")
# app.register_blueprint(predictor_bp, url_prefix="/predictor")
app.register_blueprint(user_bp, url_prefix="/user")

@app.route("/")
def home():
    """Verify that the Flask API is running and check essential components."""
    health = {
        "message": "Flask API is running! Welcome to the Football Stats API!",
        "database": "unreachable",  # default
        "status": "ok"
    }

    # Check DB connection
    try:
        session = get_db_session()
        session.execute(text("SELECT 1"))  # simple check
        health["database"] = "ok"
    except OperationalError:
        health["database"] = "error"
        health["status"] = "degraded"

    return jsonify(health), 200 if health["status"] == "ok" else 503

@app.route("/health")
def healthcheck():
    session = get_db_session()
    checks = {}

    try:
        session.execute(text("SELECT 1 FROM teams LIMIT 1"))
        checks["teams"] = "ok"
    except Exception as e:
        checks["teams"] = f"error: {str(e)}"

    try:
        session.execute(text("SELECT 1 FROM matches LIMIT 1"))
        checks["matches"] = "ok"
    except Exception as e:
        checks["matches"] = f"error: {str(e)}"

    try:
        session.execute(text("SELECT 1 FROM match_stats LIMIT 1"))
        checks["matchstats"] = "ok"
    except Exception as e:
        checks["matchstats"] = f"error: {str(e)}"

    try:
        session.execute(text("SELECT 1 FROM users LIMIT 1"))
        checks["users"] = "ok"
    except Exception as e:
        checks["users"] = f"error: {str(e)}"

    try:
        session.execute(text("SELECT 1 FROM elo_ratings LIMIT 1"))
        checks["elo"] = "ok"
    except Exception as e:
        checks["elo"] = f"error: {str(e)}"

    overall_status = "ok" if all(value == "ok" for value in checks.values()) else "issues"

    return jsonify({"status": overall_status, "details": checks}), 200

if __name__ == "__main__":
    app.run(debug=True)