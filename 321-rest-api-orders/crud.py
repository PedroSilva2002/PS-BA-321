from sqlalchemy.orm import Session
import models, schemas
import requests
from fastapi import HTTPException
import pika
import json

def publish_stock_update(produit_id: int, quantite: int):
    try:
        credentials = pika.PlainCredentials('user', 'password')
        parameters = pika.ConnectionParameters(host="rabbitmq", credentials=credentials)
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue="stock_update", durable=True)

        message = {"produit_id": produit_id, "quantite": quantite}
        channel.basic_publish(
            exchange="",
            routing_key="stock_update",
            body=json.dumps(message)
        )
        connection.close()
        print(f"Message envoyé à RabbitMQ : {message}")
    except Exception as e:
        print(f"Erreur lors de la publication du message RabbitMQ : {e}")


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

        publish_stock_update(item.produit_id, item.quantite)

    db_commande.total = total
    db.commit()
    db.refresh(db_commande)
    return db_commande

def get_all_commandes(db: Session):
    return db.query(models.Commande).all()
