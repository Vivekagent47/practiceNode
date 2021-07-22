const express = require('express');
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

// Multer function for filter and storage the image
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//Routes
const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', [checkAuth, upload.single('productImg')], (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImg: req.file.path
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Created Product successfully',
        cretedProduct: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:productID', (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .exec()
    .then(data => {
      if(data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided ID'
        });
      };
    })
    .catch(err => {
      res.status(500).json({error: err})
    });
});

router.put('/:productID', (req, res, next) => {
  
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.productID;
  Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({error: err});
    })
});

router.delete('/:productID', (req, res, next) => {
  const id = req.params.productID;
  Product.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product Deleted",
        result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

