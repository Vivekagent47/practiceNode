const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let bluedart = require("./api/bluedart.js");
let dhl = require("./api/dhl.js");
let delhivery = require("./api/delhivery.js");
let ithink = require("./api/ithink.js");
// let xpressbees = require("./api/xpressbees.js");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/bluedart", bluedart);
app.use("/dhl", dhl);
app.use("/delhivery", delhivery);
app.use("/ithink", ithink);
// app.use("/xpressbees", xpressbees);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
