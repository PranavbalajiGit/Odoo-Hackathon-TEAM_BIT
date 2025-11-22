module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define('Warehouse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
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

  Warehouse.associate = (models) => {
    Warehouse.hasMany(models.Location, { foreignKey: 'warehouseId' });
    Warehouse.hasMany(models.StockQuant, { foreignKey: 'warehouseId' });
    Warehouse.hasMany(models.Operation, { foreignKey: 'warehouseId' });
  };

  return Warehouse;
};