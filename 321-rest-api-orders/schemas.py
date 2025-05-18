from pydantic import BaseModel
from typing import List
from datetime import datetime

class ProduitCommande(BaseModel):
    produit_id: int
    quantite: int

class CommandeCreate(BaseModel):
    produits: List[ProduitCommande]

class CommandeProduitOut(ProduitCommande):
    id: int
    class Config:
        orm_mode = True

class CommandeOut(BaseModel):
    id: int
    total: float
    statut: str
    date_commande: datetime
    produits: List[CommandeProduitOut]
    class Config:
        orm_mode = True
