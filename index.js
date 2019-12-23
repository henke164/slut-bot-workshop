const CasinoModule = require("./modules/ModuleLab/Module");
const { registerAccount } = require("./settings.json");

(async function() {
  const module = new CasinoModule();
  await module.registerAccount(registerAccount);
})();
