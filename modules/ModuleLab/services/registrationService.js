const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { jsonToQueryNoQuestionMark } = require("../../../utilities/jsonToQuery");
const { userAgentHeader, formHeader } = require("../../../utilities/headers");

async function getBlackbox() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://lvbet.com/`);

  const result = await page.evaluate(() => {
    return window.IGLOO.getBlackbox().blackbox;
  });

  return result;
}

function createToken() {
  let token = "";
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let n = 0; 32 > n; n++) {
    token += t.charAt(Math.floor(Math.random() * t.length));
  }
  return token;
}

function pad(n, width) {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
}

async function registerUser(user, token) {
  const blackbox = await getBlackbox();
  console.log(blackbox);
  return;

  const body = {
    login: user.username,
    password: user.password,
    password_repeat: user.password,
    email: user.email,
    email_repeat: user.email,
    promocode: "",
    accept_terms: "on",
    step: 1,
    accepted_terms_version: "5.7",
    registration_product_type: "casino"
  };

  console.log("Registering user", jsonToQueryNoQuestionMark(body));

  // @ts-ignore
  const response = await fetch("https://user.lvbet.com/user/register/basic/", {
    method: "POST",
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      ...userAgentHeader,
      ...formHeader,
      origin: "https://lvbet.com",
      referer: "https://lvbet.com/en/casino/",
      "x-csrftoken": token,
      "x-translation-lang": "en",
      cookie: `lv_lang=en; csrftoken=${token}; domain_gateways="https://lvbet.com/"; regstart=true`
    },
    body: jsonToQueryNoQuestionMark(body)
  });

  if (response.status !== 200) {
    throw Error(JSON.stringify("Error"));
  }
}

async function updatePersonalInfo(user, token) {
  const body = {
    language: "en",
    first_name: user.firstName,
    last_name: user.lastName,
    birth_date: `${user.birth.year}-${pad(user.birth.month)}-${pad(
      user.birth.day
    )}}`,
    gender: user.gender === "MALE" ? "m" : "f",
    address_1: user.address,
    postal_code: user.postalCode,
    city: user.city,
    country: user.countryCode,
    currency: user.currency,
    telephone: `+${user.phone.replace("-", "")}`,
    registration_product_type: "casino",
    io_blackbox: ""
  };

  //@ts-ignore
  const response = await fetch(
    "https://user.lvbet.com/user/register/personal/",
    {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        ...userAgentHeader,
        ...formHeader,
        origin: "https://lvbet.com",
        referer: "https://lvbet.com/en/casino/",
        "x-csrftoken": token,
        "x-translation-lang": "en",
        cookie: `lv_lang=en; csrftoken=${token}; domain_gateways="https://lvbet.com/"; regstart=true`
      },
      body: jsonToQueryNoQuestionMark(body)
    }
  );
}

async function register(user) {
  const token = createToken();

  await registerUser(user, token);

  await updatePersonalInfo(user, token);
}

module.exports = {
  register
};
