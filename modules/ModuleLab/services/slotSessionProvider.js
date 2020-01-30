const fetch = require("node-fetch");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");
const WebSocket = require("ws");
const uuid = require("uuid/v1");

async function getLaunchUrl(sid, slotId, realMoney) {
  const dunderToken = "59ad361053746c7c87715b8c";
  const payloadId = uuid().replace("-", "");

  const payload = {
    id: payloadId,
    sid,
    path: "/igc/dunder/games/get",
    params: { lang: "en", slug: slotId, tableId: null, realMoney },
    options: {
      isDevice: false,
      baseUrl: "wss://api.dunder.com",
      token: dunderToken,
      db: "dunder",
      provider: "igc",
      proxies: ["maintenance"]
    },
    token: dunderToken,
    navigator: {
      appCodeName: "Mozilla",
      appName: "Netscape",
      appVersion:
        "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
      language: "sv-SE",
      platform: "Win32",
      product: "Gecko",
      productSub: "20030107",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
      vendor: "Google Inc.",
      vendorSub: ""
    }
  };

  return new Promise(resolve => {
    const ws = new WebSocket("wss://api.dunder.com/");
    console.log("Connecting to socket...");

    ws.on("open", async () => {
      console.log("Connected");
      ws.send(JSON.stringify(payload));
      console.log("Session request sent!");
    });

    ws.on("message", async data => {
      const responsePayload = JSON.parse(data.toString("utf8"));
      if (responsePayload.id !== payloadId) {
        return;
      }

      if (!responsePayload.res.launchUrl) {
        console.log(responsePayload);
        throw Error("Game not found!");
      }

      resolve(responsePayload.res.launchUrl);
    });
  });
}

async function getSlotSession(slotId, casinoCookies) {
  const sid = (casinoCookies || "")
    .replace("rn_sid-dunder=", "")
    .replace(";", "");

  console.log(sid);
  const launchUrl = await getLaunchUrl(sid, slotId, sid !== "");

  //@ts-ignore
  const response = await fetch(launchUrl, {
    method: "GET",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      referer: "https://www.dunder.com/en/game/",
      cookie: casinoCookies
    }
  });

  const html = await response.text();
  const foundSession = /sessionId: "(?:[^"\\]|\\.)*/
    .exec(html)[0]
    .replace('sessionId: "', "");

  return foundSession;
}

module.exports = {
  getSlotSession
};
