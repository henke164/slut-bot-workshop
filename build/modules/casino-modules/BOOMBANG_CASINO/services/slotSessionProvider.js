// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function getSlotSession(slotId, casinoCookies) {
  const response = await fetch(`https://website-slot-page/${slotId}`, {
    method: "GET",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      referer: "https://website-slot-page/",
      cookie: casinoCookies
    }
  });

  const html = await response.text();
  // Find sessionid in html?
  const foundSession = /"sessionId":"(?:[^"\\]|\\.)*/
    .exec(html)[0]
    .replace('"sessionId":"', "");

  return foundSession;
}

module.exports = {
  getSlotSession
};
