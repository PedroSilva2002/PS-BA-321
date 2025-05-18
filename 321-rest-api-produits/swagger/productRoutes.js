/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Add new produit
 *     description: Creates new new produit et add à la db.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               quantite_en_stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produit created successfully.
 */
/**
 * @swagger
 * /api/produits/{id}:
 *   delete:
 *     summary: Delete a produit
 *     description: Deletes a produit by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Produit ID
 *     responses:
 *       200:
 *         description: Produit deleted successfully.
 */
/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Get all produits
 *     description: Retrieve a list of all produits.
 *     responses:
 *       200:
 *         description: A list of produits.
 */
/**
 * @swagger
 * /api/produits/{id}:
 *   put:
 *     summary: Update a produit
 *     description: Updates an existing produit.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Produitt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               quantite_en_stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully.
 */