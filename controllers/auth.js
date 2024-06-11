const crypto = require('crypto');
const { check, validationResult } = require('express-validator');

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { error } = require('console');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('cookie').split('=')[1] === 'true';
  // console.log(isLoggedIn);
  // console.log(req.session);
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let message2 = req.flash('error2');
  if (message2.length > 0) {
    message2 = message2[0];
  } else {
    message2 = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  //also do flash message here to
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // req.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'LoggedIn=true');

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors.array()[0].msg);

    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'login',
      isAuthenticated: false,

      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'login',
          isAuthenticated: false,

          errorMessage: 'invalid email or password',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: errors.array(),
        });
      }

      return bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          //with compare we'll only face an error if something goes wrong, not if the passwords do not match. In both a matching and a non-matching case,we make it into the then block and result will be a boolean that is true if the passwords are equal
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // res.redirect('/');

            return req.session.save((err) => {
              //normally don't need to do that but you need to do it in scenarios where you need to be sure that,your session was created before you continue because here, you can pass in a function that will be called once you're done saving the session.
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'login',
            isAuthenticated: false,

            errorMessage: 'invalid email or password',
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: errors.array(),
          });
        })
        .catch((err) => {
          res.redirect('/login');
        });
      // and you can be sure that your session has been created here.
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  // if (typeof errors !== 'undefined'){}
  if (!errors.isEmpty()) {
    console.log(errors.array()[0]);
    // res.status(200).json(errors.array()[0].msg);
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,

      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  // sendgrid code : WSQSKVSPH8RXBVWJDFKV5KZY
  // skip emailing

  // User.findOne({ email: email })
  //   .then((userDoc) => {
  //     // console.log(userDoc);
  //     if (userDoc) {
  //       req.flash('error', 'E-mail sudah ada!');
  //       return res.redirect('/signup');
  //     }
  return (
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      })
      .then((result) => {
        res.redirect('/login');
      })
      // })

      .catch((err) => {
        console.log(err);
      })
  );
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No such email found!');
          return res.redirect('/reset');
        }
        (user.resetToken = token),
          (user.resetTokenExpiration = Date.now() + 3600000);
        return user.save();
      })
      .then((result) => {
        // console.log(result, token);
        res.render('auth/resetPage', {
          path: '/resetPage',
          pageTitle: 'Reset Page',
          isAuthenticated: false,
          token: token,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      //$gt = greater then
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        isAuthenticated: false,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
};
