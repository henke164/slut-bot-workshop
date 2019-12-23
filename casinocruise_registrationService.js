const fetch = require("node-fetch");
const {
  getCookieStringFromResponse
} = require("../../../utilities/cookieHelper");
const { jsonToQueryNoQuestionMark } = require("../../../utilities/jsonToQuery");
const { userAgentHeader, formHeader } = require("../../../utilities/headers");
const { getSessionCookie } = require("../../../services/incapsulaLoginService");

async function validateRegistration(
  { firstName, email, password },
  casinoCookie
) {
  const username = firstName + (1000 + Math.random() * 90000);
  const body = `
fields[]=reg_username
&fields[]=reg_email
&fields[]=reg_password
&fields[]=reg_confirm_password
&data[reg_username]=${username}
&data[reg_email]=${email}
&data[reg_password]=${password}
&data[reg_confirm_password]=${password}
  `;

  // @ts-ignore
  const response = await fetch(
    "https://www.casinocruise.com/en/ajax/validation/register",
    {
      method: "POST",
      headers: {
        ...formHeader,
        ...userAgentHeader,
        cookie: casinoCookie
      },
      body
    }
  );

  const result = await response.json();
  if (result.status !== "ok") {
    console.log(result);
    throw Error("Registration validation failed");
  }
}

async function registerAccount(account) {
  const casinoCookie = await getSessionCookie(
    "https://www.casinocruise.com/en"
  );

  await validateRegistration(account, casinoCookie);

  console.log("Registering account...");
  const userName =
    account.firstName +
    account.birth.year +
    "_" +
    Math.floor(2000 + Math.random() * 10000);

  const body = {
    reg_username: userName,
    reg_email: account.email,
    reg_password: account.password,
    reg_confirm_password: account.password,
    reg_first_name: account.firstName,
    reg_lastname: account.lastName,
    reg_gender: account.gender.toLowerCase(),
    reg_birthday:
      `${account.birth.year}-` +
      `${account.birth.month.toString().padStart(2, "0")}-` +
      `${account.birth.day.toString().padStart(2, "0")}`,
    reg_personalnumber:
      `${account.birth.year}` +
      `${account.birth.month.toString().padStart(2, "0")}` +
      `${account.birth.day.toString().padStart(2, "0")}` +
      `${account.birth.lastFour}`,
    reg_country: account.countryCode,
    reg_address: account.address,
    reg_zipcode: account.postalCode,
    reg_city: account.city,
    reg_currency: account.currency,
    reg_country_prefix: account.phone.split("-")[0],
    reg_phone: account.phone.split("-")[1],
    reg_money_protection: "on",
    reg_lccp_av_street: "",
    reg_lccp_av_region: "",
    reg_lccp_av_building: "",
    reg_lccp_av_premise: "",
    btag: "general_direct",
    mediatag: "",
    reg_approve_marketing: 0
  };

  // @ts-ignore
  const response = await fetch(
    "https://www.casinocruise.com/en/ajax/registration",
    {
      method: "POST",
      headers: {
        ...userAgentHeader,
        ...formHeader,
        cookie: casinoCookie
      },
      body: jsonToQueryNoQuestionMark(body)
    }
  );

  console.log("Registration sent!");

  if (response.status !== 200) {
    throw Error(JSON.stringify("Error"));
  }

  const result = await response.json();
  if (result.status !== "ok") {
    throw Error("Registration failed");
  }
  return getCookieStringFromResponse(response);
}

module.exports = {
  registerAccount
};
