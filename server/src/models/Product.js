module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    unitCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    uom: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unit',
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
  });

  Product.associate = (models) => {
    Product.hasMany(models.StockQuant, { foreignKey: 'productId' });
    Product.hasMany(models.OperationLine, { foreignKey: 'productId' });
    Product.hasMany(models.StockMove, { foreignKey: 'productId' });
  };

  return Product;
};