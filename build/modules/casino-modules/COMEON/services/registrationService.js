// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");
const { randomInt } = require("../../../utilities/helpers");

async function register(user) {
  const body = {
    username: user.username,
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    postalCode: user.postalCode,
    city: user.city,
    callingCode: user.phone.split('-')[0],
    phoneNumber: user.phone.split('-')[1],
    year: user.birth.year,
    month: user.birth.month,
    day: user.birth.day,
    gender: user.gender,
    country: user.countryCode,
    currency: user.currency,
    state: "",
    voucherCode: "",
    deviceId: randomInt(10),
    acceptMarketingOffers: false,
    referrerUrl: "https://www.google.com/"
  };
  console.log("Registering account", body);

  // @ts-ignore
  const response = await fetch("https://www.comeon.com/rest/register/player", {
    method: "PUT",
    headers: {
      ...userAgentHeader,
      ...jsonHeader,
      origin: "https://www.comeon.com"
    },
    body: JSON.stringify(body)
  });

  const responseJson = await response.json();
  if (response.status !== 200 || responseJson["status"] === "FAILURE") {
    console.log(responseJson);
    throw Error(JSON.stringify("Error"));
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  register
};
