// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");
const { decodeCaptcha } = require("../../../services/captchaService");

const captchaSettings = {
  apiKey: "08a69d4ec6c3bdd5032c6b32ca8fca2c",
  url: "https://www.casumo.com/en/log-in/",
  googleKey: "6LeswJMUAAAAADIoxCwxvvyJ-QCORFD-W0JMJYpW"
};

async function login(username, password) {
  console.log("Solving captcha...");
  const captcha = await decodeCaptcha(captchaSettings);

  const body = {
    "user": username,
    "password": password,
    "g-recaptcha-response": captcha
  };

  const response = await fetch("https://www.casumo.com/api/captcha-login", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      origin: "https://casumo.com"
    },
    body: JSON.stringify(body)
  });

  if (response.status !== 200) {
    throw Error("Login failed!");
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  login
};
