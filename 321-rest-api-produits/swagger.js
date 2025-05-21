const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Produit",
            version: "1.0.0",
            description: "API gestion des produits",
        },
        servers: [
            {
                url: "http://localhost/api/produits",
                description: "Development server",
            },
        ],
    },
    apis: ["./swagger/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    console.log("Swagger est dispo sur le url: http://localhost/api/produits/api-swagger");

};

module.exports = setupSwagger;
