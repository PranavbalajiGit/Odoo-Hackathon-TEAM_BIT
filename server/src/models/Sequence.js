module.exports = (sequelize, DataTypes) => {
  const Sequence = sequelize.define('Sequence', {
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
    type: {
      type: DataTypes.ENUM('RECEIPT', 'DELIVERY', 'ADJUSTMENT'),
      allowNull: false,
    },
    nextNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['warehouseId', 'type'],
      },
    ],
  });

  Sequence.associate = (models) => {
    Sequence.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
  };

  return Sequence;
};