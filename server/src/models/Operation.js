module.exports = (sequelize, DataTypes) => {
  const Operation = sequelize.define('Operation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('RECEIPT', 'DELIVERY', 'ADJUSTMENT'),
      allowNull: false,
    },
    fromLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    toLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    fromParty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    toParty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Warehouses',
        key: 'id',
      },
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['warehouseId', 'type', 'status', 'scheduledAt'],
      },
    ],
  });

  Operation.associate = (models) => {
    Operation.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
    Operation.belongsTo(models.Location, { as: 'fromLocation', foreignKey: 'fromLocationId' });
    Operation.belongsTo(models.Location, { as: 'toLocation', foreignKey: 'toLocationId' });
    Operation.hasMany(models.OperationLine, { as: 'lines', foreignKey: 'operationId' });
    Operation.hasMany(models.StockMove, { foreignKey: 'operationId' });
  };

  return Operation;
};