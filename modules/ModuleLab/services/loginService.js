const fetch = require("node-fetch");
const { userAgentHeader, formHeader } = require("../../../utilities/headers");

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

async function login(user) {
  const { session, token } = await getSessionAndToken();

  const username = encodeURIComponent(user.email);

  const authenticity_token = token
    .replace(/\//g, "%2F")
    .replace(/\+/g, "%2B")
    .replace(/\=/g, "%3D");

  const formBody = `utf8=%E2%9C%93&authenticity_token=${authenticity_token}&session%5Busername%5D=${username}&session%5Bpassword%5D=${user.password}&commit=Login`;

  console.log(formBody);

  const cookie = `_omnislots_session=${session};`;

  const response = await fetch("https://omnislots.com/sessions?locale=en-US", {
    method: "POST",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      ...userAgentHeader,
      ...formHeader,
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
