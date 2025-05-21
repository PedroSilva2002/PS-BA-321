from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud
import logging
import socket

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Commandes API",
    version="1.0.0",
    root_path="/api/commandes" 
)

@app.on_event("startup")
def startup_event():
    logging.basicConfig(level=logging.INFO)
    logging.info("The API is up and running on port 8000")
    logging.info("Swagger available at http://localhost/api/commandes/docs")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/", response_model=schemas.CommandeOut)
def create_commande(commande: schemas.CommandeCreate, db: Session = Depends(get_db)):
    return crud.create_commande_with_produits(db, commande)

@app.get("/")
def get_all_commandes(db: Session = Depends(get_db)):
    return {
        "host": socket.gethostname(),
        "commandes": crud.get_all_commandes(db)
    }
