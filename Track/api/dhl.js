const express = require("express");
const axios = require("axios").default;
const router = express.Router();
// const { response } = require("../app");

router.get("/:awb", (req, res) => {
  const trackingId = req.params.awb;

  axios
    .get(
      `https://api-eu.dhl.com/track/shipments?trackingNumber=${trackingId}`,
      {
        headers: {
          "DHL-API-Key": "beT2XKtFly2AsAMyc1OehKNFJP8MfjwB",
        },
      }
    )
    .then(({ data }) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
});

module.exports = router;
