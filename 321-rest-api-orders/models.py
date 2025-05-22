from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Commande(Base):
    __tablename__ = "commandes"
    id             = Column(Integer, primary_key=True, index=True)
    email          = Column(String(255), nullable=False)   
    total          = Column(Numeric(10, 2), default=0.00)
    statut         = Column(String(50), default="en attente")
    date_commande  = Column(DateTime, default=datetime.utcnow)
    produits       = relationship("CommandeProduit", back_populates="commande")

class CommandeProduit(Base):
    __tablename__ = "commandes_produits"
    id          = Column(Integer, primary_key=True, index=True)
    commande_id = Column(Integer, ForeignKey("commandes.id"))
    produit_id  = Column(Integer)
    quantite    = Column(Integer)
    commande    = relationship("Commande", back_populates="produits")
