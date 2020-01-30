// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");
const { randomInt } = require("../../../utilities/helpers");

async function login(user) {
  const body = {
    email: user.username,
    password: user.password,
    captchaToken: "",
    isComplianceTermsAccepted: false,
    deviceId: randomInt(10),
  };

  const response = await fetch("https://www.comeon.com/auth/login", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      origin: "https://www.comeon.com"
    },
    body: JSON.stringify(body)
  });

  var responseJson = await response.json();
  if (response.status !== 200 || responseJson['status'] !== 'SUCCESS') {
    console.log(responseJson);
    throw Error("Login failed!");
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  login
};
