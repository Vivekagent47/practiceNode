const express = require("express");
// const axios = require("axios").default;
const router = express.Router();
const puppeteer = require("puppeteer");
const resolve = require("path").resolve;

router.get("/", (req, res) => {
  puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage();
    await page.goto("https://splendid-manatee-f31068.netlify.app/");
    await page.setViewport({
      width: 800,
      height: 800,
    });
    await page.screenshot({ path: "nyt-puppeteer.png" });
    await browser.close();

    // res.status(200).json({ ...data });
  });
  res.sendFile(resolve("./nyt-puppeteer.png"));
  // res.status(400).json({ error: "error in generating image" });
});

module.exports = router;
