# Microservices E-Commerce – Projet 321

Ce projet met en place une plateforme e-commerce en architecture microservices avec les services suivants :

- **Produits API** : service Node.js/Express pour la gestion des produits.
- **Commandes API** : service FastAPI pour la gestion des commandes.
- **RabbitMQ** : gestion des messages asynchrones (mise à jour du stock).
- **Traefik** : reverse proxy API gateway pour pointer vers le bon service.

---

## Vue d'ensemble de l'architecture

