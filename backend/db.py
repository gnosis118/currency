from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.settings import get_settings

settings = get_settings()

engine = create_engine(settings.DATABASE_URL, future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


