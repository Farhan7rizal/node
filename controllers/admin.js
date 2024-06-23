const Product = require('../models/product');
const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');
const product = require('../models/product');
const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,

    validationErrors: [],
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  // console.log(image);
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: 'attached file is not an image!',
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0]);
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: title,

        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;
  const product = new Product({
    // _id: new mongoose.Types.ObjectId('663b6c5f82469b9657304c77'),
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      // the save() METHOD is coming from mongoose
      // console.log(result);
      res.redirect('/admin/products');
    })
    .catch((err) => {
      // console.log('an error occured!');
      // console.log(err);
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/edit-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     image: image,
      //     price: price,
      //     description: description,
      //   },
      //   errorMessage: 'Database operation failed, please try again!',
      //   validationErrors: [],
      //
      // });
      // res.redirect('/500');

      const error = new Error(err);
      error.statusCode = 500;
      return next(error); // handling error with next(error)
    }); //don't forget to return in save() models
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const errors = validationResult(req);
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      // throw new Error('dummy!');
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        validationErrors: [],
        hasError: false,
        errorMessage: null,
      });
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.statusCode = 500;
      return next(error); // handling error with next(error)
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title imageUrl -_id')
    // .populate('userId', 'name')
    .then((products) => {
      // console.log(products);
      //select() allows you to define which fields you want to select or unselect
      // populate() allows you to tell mongoose to populate a certain field with all the detail information and not just the ID,
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findByIdAndDelete(prodId)
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('DESTROYED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};
