module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortCode: {
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
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['warehouseId', 'shortCode'],
      },
    ],
  });

  Location.associate = (models) => {
    Location.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
    Location.hasMany(models.StockQuant, { foreignKey: 'locationId' });
  };

  return Location;
};