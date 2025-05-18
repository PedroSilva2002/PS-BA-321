const { addProduit, deleteProduit, getAllProduits, updateProduit } = require('../controller/produitsController');
const router = require("express").Router();


router.route('/produits').post(addProduit);
router.delete('/produits/:id', deleteProduit);
router.get('/produits', getAllProduits);
router.put('/produits/:id', updateProduit);

module.exports = router;
