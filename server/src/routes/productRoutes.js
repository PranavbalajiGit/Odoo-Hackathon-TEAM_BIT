const express = require('express');
const ProductController = require('../controllers/ProductController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pagination'
 *             example:
 *               data: [{ id: 1, name: 'Desk', sku: 'DESK001', unitCost: 3000.00, uom: 'unit' }]
 *               page: 1
 *               limit: 10
 *               total: 2
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - unitCost
 *             properties:
 *               name: { type: 'string', example: 'New Product' }
 *               sku: { type: 'string', example: 'NP001' }
 *               unitCost: { type: 'number', format: 'float', example: 1500.00 }
 *               uom: { type: 'string', example: 'unit' }
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get('/', ProductController.getAll);
router.post('/', ProductController.create);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: 'string', example: 'Updated Product' }
 *               sku: { type: 'string', example: 'UP001' }
 *               unitCost: { type: 'number', format: 'float', example: 2000.00 }
 *               uom: { type: 'string', example: 'unit' }
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted
 */
router.get('/:id', ProductController.getById);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;