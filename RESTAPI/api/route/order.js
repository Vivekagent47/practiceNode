const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET /order route'
  });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: 'Handling POST /order route',
    order: order
  });
});

router.get('/:orderID', (req, res, next) => {
  res.status(200).json({
    message: 'Oder Details',
    id: req.params.orderID
  });
});

router.delete('/:orderID', (req, res, next) => {
  res.status(200).json({
    message: 'Oder Deleted Successfully',
    id: req.params.orderID
  });
});

module.exports = router;

