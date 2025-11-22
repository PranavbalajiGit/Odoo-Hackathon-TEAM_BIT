const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const warehouseRoutes = require('./warehouseRoutes');
const productRoutes = require('./productRoutes');
const stockRoutes = require('./stockRoutes');
const operationRoutes = require('./operationRoutes');
const moveRoutes = require('./moveRoutes');

router.use('/auth', authRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/products', productRoutes);
router.use('/stock', stockRoutes);
router.use('/operations', operationRoutes);
router.use('/moves', moveRoutes);

module.exports = router;