const getDatabase = require('./connectDatabase');

module.exports = (nameCollection) => getDatabase()
  .then((db) => db.collection(nameCollection));
