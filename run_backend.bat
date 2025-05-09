@echo off
echo Creating virtual environment (if it doesn't exist)...
python -m venv venv
call venv\Scripts\activate

echo Installing requirements...
pip install -r requirements.txt

echo Starting backend...
python -m backend.app