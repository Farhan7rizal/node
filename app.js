const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); //views in views folder

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
//it syncs your models to the database by creating the appropriate tables
