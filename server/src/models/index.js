const { Sequelize } = require('sequelize');
const config = require('../../config/config.js');

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, config.development);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Warehouse = require('./Warehouse')(sequelize, Sequelize);
db.Location = require('./Location')(sequelize, Sequelize);
db.Product = require('./Product')(sequelize, Sequelize);
db.StockQuant = require('./StockQuant')(sequelize, Sequelize);
db.Operation = require('./Operation')(sequelize, Sequelize);
db.OperationLine = require('./OperationLine')(sequelize, Sequelize);
db.StockMove = require('./StockMove')(sequelize, Sequelize);
db.Sequence = require('./Sequence')(sequelize, Sequelize);

// Associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;