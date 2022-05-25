const express = require("express");
const axios = require("axios").default;
const router = express.Router();
//reduce((acc, current) => [...acc, { location: current.scannedLocation, detail: current.instructions, date: `${current.scanDateTime}` }],[]);
router.get("/:awb", (req, res) => {
  let trackingId = req.params.awb;
  return axios
    .post(`https://api.ithinklogistics.com/api_v3/order/track.json`, {
      data: {
        awb_number_list: trackingId,
        access_token: "e302a4b2cf18f7a835f0ae13416fbf80",
        secret_key: "d640cee747d2fef66b0e7d508c77b6ac",
      },
    })
    .then((response) => {
      res.send({
        status:
          `${response.data.data[trackingId].current_status}`.toLowerCase(),
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
});

module.exports = router;
