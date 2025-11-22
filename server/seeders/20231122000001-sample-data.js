'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users
    await queryInterface.bulkInsert('Users', [
      {
        loginId: 'admin01',
        email: 'admin@example.com',
        passwordHash: '$2a$10$aDzck7Vr1hwgTMdJV.MFGOtgSJc/jcUivcJWHnasDNzt72ccJNfjK', // bcrypt hash for 'password'
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        loginId: 'staff01',
        email: 'staff@example.com',
        passwordHash: '$2a$10$4nk5YF8FSGmvYO3rx/WSVuywJKixbCgNAotNAM22.IIbKxdB.eJ9.', // bcrypt hash for 'password'
        role: 'staff',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Warehouses
    await queryInterface.bulkInsert('Warehouses', [
      {
        name: 'Acme Interior',
        shortCode: 'WH',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Locations
    await queryInterface.bulkInsert('Locations', [
      {
        warehouseId: 1,
        name: 'Stock1',
        shortCode: 'Stock1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouseId: 1,
        name: 'Stock2',
        shortCode: 'Stock2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Products
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Desk',
        sku: 'DESK001',
        unitCost: 3000.00,
        uom: 'unit',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Table',
        sku: 'TABLE001',
        unitCost: 3000.00,
        uom: 'unit',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // StockQuants
    await queryInterface.bulkInsert('StockQuants', [
      {
        warehouseId: 1,
        locationId: 1,
        productId: 1,
        onHand: 50,
        reserved: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouseId: 1,
        locationId: 1,
        productId: 2,
        onHand: 50,
        reserved: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Sequences
    await queryInterface.bulkInsert('Sequences', [
      {
        warehouseId: 1,
        type: 'RECEIPT',
        nextNumber: 3, // After IN0001, IN0002
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouseId: 1,
        type: 'DELIVERY',
        nextNumber: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouseId: 1,
        type: 'ADJUSTMENT',
        nextNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Operations
    await queryInterface.bulkInsert('Operations', [
      {
        reference: 'WH/IN/0001',
        type: 'RECEIPT',
        toLocationId: 1,
        fromParty: 'Acme Interior',
        scheduledAt: new Date(),
        status: 'READY',
        warehouseId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reference: 'WH/IN/0002',
        type: 'RECEIPT',
        toLocationId: 1,
        fromParty: 'Acme Interior',
        scheduledAt: new Date(),
        status: 'READY',
        warehouseId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reference: 'WH/OUT/0001',
        type: 'DELIVERY',
        fromLocationId: 1,
        toParty: 'Acme Interior',
        scheduledAt: new Date(),
        status: 'READY',
        warehouseId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reference: 'WH/OUT/0002',
        type: 'DELIVERY',
        fromLocationId: 1,
        toParty: 'Acme Interior',
        scheduledAt: new Date(),
        status: 'READY',
        warehouseId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // OperationLines
    await queryInterface.bulkInsert('OperationLines', [
      {
        operationId: 1,
        productId: 1,
        quantity: 10,
        unitCostSnapshot: 3000.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operationId: 1,
        productId: 2,
        quantity: 10,
        unitCostSnapshot: 3000.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operationId: 2,
        productId: 1,
        quantity: 5,
        unitCostSnapshot: 3000.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operationId: 3,
        productId: 1,
        quantity: 5,
        unitCostSnapshot: 3000.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operationId: 4,
        productId: 2,
        quantity: 5,
        unitCostSnapshot: 3000.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // For DONE operations, but since status is READY, no StockMoves yet
    // To have move history, we can set some to DONE and add StockMoves
    // But for simplicity, leave as is, and user can validate later
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OperationLines', null, {});
    await queryInterface.bulkDelete('Operations', null, {});
    await queryInterface.bulkDelete('Sequences', null, {});
    await queryInterface.bulkDelete('StockQuants', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Locations', null, {});
    await queryInterface.bulkDelete('Warehouses', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};