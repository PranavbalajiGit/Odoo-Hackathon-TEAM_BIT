const express = require('express');
const OperationController = require('../controllers/OperationController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

/**
 * @swagger
 * /operations:
 *   get:
 *     summary: Get all operations
 *     tags: [Operations]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [RECEIPT, DELIVERY, ADJUSTMENT]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, WAITING, READY, DONE, CANCELLED]
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of operations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pagination'
 *             example:
 *               data: [{ id: 1, reference: 'WH/IN/0001', type: 'RECEIPT', status: 'READY', lines: [] }]
 *               page: 1
 *               limit: 10
 *               total: 4
 *   post:
 *     summary: Create an operation
 *     tags: [Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - type
 *               - scheduledAt
 *               - lines
 *             properties:
 *               warehouseId: { type: 'integer', example: 1 }
 *               type: { type: 'string', enum: ['RECEIPT', 'DELIVERY', 'ADJUSTMENT'], example: 'RECEIPT' }
 *               fromLocationId: { type: 'integer', example: null }
 *               toLocationId: { type: 'integer', example: 1 }
 *               scheduledAt: { type: 'string', format: 'date-time', example: '2023-11-22T10:00:00Z' }
 *               fromParty: { type: 'string', example: 'Acme Interior' }
 *               toParty: { type: 'string', example: null }
 *               note: { type: 'string', example: 'Receipt note' }
 *               lines: {
 *                 type: 'array',
 *                 items: {
 *                   type: 'object',
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId: { type: 'integer', example: 1 }
 *                     quantity: { type: 'integer', example: 10 }
 *                 }
 *               }
 *     responses:
 *       201:
 *         description: Operation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 */
router.get('/', OperationController.getAll);
router.post('/', OperationController.create);

/**
 * @swagger
 * /operations/{id}:
 *   get:
 *     summary: Get operation by ID
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Operation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 *       404:
 *         description: Operation not found
 *   patch:
 *     summary: Update operation
 *     tags: [Operations]
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
 *               fromLocationId: { type: 'integer' }
 *               toLocationId: { type: 'integer' }
 *               scheduledAt: { type: 'string', format: 'date-time' }
 *               fromParty: { type: 'string' }
 *               toParty: { type: 'string' }
 *               note: { type: 'string' }
 *               lines: {
 *                 type: 'array',
 *                 items: {
 *                   type: 'object',
 *                   properties:
 *                     productId: { type: 'integer' }
 *                     quantity: { type: 'integer' }
 *                 }
 *               }
 *     responses:
 *       200:
 *         description: Operation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 */
router.get('/:id', OperationController.getById);
router.patch('/:id', OperationController.update);

/**
 * @swagger
 * /operations/{id}/confirm:
 *   post:
 *     summary: Confirm operation
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Operation confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'Operation confirmed' }
 */
router.post('/:id/confirm', OperationController.confirm);

/**
 * @swagger
 * /operations/{id}/validate:
 *   post:
 *     summary: Validate operation
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Operation validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'Operation validated' }
 */
router.post('/:id/validate', OperationController.validate);

/**
 * @swagger
 * /operations/{id}/cancel:
 *   post:
 *     summary: Cancel operation
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Operation cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'Operation cancelled' }
 */
router.post('/:id/cancel', OperationController.cancel);

module.exports = router;