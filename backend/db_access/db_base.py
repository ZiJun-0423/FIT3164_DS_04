import os, dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def get_db_session():
    """get db connection
    Returns:
        sessionmaker object: sessionmaker object to interact with the database
    """
    try:
        dotenv.load_dotenv()
        DB_URL = 'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}'.format(
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_ENDPOINT'),
            port=os.getenv('DB_PORT'),
            database=os.getenv('DB_NAME')
        )
        engine = create_engine(DB_URL, echo=False, future=True)
        return sessionmaker(bind=engine)()
    
    except Exception as e:
        print(f"Error: {e}")
        return None
    
if __name__ == "__main__":
    session = get_db_session()
    if session:
        print("Database connection successful")
    else:
        print("Database connection failed")
    