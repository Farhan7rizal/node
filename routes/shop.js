const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//dynamic route is order after static routes ???
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postcartDeleteProduct);

router.post('/create-order', shopController.postOrders);

router.get('/orders', shopController.getOrders);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;
