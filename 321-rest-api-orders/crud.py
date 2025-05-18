from sqlalchemy.orm import Session
import models, schemas

def create_commande_with_produits(db: Session, commande: schemas.CommandeCreate):
    total = 0
    db_commande = models.Commande()
    db.add(db_commande)
    db.flush()

    for item in commande.produits:
        cp = models.CommandeProduit(
            commande_id=db_commande.id,
            produit_id=item.produit_id,
            quantite=item.quantite
        )
        db.add(cp)
        total += 10 * item.quantite  # prix fictif

    db_commande.total = total
    db.commit()
    db.refresh(db_commande)
    return db_commande

def get_all_commandes(db: Session):
    return db.query(models.Commande).all()
