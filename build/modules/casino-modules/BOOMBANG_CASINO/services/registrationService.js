// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const queryString = require('query-string');
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, formHeader } = require("../../../utilities/headers");

async function register(user) {
  const body = {
    "op": "submitregistrationform",
    "request[acceptedTcVersion]": "16",
    "request[softwareSerial]": "",
    "request[sessionId]": "",
    "request[playModeCode]": "REAL",
    "request[cage]": "BOO",
    "request[languageCode]": "ENG",
    "request[data][FIRSTNAME]": user.firstName,
    "request[data][COUNTRY_CODE]": user.countryCode,
    "request[data][LASTNAME]": user.lastName,
    "request[data][STATE]": user.city,
    "request[data][ADDRESS]": user.address,
    "request[data][BIRTH_DATE]": `${user.birth.year}-${user.birth.month}-${user.birth.day}`,
    "request[data][CITY]": user.city,
    "request[data][BIRTHNAME]": `${user.firstName} ${user.lastName}`,
    "request[data][ZIP_CODE]": user.postalCode,
    "request[data][CITIZENSHIP_COUNTRY_CODE]": user.countryCode,
    "request[data][GENDER]": user.gender.charAt(0),
    "request[data][CURRENCY_CODE]": user.currency,
    "request[data][PLACE_OF_BIRTH]": user.city,
    "request[data][CELLPHONE]": `+${user.phone.split('-')[0]}${user.phone.split('-')[1]}`,
    "request[data][EMAIL]": user.email,
    "request[data][NICKNAME]": user.username,
    "request[data][PASSWORD]": user.password,
    "request[data][NO_PROMO_EMAILS]": true,
    "request[data][NO_PROMO_SMS]": true,
    "request[data][NO_PROMO_PHONECALLS]": true,
    "request[data][SELF_PEP_STATUS]": false,
    "request[data][AFFILIATE_COUPON_CODE]": ""
  };

  console.log("Registering account", body);

  // @ts-ignore
  const response = await fetch("https://www.boombangcasino.com/webproxy", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...formHeader,
      origin: "https://www.boombangcasino.com/registration"
    },
    body: queryString.stringify(body)
  });

  if (response.status !== 200) {
    throw Error(JSON.stringify("Error"));
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  registerAccount
};
