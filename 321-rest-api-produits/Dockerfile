FROM node:18

RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ajout du script d'attente
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Nouveau point d’entrée : attente produits-db puis rabbitmq
CMD sh -c "/wait-for-it.sh produits-db 5432 -- /wait-for-it.sh rabbitmq 5672 -- sh -c 'npx sequelize-cli db:migrate && node app.js'"
