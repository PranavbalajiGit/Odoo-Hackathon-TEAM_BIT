const { Operation, OperationLine, StockQuant, StockMove, Warehouse, sequelize } = require('../models');
const SequenceService = require('./SequenceService');

class OperationService {
  static async createOperation(data, userId) {
    const transaction = await sequelize.transaction();
    try {
      const warehouse = await Warehouse.findByPk(data.warehouseId, { transaction });
      if (!warehouse) throw new Error('Warehouse not found');

      const nextNumber = await SequenceService.getNextNumber(data.warehouseId, data.type);
      const reference = SequenceService.generateReference(warehouse.shortCode, data.type, nextNumber);

      const operation = await Operation.create({
        ...data,
        reference,
        createdById: userId,
      }, { transaction });

      for (const line of data.lines) {
        const product = await sequelize.models.Product.findByPk(line.productId, { transaction });
        if (!product) throw new Error(`Product ${line.productId} not found`);

        await OperationLine.create({
          operationId: operation.id,
          productId: line.productId,
          quantity: line.quantity,
          unitCostSnapshot: product.unitCost,
          createdById: userId,
        }, { transaction });
      }

      await transaction.commit();
      return await Operation.findByPk(operation.id, { include: [{ model: OperationLine, as: 'lines' }] });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async confirmOperation(id, userId) {
    const transaction = await sequelize.transaction();
    try {
      const operation = await Operation.findByPk(id, {
        include: [{ model: OperationLine, as: 'lines' }],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!operation || operation.status !== 'DRAFT') {
        throw new Error('Operation not found or not in DRAFT status');
      }

      if (operation.type === 'DELIVERY') {
        await this.reserveForDelivery(operation, transaction);
      } else if (operation.type === 'TRANSFER') {
        // Check stock availability for transfers
        for (const line of operation.lines) {
          const quant = await StockQuant.findOne({
            where: {
              warehouseId: operation.warehouseId,
              locationId: operation.fromLocationId,
              productId: line.productId,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

          if (!quant || quant.getFreeToUse() < line.quantity) {
            throw new Error(`Insufficient stock for transfer - product ${line.productId}`);
          }
        }
      }

      operation.status = 'READY';
      operation.updatedById = userId;
      await operation.save({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async reserveForDelivery(operation, transaction) {
    for (const line of operation.lines) {
      const quant = await StockQuant.findOne({
        where: {
          warehouseId: operation.warehouseId,
          locationId: operation.fromLocationId,
          productId: line.productId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!quant || quant.getFreeToUse() < line.quantity) {
        throw new Error(`Insufficient stock for product ${line.productId}`);
      }

      quant.reserved += line.quantity;
      await quant.save({ transaction });
    }
  }

  static async validateOperation(id, userId) {
    const transaction = await sequelize.transaction();
    try {
      const operation = await Operation.findByPk(id, {
        include: [{ model: OperationLine, as: 'lines' }],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!operation || operation.status !== 'READY') {
        throw new Error('Operation not found or not in READY status');
      }

      for (const line of operation.lines) {
        await this.processLine(operation, line, transaction);
        await StockMove.create({
          operationId: operation.id,
          productId: line.productId,
          qty: this.getSignedQty(operation.type, line.quantity),
          fromLocationId: operation.fromLocationId,
          toLocationId: operation.toLocationId,
          movedAt: new Date(),
          reference: operation.reference,
          createdById: userId,
        }, { transaction });
      }

      operation.status = 'DONE';
      operation.updatedById = userId;
      await operation.save({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async processLine(operation, line, transaction) {
    let fromLocationId, toLocationId, delta;
    
    if (operation.type === 'RECEIPT') {
      toLocationId = operation.toLocationId;
      delta = line.quantity;
      // Increase stock at toLocation
      const quant = await StockQuant.findOrCreate({
        where: {
          warehouseId: operation.warehouseId,
          locationId: toLocationId,
          productId: line.productId,
        },
        defaults: {
          onHand: 0,
          reserved: 0,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      quant.onHand += delta;
      if (quant.onHand < 0) throw new Error('Cannot reduce stock below 0');
      await quant.save({ transaction });
    } else if (operation.type === 'DELIVERY') {
      fromLocationId = operation.fromLocationId;
      delta = -line.quantity;
      // Decrease stock at fromLocation (reserved was already deducted)
      const quant = await StockQuant.findOne({
        where: {
          warehouseId: operation.warehouseId,
          locationId: fromLocationId,
          productId: line.productId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!quant || quant.onHand < line.quantity) {
        throw new Error('Insufficient stock');
      }
      quant.reserved -= line.quantity;
      quant.onHand -= line.quantity;
      if (quant.onHand < 0) throw new Error('Cannot reduce stock below 0');
      await quant.save({ transaction });
    } else if (operation.type === 'ADJUSTMENT') {
      const locationId = operation.toLocationId || operation.fromLocationId;
      delta = line.quantity; // Can be positive or negative
      const quant = await StockQuant.findOrCreate({
        where: {
          warehouseId: operation.warehouseId,
          locationId,
          productId: line.productId,
        },
        defaults: {
          onHand: 0,
          reserved: 0,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      quant.onHand += delta;
      if (quant.onHand < 0) throw new Error('Cannot reduce stock below 0');
      await quant.save({ transaction });
    } else if (operation.type === 'TRANSFER') {
      fromLocationId = operation.fromLocationId;
      toLocationId = operation.toLocationId;
      // Decrease from source, increase at destination
      const fromQuant = await StockQuant.findOne({
        where: {
          warehouseId: operation.warehouseId,
          locationId: fromLocationId,
          productId: line.productId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!fromQuant || fromQuant.getFreeToUse() < line.quantity) {
        throw new Error(`Insufficient stock at source location for product ${line.productId}`);
      }
      
      const toQuant = await StockQuant.findOrCreate({
        where: {
          warehouseId: operation.warehouseId,
          locationId: toLocationId,
          productId: line.productId,
        },
        defaults: {
          onHand: 0,
          reserved: 0,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      
      fromQuant.onHand -= line.quantity;
      toQuant.onHand += line.quantity;
      
      if (fromQuant.onHand < 0) throw new Error('Cannot reduce stock below 0');
      
      await fromQuant.save({ transaction });
      await toQuant.save({ transaction });
    }
  }

  static getSignedQty(type, qty) {
    if (type === 'RECEIPT') return qty;
    if (type === 'DELIVERY') return -qty;
    if (type === 'TRANSFER') return qty; // Transfer moves stock but doesn't change total
    return qty; // adjustment
  }

  static async cancelOperation(id, userId) {
    const transaction = await sequelize.transaction();
    try {
      const operation = await Operation.findByPk(id, {
        include: [{ model: OperationLine, as: 'lines' }],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!operation || operation.status === 'DONE' || operation.status === 'CANCELLED') {
        throw new Error('Cannot cancel');
      }

      if (operation.type === 'DELIVERY' && operation.status === 'READY') {
        // Release reservations
        for (const line of operation.lines) {
          const quant = await StockQuant.findOne({
            where: {
              warehouseId: operation.warehouseId,
              locationId: operation.fromLocationId,
              productId: line.productId,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
          });
          if (quant) {
            quant.reserved -= line.quantity;
            await quant.save({ transaction });
          }
        }
      }

      operation.status = 'CANCELLED';
      operation.updatedById = userId;
      await operation.save({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = OperationService;