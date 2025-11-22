module.exports = (sequelize, DataTypes) => {
  const StockMove = sequelize.define('StockMove', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Operations',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    qty: {
      type: DataTypes.INTEGER,
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
    movedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
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
    paranoid: false, // Not paranoid as per prompt
    indexes: [
      {
        fields: ['operationId'],
      },
      {
        fields: ['productId', 'movedAt'],
      },
    ],
  });

  StockMove.associate = (models) => {
    StockMove.belongsTo(models.Operation, { foreignKey: 'operationId' });
    StockMove.belongsTo(models.Product, { foreignKey: 'productId' });
    StockMove.belongsTo(models.Location, { as: 'fromLocation', foreignKey: 'fromLocationId' });
    StockMove.belongsTo(models.Location, { as: 'toLocation', foreignKey: 'toLocationId' });
  };

  // Virtual for direction
  StockMove.prototype.getDirection = function() {
    return this.qty > 0 ? 'IN' : 'OUT';
  };

  return StockMove;
};