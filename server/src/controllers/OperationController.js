const { Operation, OperationLine, Sequence } = require('../models');
const { z } = require('zod');
const OperationService = require('../services/OperationService');
const SequenceService = require('../services/SequenceService');

const operationCreateSchema = z.object({
  warehouseId: z.number().int().positive(),
  type: z.enum(['RECEIPT', 'DELIVERY', 'ADJUSTMENT', 'TRANSFER']),
  fromLocationId: z.number().int().positive().optional(),
  toLocationId: z.number().int().positive().optional(),
  scheduledAt: z.string().datetime(),
  fromParty: z.string().optional(),
  toParty: z.string().optional(),
  note: z.string().optional(),
  lines: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
});

class OperationController {
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, type, status, warehouseId, reference } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (type) where.type = type;
      if (status) where.status = status;
      if (warehouseId) where.warehouseId = warehouseId;
      if (reference) where.reference = { [require('sequelize').Op.iLike]: `%${reference}%` };

      const { count, rows } = await Operation.findAndCountAll({
        where,
        include: ['lines', 'Warehouse', 'fromLocation', 'toLocation'],
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']],
      });

      res.json({
        data: rows,
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const operation = await Operation.findByPk(req.params.id, {
        include: ['lines', 'Warehouse', 'fromLocation', 'toLocation'],
      });
      if (!operation) return res.status(404).json({ error: 'Operation not found' });
      res.json(operation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const data = operationCreateSchema.parse(req.body);
      const operation = await OperationService.createOperation(data, req.user.id);
      res.status(201).json(operation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const operation = await Operation.findByPk(req.params.id, { include: ['lines'] });
      if (!operation) return res.status(404).json({ error: 'Operation not found' });
      if (operation.status !== 'DRAFT') return res.status(400).json({ error: 'Can only edit DRAFT operations' });

      const data = operationCreateSchema.partial().parse(req.body);
      await operation.update({
        ...data,
        updatedById: req.user.id,
      });

      // Update lines if provided
      if (data.lines) {
        await OperationLine.destroy({ where: { operationId: operation.id } });
        const lines = data.lines.map(line => ({
          ...line,
          operationId: operation.id,
          unitCostSnapshot: 0,
        }));
        await OperationLine.bulkCreate(lines);
      }

      res.json(operation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async confirm(req, res) {
    try {
      await OperationService.confirmOperation(req.params.id, req.user.id);
      res.json({ message: 'Operation confirmed' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async validate(req, res) {
    try {
      await OperationService.validateOperation(req.params.id, req.user.id);
      res.json({ message: 'Operation validated' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async cancel(req, res) {
    try {
      await OperationService.cancelOperation(req.params.id, req.user.id);
      res.json({ message: 'Operation cancelled' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OperationController;