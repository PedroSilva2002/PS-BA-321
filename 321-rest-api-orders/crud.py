from sqlalchemy.orm import Session
import models, schemas
import requests
from fastapi import HTTPException

def create_commande_with_produits(db: Session, commande: schemas.CommandeCreate):
    total = 0
    db_commande = models.Commande()
    db.add(db_commande)
    db.flush()

    for item in commande.produits:
        res = requests.get(f"http://traefik/api/produits/{item.produit_id}")

        if res.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Produit ID {item.produit_id} non trouvé")

        try:
            json_data = res.json()
        except Exception:
            raise HTTPException(status_code=500, detail="Réponse non JSON de l'API Produits")

        if "data" not in json_data or not json_data["data"]:
            raise HTTPException(status_code=404, detail=f"Produit ID {item.produit_id} non trouvé dans la réponse")

        produit = json_data["data"]

        total += float(produit["prix"]) * item.quantite

        cp = models.CommandeProduit(
            commande_id=db_commande.id,
            produit_id=item.produit_id,
            quantite=item.quantite
        )
        db.add(cp)

    db_commande.total = total
    db.commit()
    db.refresh(db_commande)
    return db_commande

def get_all_commandes(db: Session):
    return db.query(models.Commande).all()
