const fetch = require("node-fetch");
const { userAgentHeader } = require("../../../utilities/headers");

async function getSlotSession(slotId, casinoCookies) {
  const url = `https://omnislots.com/games/${slotId}${casinoCookies !== "" ? "?mode=real" : ""}`;
  console.log(url);
  // @ts-ignore
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...userAgentHeader,
      cookie: casinoCookies
    }
  });

  const html = await response.text();
  const foundSession = /"sessionId":"(?:[^"\\]|\\.)*/
    .exec(html)[0]
    .replace('"sessionId":"', "");
  return foundSession;
}

module.exports = {
  getSlotSession
};
