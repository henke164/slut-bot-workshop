const fetch = require("node-fetch");
const { userAgentHeader, jsonHeader } = require("../../../utilities/headers");

async function login(user) {
  const body = {
    Username: user.email,
    Password: user.password
  };

  const response = await fetch("https://www.wildz.com/api/login", {
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
    throw Error("Login failed!");
  }

  console.log("Response", response.status);
  try {
    const json = await response.json();
    return `Auth=${json.data.token}`;
  } catch (e) {
    throw Error("Login failed!");
  }
}

module.exports = {
  login
};
