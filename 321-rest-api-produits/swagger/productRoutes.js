/**
 * @swagger
 * components:
 *   schemas:
 *     Produit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         prix:
 *           type: number
 *         quantite_en_stock:
 *           type: integer
 *       example:
 *         id: 1
 *         nom: "Produit A"
 *         description: "Un produit test"
 *         prix: 29.99
 *         quantite_en_stock: 50
 */

/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Add new produit
 *     description: Creates a new produit and adds it to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produit'
 *     responses:
 *       201:
 *         description: Produit created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produit'
 */

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Get produit by ID
 *     description: Retrieves a produit by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Produit ID
 *     responses:
 *       200:
 *         description: Produit retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Produit not found
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
 *         description: Produit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produit'
 *     responses:
 *       200:
 *         description: Produit updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Produit not found
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
 *       404:
 *         description: Produit not found
 */
