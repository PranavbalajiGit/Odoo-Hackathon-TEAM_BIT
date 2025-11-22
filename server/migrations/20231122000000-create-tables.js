'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      loginId: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'staff'),
        allowNull: false,
        defaultValue: 'staff',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Warehouses
    await queryInterface.createTable('Warehouses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shortCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Locations
    await queryInterface.createTable('Locations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Warehouses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shortCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Products
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      unitCost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      uom: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'unit',
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // StockQuants
    await queryInterface.createTable('StockQuants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Warehouses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      onHand: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reserved: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Sequences
    await queryInterface.createTable('Sequences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Warehouses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('RECEIPT', 'DELIVERY', 'ADJUSTMENT'),
        allowNull: false,
      },
      nextNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Operations
    await queryInterface.createTable('Operations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM('RECEIPT', 'DELIVERY', 'ADJUSTMENT'),
        allowNull: false,
      },
      fromLocationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      toLocationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      fromParty: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      toParty: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      scheduledAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Warehouses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // OperationLines
    await queryInterface.createTable('OperationLines', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      operationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Operations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unitCostSnapshot: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // StockMoves
    await queryInterface.createTable('StockMoves', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      operationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Operations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fromLocationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      toLocationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      movedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Indexes
    await queryInterface.addIndex('Locations', ['warehouseId', 'shortCode'], { unique: true });
    await queryInterface.addIndex('StockQuants', ['warehouseId', 'locationId', 'productId'], { unique: true });
    await queryInterface.addIndex('Sequences', ['warehouseId', 'type'], { unique: true });
    await queryInterface.addIndex('Operations', ['warehouseId', 'type', 'status', 'scheduledAt']);
    await queryInterface.addIndex('StockMoves', ['operationId']);
    await queryInterface.addIndex('StockMoves', ['productId', 'movedAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('StockMoves');
    await queryInterface.dropTable('OperationLines');
    await queryInterface.dropTable('Operations');
    await queryInterface.dropTable('Sequences');
    await queryInterface.dropTable('StockQuants');
    await queryInterface.dropTable('Products');
    await queryInterface.dropTable('Locations');
    await queryInterface.dropTable('Warehouses');
    await queryInterface.dropTable('Users');
  },
};