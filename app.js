const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBstore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');

const MONGODB_URI = 'mongodb://localhost:27017/shop2';

const app = express();
const store = new MongoDBstore({ uri: MONGODB_URI, collection: 'sessions' });
const dateName = new Date().toDateString();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, dateName + ' ' + file.originalname);
  },
});

app.set('view engine', 'ejs');
app.set('views', 'views'); //views in views folder

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer({ dest: 'images' }).single('image'));
app.use(multer({ storage: fileStorage }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.use((req, res, next) => {
  // throw new Error('Dummy!');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error('Dummy!');
      if (!user) {
        //wisely not stored a undefined object
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // throw new Error(err); //instead using this, use bellow, next(...)
      next(new Error(err)); //to avoid infinite loop, and throw new error in asyn and sync code, but inside promise then and block, or inside callback
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

// app.use((req, res, next) => {
//   res.status(404).render('error/404', { pageTitle: 'Page not found!' });
// });
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500'); //instead using this, use bellow to render /500
  res.status(500).render('error/500', {
    pageTitle: 'Page Not Found',
    path: '/500',
    isAuthenticated: true,
  });
});

// mongoConnect((client) => {
//   // console.log(client);
//   app.listen(3000);
// });

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'max',
    //       email: 'max@test.com',
    //       cart: { items: [] },
    //     });
    //     user.save();
    //   }
    // });
    // console.log('connect');
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
