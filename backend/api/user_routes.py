import jwt
import os, dotenv
import datetime
from flask import Blueprint, request, jsonify
from backend.db_access.db_base import get_db_session
from backend.db_access.schema import User

user_bp = Blueprint("user", __name__, url_prefix="/user")

@user_bp.route("/signup", methods=["POST"])
def signup():
    session = get_db_session()
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if session.query(User).filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 409

    new_user = User(username=username)
    new_user.set_password(password)

    session.add(new_user)
    session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@user_bp.route("/login", methods=["POST"])
def login():
    session = get_db_session()
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    dotenv.load_dotenv()
    SECRET_KEY = os.getenv("secret_key")
    
    user = session.query(User).filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": user.id,
        "exp": datetime.datetime.now() + datetime.timedelta(hours=1)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token}), 200

def token_required(f):
    def wrapper(*args, **kwargs):
        dotenv.load_dotenv()
        SECRET_KEY = os.getenv("secret_key")
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token missing"}), 401
        try:
            decoded = jwt.decode(token.replace("Bearer ", ""), SECRET_KEY, algorithms=["HS256"])
            request.user = decoded["user"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 403
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

