"use strict";
require("dotenv").config();
const axios = require("axios");
// constants
const numberRegex = new RegExp(/^\d+$/);

// helpers
const validateRecaptcha = (response) =>
  axios({
    method: "POST",
    url: "https://www.google.com/recaptcha/api/siteverify",
    params: {
      secret: process.env.CAPTCHA_SECRET,
      response,
    },
  }).then(({ data }) => data);

const validateNumber = async (number) => {
  // all numbers
  if (!numberRegex.test(number)) {
    throw new Error("Invalid number");
  }

  // 9 length
  if (number.length !== 9) {
    throw new Error("Invalid number length");
  }

  // starts with 4
  if (number[0] !== "4") {
    throw new Error("Invalid number format");
  }
};

const validateClickSend = (number) =>
  axios
    .get(
      `https://rest.clicksend.com/v3/lists/${process.env.CLICKSEND_LIST_ID}/contacts`,
      {
        params: {
          q: `%2B61${number}`,
        },
        auth: {
          username: process.env.CLICKSEND_USERNAME,
          password: process.env.CLICKSEND_PASSWORD,
        },
      }
    )
    .then(
      ({
        data: {
          data: { data },
        },
      }) => {
        const foundContact = data.find(
          (contact) => contact.phone_number.indexOf(number) === 3
        );
        return !!foundContact;
      }
    );

module.exports = {
  validateRecaptcha,
  validateNumber,
  validateClickSend,
};
