"use strict";
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const validators = require("./validators");
const app = express();

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({
    error: err.message,
  });
};

// app
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  if (req.xhr) {
    next();
  } else {
    res.status(400).end("400 Bad Request");
  }
});

app.post("/", async (req, res, next) => {
  const {
    body: { number, g_response },
  } = req;
  try {
    // validate captcha
    // const recaptcha = await validators.validateRecaptcha(g_response);
    // if (!recaptcha.success) {
    //   throw new Error(
    //     `Captcha failed - ${recaptcha["error-codes"].join(", ")}`
    //   );
    // }

    // validate number
    await validators.validateNumber(number);

    // send number to clicksend
    const numberFound = await validators.validateClickSend(number);
    if (!numberFound) {
      throw new Error("Number not found");
    }
  } catch (error) {
    return next(error);
  }
  res
    .status(200)
    .json({ data: { videoUrl: process.env.VIDEO_LINK } })
    .end();
});

// The other middleware
app.use(bodyParser.json());
// Your handler
app.use(jsonErrorHandler);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
