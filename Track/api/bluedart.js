const express = require("express");
const axios = require("axios").default;
const router = express.Router();

router.get("/:number", (req, response) => {
  const number = req.params.number;
  axios
    .get(
      `http://api.bluedart.com/servlet/RoutingServlet?handler=tnt&action=custawbquery&loginid=GGN86293&awb=awb&numbers=${number}&format=json&lickey=nh5nj5ungfjsnuntgujiilssgn6pionk&verno=1.3&scan=1`
    )
    .then((res) => {
      // response.send(res.data.ShipmentData.Shipment[0].Status);
      if (res.data.ShipmentData.Shipment[0].Status === "SHIPMENT DELIVERED") {
        response.send({
          status: "delivered",
        });
      } else {
        response.send({
          status: `${res.data.ShipmentData.Shipment[0].Status}`.toLowerCase(),
        });
      }
    })
    .catch((err) => {
      console.log(err);
      response.send(err);
    });
});

module.exports = router;
