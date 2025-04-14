from flask import Blueprint, request, jsonify
from backend.models.model_trainer import ModelTrainer
# from backend.models.model_predictor import ModelPredictor
# from backend.models.model_evaluator import ModelEvaluator

predictor_bp = Blueprint("predictor", __name__, url_prefix="/predictor")
