const fetch = require("node-fetch");
const {
  userAgentHeader,
  formNoUTFHeader
} = require("../../../utilities/headers");
const { jsonToQueryNoQuestionMark } = require("../../../utilities/jsonToQuery");

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

async function getIp() {
  const result = await fetch("https://api.ipify.org?format=json");
  const resp = await result.json();
  return resp.ip;
}

async function login(user) {
  const { session, token } = await getSessionAndToken();

  const body = {
    utf8: "%E2%9C%93",
    authenticity_token: token
      .replace("/", "%2F")
      .replace("+", "%2B")
      .replace("=", "%3D"),
    "session%5Busername%5D": user.email,
    "session%5Bpassword%5D": user.password,
    "%5Bip%5D": await getIp()
  };

  const formBody = jsonToQueryNoQuestionMark(body, false);
  console.log(formBody);
  const cookie = `_omnislots_session=${session};`;

  const response = await fetch("https://omnislots.com/sessions?locale=en-CH", {
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

  console.log("--cookie--");
  console.log(cookie);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cookie);
    }, 5000);
  });
}

module.exports = {
  login
};
