from fastapi import FastAPI, Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud
from typing import List
import logging
import socket

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
def startup_event():
    logging.basicConfig(level=logging.INFO)
    logging.info("The API is up and running on port 8000")
    logging.info("Swagger available at http://localhost:8000/docs")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/commandes/", response_model=schemas.CommandeOut)
def create_commande(commande: schemas.CommandeCreate, db: Session = Depends(get_db)):
    return crud.create_commande_with_produits(db, commande)

@router.get("/commandes/")
def get_all_commandes(db: Session = Depends(get_db)):
    return {
        "host": socket.gethostname(),
        "commandes": crud.get_all_commandes(db)
    }

app.include_router(router, prefix="/api")

