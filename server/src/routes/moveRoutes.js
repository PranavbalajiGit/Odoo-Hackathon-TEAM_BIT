const express = require('express');
const MoveController = require('../controllers/MoveController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

/**
 * @swagger
 * /moves:
 *   get:
 *     summary: Get move history
 *     tags: [Moves]
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
 *         name: warehouseId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fromLocationId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: toLocationId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of moves
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pagination'
 *             example:
 *               data: [{ id: 1, operationId: 1, productId: 1, qty: 10, reference: 'WH/IN/0001', direction: 'IN' }]
 *               page: 1
 *               limit: 10
 *               total: 10
 */
router.get('/', MoveController.getMoves);

module.exports = router;