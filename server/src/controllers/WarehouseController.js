const { Warehouse, Location } = require('../models');
const { z } = require('zod');

const warehouseSchema = z.object({
  name: z.string().min(1),
  shortCode: z.string().min(1),
  address: z.string().optional(),
});

class WarehouseController {
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;
      const where = search ? {
        [require('sequelize').Op.or]: [
          { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { shortCode: { [require('sequelize').Op.iLike]: `%${search}%` } },
        ],
      } : {};

      const { count, rows } = await Warehouse.findAndCountAll({
        where,
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
      const warehouse = await Warehouse.findByPk(req.params.id);
      if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
      res.json(warehouse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const data = warehouseSchema.parse(req.body);
      const warehouse = await Warehouse.create({
        ...data,
        createdById: req.user.id,
      });
      res.status(201).json(warehouse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = warehouseSchema.partial().parse(req.body);
      const warehouse = await Warehouse.findByPk(req.params.id);
      if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });

      await warehouse.update({
        ...data,
        updatedById: req.user.id,
      });
      res.json(warehouse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const warehouse = await Warehouse.findByPk(req.params.id);
      if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });

      await warehouse.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLocations(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Location.findAndCountAll({
        where: { warehouseId: req.params.warehouseId },
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

  static async createLocation(req, res) {
    try {
      const locationSchema = z.object({
        name: z.string().min(1),
        shortCode: z.string().min(1),
      });
      const data = locationSchema.parse(req.body);
      const location = await Location.create({
        ...data,
        warehouseId: req.params.warehouseId,
        createdById: req.user.id,
      });
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = WarehouseController;