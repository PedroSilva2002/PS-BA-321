from sqlalchemy.orm import Session
import models, schemas

import requests
from fastapi import HTTPException

import pika, json, logging
from pika.exceptions import AMQPError

def publish_commande_creee(event: dict):
    credentials = pika.PlainCredentials('user', 'password')
    params = pika.ConnectionParameters(
        host="rabbitmq",
        credentials=credentials,
        heartbeat=30
    )

    try:
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.exchange_declare(exchange="commandes", exchange_type="topic", durable=True)
        channel.confirm_delivery()

        props = pika.BasicProperties(delivery_mode=2)
        channel.basic_publish(
            exchange="commandes",
            routing_key="commande.nouvelle",
            body=json.dumps(event),
            properties=props
        )
        logging.info("✅✅✅✅✅ message publié avec succès ICI : %s", event) # need to make this visible cuz i cant read
    except AMQPError as e:
        logging.error("Erreur RabbitMQ lors de la publication : %s", e)
    finally:
        try:
            if connection.is_open:
                connection.close()
        except Exception as e:
            logging.warning("Erreur lors de la fermeture de la connexion RabbitMQ : %s", e)

def create_commande_with_produits(db: Session, commande: schemas.CommandeCreate):
    db_commande = models.Commande()
    db.add(db_commande)
    db.flush()

    total = 0
    for item in commande.produits:
        res = requests.get(f"http://traefik/api/produits/{item.produit_id}")
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Produit ID {item.produit_id} non trouvé")
        data = res.json().get("data")
        if not data:
            raise HTTPException(status_code=404, detail=f"Produit ID {item.produit_id} absent de la réponse")

        total += float(data["prix"]) * item.quantite
        db.add(models.CommandeProduit(
            commande_id=db_commande.id,
            produit_id=item.produit_id,
            quantite=item.quantite
        ))

    db_commande.total = total
    db.commit()
    db.refresh(db_commande)

    evenement = {
        "id_commande": db_commande.id,
        "total": float(db_commande.total),
        "produits": [
            {"produit_id": p.produit_id, "quantite": p.quantite}
            for p in db_commande.produits
        ],
        "timestamp": db_commande.date_commande.isoformat()
    }
    publish_commande_creee(evenement)

    return db_commande

def get_all_commandes(db: Session):
    return db.query(models.Commande).all()
