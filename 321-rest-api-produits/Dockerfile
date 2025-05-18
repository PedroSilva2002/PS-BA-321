FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run migrations before starting the app
CMD npx sequelize-cli db:migrate && node app.js
