// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");
const { decodeCaptcha } = require("../../../services/captchaService");

const captchaSettings = {
  apiKey: "6LeswJMUAAAAADIoxCwxvvyJ-QCORFD-W0JMJYpW",
  url: "https://www.casumo.com",
  googleKey: "google-key"
};

async function registerAccount(account) {
  // console.log("Solving captcha...");
  // const captcha = await decodeCaptcha(captchaSettings);

    const body = {
        casumoName: account.firstName + Math.random().toString(36).substring(7),
        email: account.email,
        plainTextPassword: account.password,
        name: {firstName: account.firstName, lastName: account.lastName},
        primaryAddress: {
            country: account.countryCode,
            addressLines: {
                street: account.address,
                zip: account.postalCode,
                city: account.city
            }
        },
        nationality: account.countryCode,
        dateOfBirth: account.birth,
        gender: account.gender,
        phoneNumber: {
            prefix: account.phone.split('-')[0],
            number: account.phone.split('-')[1]
        },
        subscribeToMarketingMaterial: false,
        socialSecurityNumber: ""
    };

  console.log("Registering account", body);

  // @ts-ignore
  const response = await fetch("https://www.casumo.com/partners/player/registration-service/api/register", {
    method: "POST",
    headers: {
      ...userAgentHeader,
      ...jsonHeader
    },
    body: JSON.stringify(body)
  });

  if (response.status !== 200) {
    throw Error(JSON.stringify("Error"));
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  registerAccount
};
