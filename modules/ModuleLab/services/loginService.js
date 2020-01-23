// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function login(user) {
  const body = {
    username: user.username,
    password: user.password
  };

  const response = await fetch("casino-login-url", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      origin: "casino-url"
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
