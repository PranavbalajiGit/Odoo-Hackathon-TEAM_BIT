const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    loginId: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      validate: {
        len: [6, 12],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff'),
      allowNull: false,
      defaultValue: 'staff',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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

  User.beforeCreate(async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
  });

  User.prototype.checkPassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};