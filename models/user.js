const mongodb = require('mongodb');
const getDb = require('../util/database');
const { ObjectId } = require('mongodb');

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: ObjectId.createFromHexString(userId) });
  }
}
module.exports = User;
