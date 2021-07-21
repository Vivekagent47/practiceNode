const express = require('express');
const productRoute = require('./api/route/product');
const orderRoute = require('./api/route/order');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose 
  .connect('mongodb+srv://vivek:' + process.env.MONGO_ATLAS_PW +'@practice.gjl0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

app.use(morgan('dev'));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept, Authorization");

  if(req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  };
  next();
});

// All Routes
app.use('/product', productRoute);
app.use('/order', orderRoute);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;