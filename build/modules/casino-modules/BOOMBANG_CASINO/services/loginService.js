// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const queryString = require('query-string');
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, formHeader } = require("../../../utilities/headers");

async function login(user) {
  const body = {
    username: user.username,
    password: user.password,
    clientType: "DESKTOP"
  };

  const response = await fetch("https://www.boombangcasino.com/games/login", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...formHeader,
      origin: "https://www.boombangcasino.com/"
    },
    body: queryString.stringify(body)
  });

  if (response.status !== 200) {
    throw Error("Login failed!");
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  login
};
