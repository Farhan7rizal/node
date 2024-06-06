const express = require('express');
const { check, body, validationResult } = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get(
  '/login',

  authController.getLogin
);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  check('email').isEmail().withMessage('email salah'),
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('email salah')
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('this email address is forbidden!');
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          // console.log(userDoc);
          if (userDoc) {
            return Promise.reject('Email sudah ada!');
          }
        });
      }),
    body(
      'password',
      'this is default messages for every withMessage(), and your password at least 5 charecter'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password have to match!');
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
