const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");
const { decodeCaptcha } = require("../../../services/captchaService");

const captchaSettings = {
  apiKey: "08a69d4ec6c3bdd5032c6b32ca8fca2c",
  url: "casino-url",
  googleKey: "google-key"
};

async function registerAccount(account) {
  console.log("Solving captcha...");
  const captcha = await decodeCaptcha(captchaSettings);

  const body = {
    user: {
      email: account.email,
      country: account.countryCode,
      currency: account.currency,
      password_confirmation: account.password,
      receive_promos: false,
      receive_sms_promos: false,
      password: account.password,
      first_name: account.firstName,
      last_name: account.lastName,
      city: account.city,
      address: account.address,
      postal_code: account.postalCode,
      date_of_birth: `${account.birth.year}-${account.birth.month}-${account.birth.day}`,
      terms_acceptance: true,
      age_acceptance: true,
      captcha
    }
  };

  console.log("Registering account", body);

  // @ts-ignore
  const response = await fetch("registration-url", {
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
