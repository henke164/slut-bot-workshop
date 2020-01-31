const fetch = require("node-fetch");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function getSlotSession(slotId, casinoCookies) {
  const response = await fetch(
    `https://games-cashmio.igamingcloud.com/es/${slotId}`,
    {
      method: "GET",
      headers: {
        ...userAgentHeader,
        ...jsonHeader,
        referer: "https://www.cashmio.com/en/casino/game",
        cookie: casinoCookies
      }
    }
  );

  const html = await response.text();
  const foundSession = /"sessionId": "(?:[^"\\]|\\.)*/
    .exec(html)[0]
    .replace('"sessionId": "', "");

  return foundSession;
}

module.exports = {
  getSlotSession
};
