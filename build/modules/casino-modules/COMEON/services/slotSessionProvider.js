const fetch = require("node-fetch");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function getSlotSession(slotId, casinoCookies) {
  const response = await fetch(`https://www.comeon.com/load/${slotId}/REAL/800/600`, {
    method: "GET",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      referer: `https://www.comeon.com/sv/casino/game/${slotId}/real`,
      cookie: casinoCookies
    }
  });

  const json = await response.json();
  const jsonResponse = JSON.parse(json.result.gameLoaderResponse.data.JSON);
  return jsonResponse.parameters.sessionId;
}

module.exports = {
  getSlotSession
};
