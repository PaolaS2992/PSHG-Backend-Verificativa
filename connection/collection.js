const getDatabase = require('./connectDB');

module.exports = (nameCollection) => getDatabase()
  .then((db) => db.collection(nameCollection));
