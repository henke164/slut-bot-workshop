const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { userAgentHeader, formHeader } = require("../utilities/headers");

async function getSessionCookie(casinoUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`${casinoUrl}/en`);

  return new Promise(resolve => {
    let intervalMs = 2000;
    const interval = setInterval(async () => {
      const cookies = await page.cookies();
      if (cookies.map(c => c.name).indexOf("PHPSESSID") === -1) {
        console.log("Waiting for cookie...");
        return;
      }

      await browser.close();

      clearInterval(interval);

      resolve(
        cookies
          .map(c => {
            return `${c.name}=${c.value}`;
          })
          .join(";")
      );
    }, intervalMs);
  });
}

function pause(ms) {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}
async function incapsulaLogin(casinoUrl, username, password) {
  const sessionCookie = await getSessionCookie(casinoUrl);
  console.log("Got session cookie... logging in");
  await pause(8000);
  // @ts-ignore
  const response = await fetch(`${casinoUrl}/en/player/login`, {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...formHeader,
      referer: `${casinoUrl}/en`,
      origin: casinoUrl,
      cookie: sessionCookie
    },
    body: `username=${username}&password=${password}`
  });

  console.log(sessionCookie);

  if (response.status === 200) {
    console.log("Successfully logged in!");
    console.log("Pausing for 10 sec...");
    await pause(10000);
    return sessionCookie;
  }

  console.log(await response.text());
  console.log("Could not login!");
  return null;
}

module.exports = {
  getSessionCookie,
  incapsulaLogin
};
