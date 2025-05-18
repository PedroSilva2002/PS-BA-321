const produit = require("../db/models/produits")

const addProduit = async (request, response, next) => {
    try {
        const { nom, description, prix, quantite_en_stock } = request.body;

        const newProduit = await produit.create({
            nom,
            description,
            prix,
            quantite_en_stock
        });

        return response.status(201).json({
            status: "success",
            message: "Produit créé avec succès",
            data: newProduit 
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({
            status: "error",
            message: "Une erreur est survenue lors de la création du produit",
            error: error.message
        });
    }
};

const deleteProduit = async (request, response) => {
    try {
        const { id } = request.params;
        const deletedProduit = await produit.destroy({ where: { id } });

        if (!deletedProduit) {
            return response.status(404).json({
                status: "fail",
                message: "Produit non trouvé"
            });
        }

        return response.status(200).json({
            status: "success",
            message: "Produit supprimé avec succès"
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            status: "error",
            message: "Erreur lors de la suppression du produit",
            error: error.message
        });
    }
};

const getAllProduits = async (request, response) => {
    try {
        const produits = await produit.findAll();

        return response.status(200).json({
            status: "success",
            message: "Liste des produits fetched avec succès",
            data: produits
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            status: "error",
            message: "Erreur lors fetch des produits",
            error: error.message
        });
    }
};

const updateProduit = async (request, response) => {
    const { id } = request.params;
    const { nom, description, prix, quantite_en_stock } = request.body;

    try {
        const existingProduit = await produit.findByPk(id);
        if (!existingProduit) {
            return response.status(404).json({
                status: "fail",
                message: "Produit non trouvé"
            });
        }

        await existingProduit.update({
            nom: nom || existingProduit.nom,
            description: description || existingProduit.description,
            prix: prix || existingProduit.prix,
            quantite_en_stock: quantite_en_stock || existingProduit.quantite_en_stock
        });

        return response.status(200).json({
            status: "success",
            message: "Produit updated succès",
            data: existingProduit
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            status: "error",
            message: "Erreur lors l'update du produit",
            error: error.message
        });
    }
};



module.exports = {addProduit,deleteProduit,getAllProduits, updateProduit}