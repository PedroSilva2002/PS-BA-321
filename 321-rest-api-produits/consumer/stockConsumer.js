const amqp = require('amqplib');
const Produit = require("../db/models/produits");


async function consumeStockUpdates() {
  try {
    const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
    const channel = await connection.createChannel();

    await channel.assertQueue('stock_update', { durable: true });

    console.log("En attente des messages sur 'stock_update'...");

    channel.consume('stock_update', async (msg) => {

      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        const { produit_id, quantite } = data;
        try {

          const produit = await Produit.findByPk(produit_id);
          if (produit) {
            if (produit.quantite_en_stock >= quantite) {

              produit.quantite_en_stock -= quantite;
              await produit.save();
              console.log(`Stock a ete miis à jour : produit ${produit_id} → -${quantite}`);

            } else {
              console.warn(`Stock insuffisant pour le produit ${produit_id} : demandé ${quantite}, on a que  ${produit.quantite_en_stock} chef`);
            }

          } else {
            console.warn(`Produit ID ${produit_id} introuvable`);
          }
        } catch (err) {
          console.error("Erreur lors de la mise à jour du stock :", err);
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Erreur de connexion RabbitMQ :", err);
  }
}
async function waitForRabbitMQ(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
      console.log("Connexion RabbitMQ établie !");
      return connection;
    } catch (err) {
      console.log(`RabbitMQ non disponible, tentative ${i + 1}/${retries}...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Échec de connexion à RabbitMQ après plusieurs tentatives");
}


async function main() {
  await waitForRabbitMQ();
}

main();



module.exports = { consumeStockUpdates,waitForRabbitMQ  };
