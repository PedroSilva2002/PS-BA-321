const { addProduit, deleteProduit, getAllProduits, updateProduit, getProduitById } = require('../controller/produitsController');
const router = require("express").Router();


router.route('/produits').post(addProduit);
router.delete('/produits/:id', deleteProduit);
router.get('/produits', getAllProduits);
router.put('/produits/:id', updateProduit);
router.get('/produits/:id', getProduitById);

module.exports = router;
