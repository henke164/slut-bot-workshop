const fetch = require("node-fetch");
const queryString = require("query-string");
const puppeteer = require("puppeteer");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");

const { getCashmioCookies, cashmioBaseHeaders } = require("./helpers");

async function login(user) {
  const cashmioCookies = await getCashmioCookies();

  const body = {
    action: "login",
    token: cashmioCookies["csrf_token"],
    username: user.username,
    password: user.password
  };

  const response = await fetch("https://www.cashmio.com/secure/login", {
    method: "POST",
    headers: {
      ...cashmioBaseHeaders,
      Cookie: `_cfduid=${cashmioCookies["__cfduid"]}; btag=${cashmioCookies["btag"]}; user_lang=en; cookiesAccepted=1; ci_session=${cashmioCookies["ci_session"]}; csrf_cashmio=${cashmioCookies["csrf_token"]}; cc=fi`
    },
    body: queryString.stringify(body)
  });

  const responseJson = await response.json();

  if (response.status !== 200 || responseJson.response === "error") {
    console.log(responseJson);
    throw Error("Login failed!");
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  login
};
