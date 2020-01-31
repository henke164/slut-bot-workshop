const puppeteer = require("puppeteer");
const { userAgentHeader } = require("../../../utilities/headers");

/**
 * Start a new puppeteer instance to retrive the required cookies.
 *
 * @return Object
 */
async function getCashmioCookies() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(userAgentHeader['User-Agent']);
  await page.goto('https://www.cashmio.com/en');

  const cookies = await page.cookies()
  const csrf_token = cookies.find(row => row.name === 'csrf_cashmio')['value'];
  const __cfduid = cookies.find(row => row.name === '__cfduid')['value'];
  const ci_session = cookies.find(row => row.name === 'ci_session')['value'];
  const btag = cookies.find(row => row.name === 'btag')['value'];

  await browser.close();

  return {csrf_token, __cfduid, ci_session, btag};
}

/**
 * Re-usable base headers for login/register request.
 *
 * @return Object
 */
const cashmioBaseHeaders = {
  "user-agent": userAgentHeader['User-Agent'],
  "accept": "*/*",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  "origin": "https://www.cashmio.com",
  "referer": "https://www.cashmio.com/en",
  "x-requested-with": "XMLHttpRequest"
};

module.exports = {
  getCashmioCookies, cashmioBaseHeaders
};
