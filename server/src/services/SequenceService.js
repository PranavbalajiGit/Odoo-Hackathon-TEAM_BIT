const { Sequence, sequelize } = require('../models');

class SequenceService {
  static async getNextNumber(warehouseId, type) {
    const transaction = await sequelize.transaction();
    try {
      const [sequence] = await Sequence.findOrCreate({
        where: { warehouseId, type },
        defaults: { nextNumber: 1 },
        transaction,
      });

      const nextNumber = sequence.nextNumber;
      await sequence.increment('nextNumber', { transaction });

      await transaction.commit();
      return nextNumber;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static generateReference(warehouseShortCode, type, number) {
    const typeMap = {
      RECEIPT: 'IN',
      DELIVERY: 'OUT',
      ADJUSTMENT: 'ADJ',
      TRANSFER: 'TRF',
    };
    return `${warehouseShortCode}/${typeMap[type]}/${String(number).padStart(4, '0')}`;
  }
}

module.exports = SequenceService;