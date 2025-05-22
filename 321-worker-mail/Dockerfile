FROM node:18

RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY . .
RUN npm install

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["sh", "-c", "/wait-for-it.sh rabbitmq 5672 -- node index.js"]
