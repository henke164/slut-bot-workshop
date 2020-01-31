const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { jsonToQueryNoQuestionMark } = require("../../../utilities/jsonToQuery");
const {
  userAgentHeader,
  formNoUTFHeader
} = require("../../../utilities/headers");

async function getSessionAndToken() {
  const response = await fetch("https://omnislots.com/", {
    method: "GET",
    headers: {
      ...userAgentHeader
    }
  });

  const headers = response.headers.get("set-cookie");
  const html = await response.text();

  const foundSession = /_omnislots_session=(?:[^;\\]|\\.)*/
    .exec(headers)[0]
    .replace("_omnislots_session=", "");

  const foundToken = /name="authenticity_token" type="hidden" value="(?:[^"\\]|\\.)*/
    .exec(html)[0]
    .replace('name="authenticity_token" type="hidden" value="', "");

  return {
    session: foundSession,
    token: foundToken
  };
}

async function step1(user, session, token) {
  const body = {
    utf8: "%E2%9C%93",
    _method: "put",
    authenticity_token: token
      .replace("/", "%2F")
      .replace("+", "%2B")
      .replace("=", "%3D"),
    "registration%5Buser_name%5D": user.username,
    "registration%5Bpassword%5D": user.password,
    "registration%5Bpassword_confirmation%5D": user.password,
    "registration%5Bemail%5D": user.email,
    "registration%5Bcurrency_iso%5D": user.currency,
    "registration%5Blanguage_iso%5D": "en"
  };

  const formBody = jsonToQueryNoQuestionMark(body, false);
  const cookie = `_omnislots_session=${session};`;

  const response = await fetch("https://omnislots.com/registrations/account", {
    method: "POST",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      ...userAgentHeader,
      ...formNoUTFHeader,
      origin: "https://omnislots.com",
      cookie
    },
    body: formBody
  });

  console.log(response.status);
}

async function register(user) {
  const { session, token } = await getSessionAndToken();

  const result = await step1(user, session, token);
  return;

  console.log("Registering user", body);
}

module.exports = {
  register
};
