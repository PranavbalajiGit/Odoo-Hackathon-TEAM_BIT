module.exports = (sequelize, DataTypes) => {
  const OperationLine = sequelize.define('OperationLine', {
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unitCostSnapshot: {
      type: DataTypes.DECIMAL(12, 2),
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
    paranoid: true,
  });

  OperationLine.associate = (models) => {
    OperationLine.belongsTo(models.Operation, { foreignKey: 'operationId' });
    OperationLine.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return OperationLine;
};