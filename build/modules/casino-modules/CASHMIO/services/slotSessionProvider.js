// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function getSlotSession(slotId, casinoCookies) {
  const response = await fetch(`https://www.cashmio.com/account/get_sessionId`, {
    method: "GET",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      "referer": "https://www.cashmio.com/en/casino/game/${slotId}",
      "cookie": casinoCookies
    }
  });

  const sid = await response.json();

  return sid.sid;
}

module.exports = {
  getSlotSession
};
