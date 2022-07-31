const express = require("express");
const router = express.Router();
const fs = require("fs");
const { resolve } = require("path");
const { createCanvas } = require("canvas");

router.post("/", (req, res) => {
  const data = req.body;

  const getMaxNextLine = (input, maxChars = 30) => {
    const allWords = input.split(" ");

    const lineIndex = allWords.reduce((prev, cur, index) => {
      if (prev?.done) return prev;
      const endLastWord = prev?.position || 0;
      const position = endLastWord + 1 + cur.length;
      return position >= maxChars ? { done: true, index } : { position, index };
    });
    const line = allWords.slice(0, lineIndex.index).join(" ");
    const remainingChars = allWords.slice(lineIndex.index).join(" ");
    return { line, remainingChars };
  };

  const formatTitle = (title) => {
    let output = [];

    if (title.length >= 40) {
      const firstLine = getMaxNextLine(title);
      const secondLine = getMaxNextLine(firstLine.remainingChars);
      output = [firstLine.line];
      output.push(secondLine.line);
      // let fmSecondLine = secondLine.line;
      if (secondLine.remainingChars.length > 0) {
        const lastLine = getMaxNextLine(secondLine.remainingChars);
        output.push(lastLine.line);
      }
    } else if (title.length >= 20) {
      const firstLine = getMaxNextLine(title, title.length / 2);
      output = [firstLine.line, firstLine.remainingChars];
    } else {
      output = [title];
    }

    return output;
  };

  const mainCanvas = createCanvas(800, 800);
  const mainCtx = mainCanvas.getContext("2d");

  let yCord = 100;

  mainCtx.fillStyle = "#fff";
  mainCtx.fillRect(0, 0, 800, 800);

  mainCtx.fillStyle = "#000";
  mainCtx.font = "bold 24px Arial";
  mainCtx.textAlign = "center";
  mainCtx.fillText(data.shopName, 400, 40);

  mainCtx.fillStyle = "#000";
  mainCtx.font = "18px Arial 400";
  mainCtx.textAlign = "center";
  mainCtx.fillText("Order Summary", 400, 80);

  mainCtx.fillStyle = "#000";
  mainCtx.fillRect(10, yCord, 780, 1);

  mainCtx.fillStyle = "#000";
  mainCtx.font = "bold 18px Arial";
  mainCtx.textAlign = "left";
  mainCtx.fillText("Name", 30, yCord + 30);
  mainCtx.fillText("Quantity", 230, yCord + 30);
  mainCtx.fillText("Rate", 430, yCord + 30);
  mainCtx.fillText("Price", 630, yCord + 30);
  yCord = yCord + 50;
  mainCtx.fillRect(10, yCord, 780, 1);
  yCord = yCord + 30;

  for (let i = 0; i < data.items.length; i++) {
    mainCtx.fillStyle = "#000";
    mainCtx.font = "18px Arial";
    mainCtx.fillText(data.items[i].name, 30, yCord);
    mainCtx.fillText(data.items[i].quantity, 230, yCord);
    mainCtx.fillText(data.items[i].rate, 430, yCord);
    mainCtx.fillText(
      parseInt(data.items[i].rate) * parseInt(data.items[i].quantity),
      630,
      yCord
    );

    yCord = yCord + 30;
  }

  mainCtx.fillRect(10, yCord, 780, 1);
  yCord = yCord + 30;

  mainCtx.font = "bold 20px Arial";
  mainCtx.fillText("Shipping Info :", 30, yCord);
  yCord = yCord + 30;

  mainCtx.font = "18px Arial";
  mainCtx.fillText(data.shipInfo.name, 30, yCord);
  yCord = yCord + 30;

  const address = formatTitle(data.shipInfo.address);
  mainCtx.fillText(address[0], 30, yCord);
  yCord = yCord + 30;
  if (address[1]) mainCtx.fillText(address[1], 30, yCord);
  yCord = yCord + 30;
  if (address[2]) mainCtx.fillText(address[2], 30, yCord);

  yCord = yCord + 30;
  mainCtx.font = "bold 20px Arial";
  mainCtx.fillText("Contact Info. :", 30, yCord);
  yCord = yCord + 30;
  mainCtx.font = "18px Arial";
  mainCtx.fillText(data.shipInfo.contactNumber, 30, yCord);

  yCord = yCord - 180;
  mainCtx.fillText("Sub Total", 400, yCord);
  mainCtx.fillText(data.subTotal, 600, yCord);
  yCord = yCord + 30;

  mainCtx.fillText("Tax (Inclusive)", 400, yCord);
  mainCtx.fillText(data.taxInfo, 600, yCord);
  yCord = yCord + 30;

  mainCtx.fillText("Discount", 400, yCord);
  mainCtx.fillText(data.discount, 600, yCord);
  yCord = yCord + 30;

  mainCtx.fillText("Shipping", 400, yCord);
  mainCtx.fillText(
    data.freeShip === "free" ? "Free" : data.freeShip,
    600,
    yCord
  );
  yCord = yCord + 30;

  mainCtx.font = "bold 18px Arial";
  mainCtx.fillText("Total", 400, yCord);
  mainCtx.fillText(data.total, 600, yCord);
  yCord = yCord + 30;

  const buffer = mainCanvas.toBuffer("image/png");
  fs.writeFileSync("./image.png", buffer);

  // res.writeHead(200, { "Content-type": "image/png" });
  res.status(200).sendFile(resolve("image.png"));
});

module.exports = router;
