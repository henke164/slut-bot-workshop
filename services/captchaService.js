const fetch = require("node-fetch");

async function decodeCaptcha(settings) {
  const url =
    `http://2captcha.com/in.php?key=${settings.apiKey}` +
    `&method=userrecaptcha&googlekey=${settings.googleKey}` +
    `&pageurl=${settings.url}&invisible=1`;

  const resp = await fetch(url);
  const respText = await resp.text();
  return await getCaptchaResult(settings.apiKey, respText.split("|")[1]);
}

function getCaptchaResult(apiKey, code) {
  return new Promise(resolve => {
    const inverval = setInterval(async () => {
      const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${code}`;
      const result = await fetch(url);
      const resultText = await result.text();
      const resultData = resultText.split("|");

      if (resultData[0] == "OK") {
        clearInterval(inverval);
        resolve(resultData[1]);
      } else if (resultData[0] == "CAPCHA_NOT_READY") {
        console.log("Not ready");
      } else {
        console.log(resultData);
        clearInterval(inverval);
        resolve(resultData[1]);
      }
    }, 5000);
  });
}

module.exports = {
  decodeCaptcha
};
