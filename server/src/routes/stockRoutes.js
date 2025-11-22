const express = require('express');
const StockController = require('../controllers/StockController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Get stock levels
 *     tags: [Stock]
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of stock quants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockQuant'
 *             example:
 *               - warehouseId: 1
 *                 locationId: 1
 *                 productId: 1
 *                 onHand: 50
 *                 reserved: 5
 *                 freeToUse: 45
 *   patch:
 *     summary: Adjust stock
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - locationId
 *               - productId
 *               - delta
 *             properties:
 *               warehouseId: { type: 'integer', example: 1 }
 *               locationId: { type: 'integer', example: 1 }
 *               productId: { type: 'integer', example: 1 }
 *               delta: { type: 'integer', example: 10 }
 *               note: { type: 'string', example: 'Manual adjustment' }
 *     responses:
 *       201:
 *         description: Stock adjusted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'Stock adjusted' }
 */
router.get('/', StockController.getStock);
router.patch('/adjust', StockController.adjustStock);

module.exports = router;