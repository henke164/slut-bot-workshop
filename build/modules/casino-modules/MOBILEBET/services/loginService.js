// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function login(user) {
  const body = {
    email: user.username,
    password: user.password,
    captchaToken: "",
    isComplianceTermsAccepted: false,
    // deviceId: 1468621770,
  };

  const response = await fetch("https://www.mobilebet.com/auth/login", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      origin: "https://www.mobilebet.com"
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
