const { Product } = require('../models');
const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  unitCost: z.number().positive(),
  uom: z.string().default('unit'),
});

class ProductController {
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;
      const where = search ? {
        [require('sequelize').Op.or]: [
          { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { sku: { [require('sequelize').Op.iLike]: `%${search}%` } },
        ],
      } : {};

      const { count, rows } = await Product.findAndCountAll({
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
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const data = productSchema.parse(req.body);
      const product = await Product.create({
        ...data,
        createdById: req.user.id,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = productSchema.partial().parse(req.body);
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      await product.update({
        ...data,
        updatedById: req.user.id,
      });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;