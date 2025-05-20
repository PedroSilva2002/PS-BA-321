require("dotenv").config({path: `${process.cwd()}/.env`})

const express = require("express");
const port = process.env.APP_PORT 
const setupSwagger = require("./swagger");
const produitsRouter = require("./routes/productRoute")
const app = express();
app.use(express.json())
setupSwagger(app);


app.listen(port, () => {
    console.log("server is up and running", port)
})


app.use("/api", produitsRouter)

app.get("/health", (request,response) => {
    response.status(200).json({
        status:"success",
        message:"The api is running"
    })
})

