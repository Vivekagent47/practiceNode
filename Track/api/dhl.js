const express = require("express");
const axios = require("axios").default;
const router = express.Router();
// const { response } = require("../app");

router.get("/:awb", (req, res) => {
  const trackingId = req.params.awb;

  axios
    .get(`https://www.dhl.co.in/shipmentTracking?AWB=${trackingId}`)
    .then(({ data }) => {
      if (data.errors) {
        res.send({ result: `Invalid Tracking No. ${trackingId}` });
      }
      console.warn(data.results[0].checkpoints);
      let final = data.results[0].checkpoints.reduce(
        (acc, current) => [
          ...acc,
          {
            location: current.location,
            detail: current.description,
            date: `${current.date}`,
          },
        ],
        []
      );
      res.send({ result: final });
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
});

module.exports = router;
