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
  req.session.isLoggedIn = true;
  res.redirect('/');
};
