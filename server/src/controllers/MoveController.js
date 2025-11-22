const { StockMove } = require('../models');

class MoveController {
  static async getMoves(req, res) {
    try {
      const { page = 1, limit = 10, warehouseId, fromLocationId, toLocationId, productId, dateFrom, dateTo, reference } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (warehouseId) where['$Operation.warehouseId$'] = warehouseId;
      if (fromLocationId) where.fromLocationId = fromLocationId;
      if (toLocationId) where.toLocationId = toLocationId;
      if (productId) where.productId = productId;
      if (dateFrom || dateTo) {
        where.movedAt = {};
        if (dateFrom) where.movedAt[require('sequelize').Op.gte] = new Date(dateFrom);
        if (dateTo) where.movedAt[require('sequelize').Op.lte] = new Date(dateTo);
      }
      if (reference) where.reference = { [require('sequelize').Op.iLike]: `%${reference}%` };

      const { count, rows } = await StockMove.findAndCountAll({
        where,
        include: ['Operation', 'Product', 'fromLocation', 'toLocation'],
        limit: parseInt(limit),
        offset,
        order: [['movedAt', 'DESC']],
        attributes: {
          include: [
            [require('sequelize').literal('CASE WHEN qty > 0 THEN \'IN\' ELSE \'OUT\' END'), 'direction'],
          ],
        },
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
}

module.exports = MoveController;