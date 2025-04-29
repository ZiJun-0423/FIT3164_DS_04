from flask import Blueprint, jsonify, request

user_bp = Blueprint("user", __name__, url_prefix="/user")