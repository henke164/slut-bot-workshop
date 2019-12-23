const setCookie = require("set-cookie-parser");

function getCookieStringFromResponse(response) {
  var combinedCookieHeader = response.headers.get("Set-Cookie");
  var splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader);
  var cookies = setCookie.parse(splitCookieHeaders);

  return cookies
    .map(c => {
      return `${c.name}=${encodeURIComponent(c.value)}`;
    })
    .join("; ");
}

module.exports = {
  getCookieStringFromResponse
};
