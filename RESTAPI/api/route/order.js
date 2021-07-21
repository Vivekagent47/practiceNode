const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  Order.find()
    .populate('product')
    .exec()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.productID)
    .then( pro => {
      if (!pro) {
        res.status(404).json({
          message: "Product Not Found"
        })
      } else {
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productID
        });
      
        order
          .save()
          .then(result => {
            res.status(201).json({
              message: 'Order Ceated Successfully',
              result
            })
          }).catch(err => {
            res.status(500).json({
              error: err
            })
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Product Not found",
        error: err
      });
    });
});

router.get('/:orderID', (req, res, next) => {
  Order.findById(req.params.orderID)
    .populate('product')
    .exec()
    .then(data => {
      if(data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: "Order not found"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});

router.delete('/:orderID', (req, res, next) => {
  const id = req.params.orderID;
  Order.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order Deleted",
        result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

// router.put('/:orderID', (req, res, next) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!"
//     });
//   }

//   const id = req.params.orderID;
//   Order.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//     .then(result => {
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       res.status(500).json({error: err});
//     })
// });

module.exports = router;

