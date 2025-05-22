const amqp = require('amqplib');
const os = require('os');

const workerId = `${os.hostname()}-${Math.floor(Math.random() * 1000)}`;

async function startWorker() {
  try {
    const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
    const channel = await connection.createChannel();

    await channel.assertExchange('commandes', 'topic', { durable: true });

    const queue = 'mail_notifier';
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, 'commandes', 'commande.nouvelle');

    console.log("[mail-worker] Waiting for 'commande.nouvelle' messages...");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log(`✅✅✅✅✅ [${workerId}] Simulating email sent to: ${event.email}`);
        console.log(`✅✅✅✅✅ [${workerId}] Commande #${event.id_commande} de ${event.total} CHF`);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Mail worker error:", err);
    process.exit(1);
  }
}

startWorker();
