const { StockQuant, Operation, OperationLine, Sequence } = require('../models');
const { z } = require('zod');
const { sequelize } = require('../models');
const OperationService = require('../services/OperationService');
const SequenceService = require('../services/SequenceService');

class StockController {
  static async getStock(req, res) {
    try {
      const { warehouseId, locationId, productId } = req.query;
      const where = {};
      if (warehouseId) where.warehouseId = warehouseId;
      if (locationId) where.locationId = locationId;
      if (productId) where.productId = productId;

      const stock = await StockQuant.findAll({
        where,
        include: ['Warehouse', 'Location', 'Product'],
        attributes: {
          include: [
            [sequelize.literal('onHand - reserved'), 'freeToUse'],
          ],
        },
      });

      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async adjustStock(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const adjustSchema = z.object({
        warehouseId: z.number().int().positive(),
        locationId: z.number().int().positive(),
        productId: z.number().int().positive(),
        delta: z.number().int(),
        note: z.string().optional(),
      });
      const { warehouseId, locationId, productId, delta, note } = adjustSchema.parse(req.body);

      // Get or create sequence
      const sequence = await SequenceService.getNextNumber(warehouseId, 'ADJUSTMENT', { transaction });

      const operation = await Operation.create({
        warehouseId,
        type: 'ADJUSTMENT',
        fromLocationId: locationId,
        toLocationId: locationId,
        reference: sequence.reference,
        scheduledAt: new Date(),
        status: 'DRAFT',
        note: note || '',
        createdById: req.user.id,
      }, { transaction });

      await OperationLine.create({
        operationId: operation.id,
        productId,
        quantity: Math.abs(delta),
        unitCostSnapshot: 0, // or get from product
      }, { transaction });

      await OperationService.validateOperation(operation.id, req.user.id);

      await transaction.commit();
      res.status(201).json({ message: 'Stock adjusted' });
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = StockController;