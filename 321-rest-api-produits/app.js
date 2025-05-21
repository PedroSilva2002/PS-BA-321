require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const port = process.env.APP_PORT;
const setupSwagger = require("./swagger");
const produitsRouter = require("./routes/productRoute");
const { consumeStockUpdates, waitForRabbitMQ } = require("./consumer/stockConsumer");

const app = express();
app.use(express.json());
setupSwagger(app);
app.use("/api", produitsRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "The api is running",
  });
});

(async () => {
  try {
    await waitForRabbitMQ();
    await consumeStockUpdates();
    app.listen(port, () => {
      console.log("server is up and running", port);
    });
  } catch (err) {
    console.error("Impossible de démarrer l’API : RabbitMQ n'est accessible");
    process.exit(1);
  }
})();
