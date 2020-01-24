const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function verifySMS(user) {
  const phoneParts = user.phone.split("-");
  const body = {
    Phone: `+${phoneParts[0]}${phoneParts[1]}`,
    PhonePrefix: `+${phoneParts[0]}`,
    Email: user.email,
    Locale: "en"
  };

  console.log(body);

  const resp = await fetch("https://www.wildz.com/api/verifysms", {
    method: "POST",
    headers: {
      ...jsonHeader,
      ...userAgentHeader,
      "x-requested-with": "XMLHttpRequest",
      "x-tenant": "wildz",
      origin: "https://www.wildz.com"
    },
    body: JSON.stringify(body)
  });

  const { data } = await resp.json();

  if (!data.success) {
    throw Error("Failed on verifying sms");
  }

  return new Promise(resolve => {
    console.log("Waiting for verification code");
    const interval = setInterval(() => {
      if (global.phoneVerification) {
        console.log(`Verification code ${global.phoneVerification} received`);
        clearInterval(interval);
        resolve(global.phoneVerification);
      }
    }, 2000);
  });
}

function pad(s) {
  return s.toString().padStart(2, "0");
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

  return parseInt(/value=\d+/.exec(foundElement)[0].replace("value=", ""));
}

async function register(user) {
  const pin = await verifySMS(user);

  const body = {
    email: user.email,
    password: user.password,
    phone: `+${user.phone.replace("-", "")}`,
    firstName: user.firstName,
    lastName: user.lastName,
    address1: user.address,
    postalCode: user.postalCode,
    city: user.city,
    countryID: await getCountryIdFromCountryCode(user.countryCode),
    sexID: user.gender === "MALE" ? 1 : 2,
    birthDate: `${user.birth.year}-${pad(user.birth.month)}-${pad(
      user.birth.day
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
      ...jsonHeader,
      "x-requested-with": "XMLHttpRequest",
      "x-tenant": "wildz",
      origin: "https://www.wildz.com"
    },
    body: JSON.stringify(body)
  });

  if (response.status !== 200) {
    console.log(await response.text());
    throw Error(JSON.stringify("Error"));
  }
  console.log(await response.text());
  return getCookieStringFromResponse(response);
}

module.exports = {
  register
};
