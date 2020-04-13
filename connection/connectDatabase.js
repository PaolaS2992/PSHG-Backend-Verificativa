const { MongoClient } = require('mongodb');
// const config = require('../config');

console.log('Variables de entorno DB_URL:', process.env.DB_URL);

let database;
module.exports = () => {
  if (!database) {
    return MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true })
      .then((client) => {
        database = client.db('veri');
        console.log('Database connect!');
        return database;
      }).catch((err) => err);
  }
  return Promise.resolve(database);
};
