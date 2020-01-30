const puppeteer = require("puppeteer");
const WebSocket = require("ws");
const uuid = require("uuid/v1");

async function getSessionId() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.dunder.com/`);

  return new Promise(resolve => {
    let intervalMs = 2000;
    const interval = setInterval(async () => {
      const cookies = await page.cookies();
      const sidCookie = cookies.find(c => c.name === "rn_sid-dunder");
      if (!sidCookie) {
        console.log("Waiting for cookie...");
        return;
      }

      console.log("Sid found!");
      await browser.close();
      clearInterval(interval);
      resolve(sidCookie.value);
    }, intervalMs);
  });
}

async function getLoginPayload(payloadId, user) {
  const sid = await getSessionId();
  const dunderToken = "59ad361053746c7c87715b8c";
  return {
    id: payloadId,
    sid: sid,
    path: "/igc/dunder/users/loginV2",
    params: {
      usernameOrEmail: user.email,
      password: user.password
    },
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
      language: "en-US",
      platform: "Win32",
      product: "Gecko",
      productSub: "20030107",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
      vendor: "Google Inc.",
      vendorSub: ""
    }
  };
}

async function login(user) {
  return new Promise(resolve => {
    const ws = new WebSocket("wss://api.dunder.com/");

    console.log("Connecting to socket...");
    const payloadId = uuid().replace("-", "");

    ws.on("open", async () => {
      console.log("Connected");
      console.log("Creating login payload...");
      const loginPayload = await getLoginPayload(payloadId, user);
      ws.send(JSON.stringify(loginPayload));
      console.log("Loginpayload sent!");
    });

    ws.on("message", async data => {
      const responsePayload = JSON.parse(data.toString("utf8"));
      if (responsePayload.id !== payloadId) {
        return;
      }

      if (!responsePayload.res.sessionId) {
        console.log("Error occured!", responsePayload);
        resolve(null);
        return;
      }

      resolve(`rn_sid-dunder=${responsePayload.res.sessionId};`);
    });
  });
}

module.exports = {
  login
};
