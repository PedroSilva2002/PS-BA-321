const amqp = require('amqplib');
const Produit = require('../db/models/produits');

let channel;

async function waitForRabbitMQ(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
      console.log('Connexion RabbitMQ établie !');
      channel = await connection.createChannel();
      // Déclare l'exchange métier au démarrage
      await channel.assertExchange('commandes', 'topic', { durable: true });
      return;
    } catch (err) {
      console.log(`RabbitMQ non disponible, tentative ${i + 1}/${retries}...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('Échec de connexion à RabbitMQ après plusieurs tentatives');
}

async function consumeStockUpdates() {
  if (!channel) {
    console.error('Channel RabbitMQ non initialisé.');
    return;
  }

  const queueName = 'stock_update';

  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, 'commandes', 'commande.nouvelle');
  channel.prefetch(1);

  console.log("En attente d'événements 'commande.nouvelle' sur la queue 'stock_update'...");

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      try {
        const evt = JSON.parse(msg.content.toString());

        for (const item of evt.produits) {
          const produit = await Produit.findByPk(item.produit_id);
          if (!produit) {
            console.warn(`Produit ${item.produit_id} introuvable`);
            continue;
          }
          if (produit.quantite_en_stock < item.quantite) {
            console.warn(`Stock insuffisant pour ${item.produit_id}`);
            continue;
          }
          produit.quantite_en_stock -= item.quantite;
          await produit.save();
          console.log(`Stock mis à jour pour produit ${item.produit_id} : -${item.quantite}`);
        }
        channel.ack(msg);
      } catch (err) {
        console.error('Erreur dans consumerStockUpdates :', err);
        channel.nack(msg, false, false);
      }
    }
  });
}

(async () => {
  await waitForRabbitMQ();
  await consumeStockUpdates();
})();

module.exports = { waitForRabbitMQ, consumeStockUpdates };
