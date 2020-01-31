const fetch = require("node-fetch");
const queryString = require('query-string');
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");

const {
  getCashmioCookies, cashmioBaseHeaders
} = require('./helpers');

async function register(user) {
  const cashmioCookies = await getCashmioCookies();

  var genders = {
    MALE: 1,
    FEMALE: 2,
  };

  var countries = {
    FI: 75,
  };

  if (countries[user.countryCode] === undefined) {
    throw Error('Country code not supported.');
    return;
  }

  const body = {
    "token": cashmioCookies["csrf_token"],
    "userName": user.username,
    "email": user.email,
    "phone_prefix": `+${user.phone.split('-')[0]}`,
    "phone_number": user.phone.split('-')[1],
    "password": user.password,
    "gender": `${genders[user.gender]}`,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "year": `${user.birth.year}`,
    "month": `${user.birth.month}`,
    "day": `${user.birth.day}`,
    "address": user.address,
    "zip": `${user.postalCode}`,
    "city": user.city,
    "countryCode": `${user.countryCode}`,
    "optout[68]": "1",
    "optout[69]": "1",
    "optout[70]": "1",
    "optout[71]": "1",
    "optout[72]": "1",
    "terms_and_conditions": "on",
    "consents[336]": "5",
    "privacy_and_cookie_notice": "on",
    "consents[436]": "1",
    "currency": "1",
    "type": ""
  };

  console.log("Registering account", body);

  const response = await fetch("https://www.cashmio.com/account/register", {
    method: "POST",
    headers: {
      ...cashmioBaseHeaders,
      "Cookie": `_cfduid=${cashmioCookies["__cfduid"]}; btag=${cashmioCookies["btag"]}; user_lang=en; cookiesAccepted=1; ci_session=${cashmioCookies["ci_session"]}; csrf_cashmio=${cashmioCookies["csrf_token"]}; cc=fi`
    },
    body: queryString.stringify(body)
  });

  const responsejson = await response.text();
  console.log(responsejson);

  if (response.status !== 200) {
    throw Error(JSON.stringify("Error"));
  }

  return getCookieStringFromResponse(response);
}

module.exports = {
  register
};
