const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBstore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const MONGODB_URI = 'mongodb://localhost:27017/shop2';

const app = express();
const store = new MongoDBstore({ uri: MONGODB_URI, collection: 'sessions' });

app.set('view engine', 'ejs');
app.set('views', 'views'); //views in views folder

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

// app.use((req, res, next) => {
//   res.status(404).render('error/404', { pageTitle: 'Page not found!' });
// });
app.use(errorController.get404);

// mongoConnect((client) => {
//   // console.log(client);
//   app.listen(3000);
// });

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'max',
          email: 'max@test.com',
          cart: { items: [] },
        });
        user.save();
      }
    });
    console.log('connect');
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
