const express = require('express');
const WarehouseController = require('../controllers/WarehouseController');
const LocationController = require('../controllers/LocationController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouses]
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
 *         description: List of warehouses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pagination'
 *             example:
 *               data: [{ id: 1, name: 'Acme Interior', shortCode: 'WH', address: '123 Main St' }]
 *               page: 1
 *               limit: 10
 *               total: 1
 *   post:
 *     summary: Create a warehouse
 *     tags: [Warehouses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - shortCode
 *             properties:
 *               name: { type: 'string', example: 'New Warehouse' }
 *               shortCode: { type: 'string', example: 'NW' }
 *               address: { type: 'string', example: '456 Elm St' }
 *     responses:
 *       201:
 *         description: Warehouse created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 */
router.get('/', WarehouseController.getAll);
router.post('/', WarehouseController.create);

/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Warehouse details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Warehouse not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update warehouse
 *     tags: [Warehouses]
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
 *               name: { type: 'string', example: 'Updated Warehouse' }
 *               shortCode: { type: 'string', example: 'UW' }
 *               address: { type: 'string', example: '789 Oak St' }
 *     responses:
 *       200:
 *         description: Warehouse updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *   delete:
 *     summary: Delete warehouse
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Warehouse deleted
 *       404:
 *         description: Warehouse not found
 */
router.get('/:id', WarehouseController.getById);
router.patch('/:id', WarehouseController.update);
router.delete('/:id', WarehouseController.delete);

/**
 * @swagger
 * /warehouses/{warehouseId}/locations:
 *   get:
 *     summary: Get locations for a warehouse
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pagination'
 *             example:
 *               data: [{ id: 1, warehouseId: 1, name: 'Stock1', shortCode: 'Stock1' }]
 *               page: 1
 *               limit: 10
 *               total: 2
 *   post:
 *     summary: Create a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - shortCode
 *             properties:
 *               name: { type: 'string', example: 'New Location' }
 *               shortCode: { type: 'string', example: 'NL' }
 *     responses:
 *       201:
 *         description: Location created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 */
router.get('/:warehouseId/locations', WarehouseController.getLocations);
router.post('/:warehouseId/locations', WarehouseController.createLocation);

/**
 * @swagger
 * /locations/{id}:
 *   patch:
 *     summary: Update location
 *     tags: [Locations]
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
 *               name: { type: 'string', example: 'Updated Location' }
 *               shortCode: { type: 'string', example: 'UL' }
 *     responses:
 *       200:
 *         description: Location updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *   delete:
 *     summary: Delete location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Location deleted
 */
router.patch('/locations/:id', LocationController.update);
router.delete('/locations/:id', LocationController.delete);

module.exports = router;