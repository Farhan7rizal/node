const express = require('express');
const { check, body, validationResult } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('email salah')
      .custom((value, { req }) => {
        if (value === 'test@test.com') {
          throw new Error('this email address is forbidden!');
        }
        return true;
      }),
    body(
      'password',
      'this is default messages for every withMessage(), and your password at least 5 charecter'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
