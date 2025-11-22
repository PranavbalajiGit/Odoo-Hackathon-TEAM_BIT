module.exports = (sequelize, DataTypes) => {
  const StockQuant = sequelize.define('StockQuant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Warehouses',
        key: 'id',
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Locations',
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
    onHand: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    reserved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
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
        unique: true,
        fields: ['warehouseId', 'locationId', 'productId'],
      },
    ],
  });

  StockQuant.associate = (models) => {
    StockQuant.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
    StockQuant.belongsTo(models.Location, { foreignKey: 'locationId' });
    StockQuant.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  // Virtual field for freeToUse
  StockQuant.prototype.getFreeToUse = function() {
    return this.onHand - this.reserved;
  };

  return StockQuant;
};