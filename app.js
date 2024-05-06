const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); //views in views folder

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use((req, res, next) => {
  User.findById('6632fa847d5b14c67f8214a2')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

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
  .connect('mongodb://localhost:27017')
  .then((result) => {
    console.log('connect');
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
