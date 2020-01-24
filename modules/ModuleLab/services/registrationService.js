// THIS IS EXAMPLE CODE
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

async function register(user) {
  console.log("Solving captcha...");
  const captcha = await decodeCaptcha(captchaSettings);

  const body = {
    email: user.email,
    country: user.countryCode,
    currency: user.currency,
    password_confirmation: user.password,
    receive_promos: false,
    receive_sms_promos: false,
    password: user.password,
    first_name: user.firstName,
    last_name: user.lastName,
    city: user.city,
    address: user.address,
    postal_code: user.postalCode,
    date_of_birth: `${user.birth.year}-${user.birth.month}-${user.birth.day}`,
    terms_acceptance: true,
    age_acceptance: true,
    captcha
  };

  console.log("Registering user", body);

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
  register
};
