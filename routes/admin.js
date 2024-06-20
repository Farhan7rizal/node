const path = require('path');

const express = require('express');
const { check, body, validationResult } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title').isString().withMessage('1').isLength({ min: 3 }).trim(),
    body('price').isFloat().withMessage('2'),
    body('description').isLength({ min: 5, max: 400 }).trim().withMessage('3'),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title').isString().withMessage('1').isLength({ min: 3 }).trim(),
    body('price').isFloat().withMessage('2'),
    body('description').isLength({ min: 5, max: 400 }).trim().withMessage('3'),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// module.exports = router;
exports.routes = router;
// exports.products = products;
