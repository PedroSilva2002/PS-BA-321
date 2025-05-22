from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime

class ProduitCommande(BaseModel):
    produit_id: int
    quantite: int

class CommandeCreate(BaseModel):
    email: EmailStr
    produits: List[ProduitCommande]

class CommandeProduitOut(ProduitCommande):
    id: int
    class Config:
        orm_mode = True  # ou from_attributes pour Pydantic V2

class CommandeOut(BaseModel):
    id: int
    email: EmailStr
    total: float
    statut: str
    date_commande: datetime
    produits: List[CommandeProduitOut]
    class Config:
        orm_mode = True
