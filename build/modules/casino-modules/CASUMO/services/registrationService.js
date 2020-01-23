// THIS IS EXAMPLE CODE
const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function registerAccount(user) {
    const body = {
        casumoName: user.firstName + Math.random().toString(36).substring(7),
        email: user.email,
        plainTextPassword: user.password,
        name: {firstName: user.firstName, lastName: user.lastName},
        primaryAddress: {
            country: user.countryCode,
            addressLines: {
                street: user.address,
                zip: user.postalCode,
                city: user.city
            }
        },
        nationality: user.countryCode,
        dateOfBirth: user.birth,
        gender: user.gender,
        phoneNumber: {
            prefix: user.phone.split('-')[0],
            number: user.phone.split('-')[1]
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
