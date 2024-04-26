const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb://localhost:27017')
    .then((client) => {
      console.log('Connected');
      _db = client.db;
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No DB found!';
};

exports.mongoConnect = mongoConnect; //for connect to mongo db, and storing connection to db
exports.getDb = getDb; //return acces to db if db exist, and for coonection pooling for multiple db
