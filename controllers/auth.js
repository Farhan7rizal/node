exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('cookie').split('=')[1] === 'true';
  console.log(isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  res.setHeader('Set-Cookie', 'LoggedIn=true');
  res.redirect('/');
};
