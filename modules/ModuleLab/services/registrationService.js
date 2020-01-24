const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function verifySMS(account) {
  const phoneParts = account.phone.split("-");
  const resp = await fetch("https://www.wildz.com/api/verifysms", {
    headers: {
      ...jsonHeader,
      ...userAgentHeader
    },
    body: {
      Phone: `+${phoneParts[0]}${phoneParts[1]}`,
      PhonePrefix: `+${phoneParts[0]}`,
      Email: account.email,
      Locale: "en"
    }
  });

  const { data } = await resp.json();

  if (!data.successq) {
    throw Error("Failed on verifying sms");
  }

  return new Promise(resolve => {
    console.log("Waiting for verification code");
    const interval = setInterval(() => {
      const fs = require("fs");
      const pin = fs.readFileSync("./pin.txt");
      global.phoneVerification = pin.toString("utf8");
      if (global.phoneVerification) {
        console.log(`Verification code ${global.phoneVerification} received`);
        clearInterval(interval);
        resolve(global.phoneVerification);
      }
    }, 2000);
  });
}

function pad(s) {
  return s.padStart(2, "0");
}

async function getCountryIdFromCountryCode(countryCode) {
  const resp = await fetch("https://www.wildz.com/en/register");
  const html = await resp.text();
  const regex = /<option data-code=[A-Z]{2} value=\d+>/g;
  let foundElement = null;

  let regexResult;

  do {
    regexResult = regex.exec(html);
    if (regexResult) {
      const element = regexResult[0];
      if (element.indexOf(`=${countryCode} v`) > 0) {
        foundElement = element;
      }
    }
  } while (regexResult);

  if (foundElement === null) {
    throw new Error("No country found for phone number.");
  }

  return /value=\d+/.exec(foundElement)[0].replace("value=", "");
}

async function register(user) {
  console.log("Solving captcha...");
  const pin = await verifySMS(account);
  console.log(pin);
  const body = {
    email: account.email,
    password: account.password,
    phone: `+${account.phone.replace("-")}`,
    firstName: account.firstName,
    lastName: account.lastName,
    address1: account.address,
    postalCode: account.postalCode,
    city: account.city,
    countryID: await getCountryIdFromCountryCode(account.countryCode),
    sexID: account.gender === "MALE" ? 1 : 2,
    birthDate: `${account.birth.year}-${pad(account.birth.month)}-${pad(
      account.birth.day
    )}T00:00:00.000Z`,
    pin: pin,
    consents: [1, 2, 3, 4, 5, 6],
    timezoneOffset: -60,
    referer: "https://www.google.com/"
  };

  console.log("Registering user", body);

  // @ts-ignore
  const response = await fetch("https://www.wildz.com/api/register", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...jsonHeader
    },
    body: JSON.stringify(body)
  });

  if (response.status !== 200) {
    console.log(await response.text());
    throw Error(JSON.stringify("Error"));
  }
  console.log("Success");
  console.log(await response.text());
  return getCookieStringFromResponse(response);
}

module.exports = {
  register
};
