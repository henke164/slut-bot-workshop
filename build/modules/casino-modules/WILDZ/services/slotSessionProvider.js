const fetch = require("node-fetch");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function getSlotSession(slotId, casinoCookies) {
  console.log(casinoCookies);
  const response = await fetch(`https://www.wildz.com/api/games/token`, {
    method: "POST",
    headers: {
      accept: "*/*",
      ...jsonHeader,
      cookie: casinoCookies,
      origin: "https://www.wildz.com",
      ...userAgentHeader,
      "x-requested-with": "XMLHttpRequest",
      "x-tenant": "wildz"
    },
    body: JSON.stringify("netent")
  });

  const json = await response.json();
  if (!json.data) {
    throw Error("Session could not be found");
  }

  return json.data;
}

module.exports = {
  getSlotSession
};
