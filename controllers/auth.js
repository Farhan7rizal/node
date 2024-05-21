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
      // res.redirect('/');
      req.session.save((err) => {
        //normally don't need to do that but you need to do it in scenarios where you need to be sure that,your session was created before you continue because here, you can pass in a function that will be called once you're done saving the session.
        console.log(err);
        res.redirect('/');
        // and you can be sure that your session has been created here.
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
