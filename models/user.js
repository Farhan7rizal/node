const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; //{items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex(cp => {
    //find index which simply is a function javascript will execute for every element in the items array
    //   return cp._id === product._id;
    // })
    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    db.collection('users').updateOne(
      { _id: this._id },
      { $set: { cart: updatedCart } }
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: ObjectId.createFromHexString(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = User;
