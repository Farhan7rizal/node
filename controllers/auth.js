const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('cookie').split('=')[1] === 'true';
  // console.log(isLoggedIn);
  console.log(req.session);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'LoggedIn=true');
  User.findById('663a2c6b2f23384c17625308')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};
