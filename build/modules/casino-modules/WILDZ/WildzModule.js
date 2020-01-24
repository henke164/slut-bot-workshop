const CasinoModuleBase = require("../CasinoModuleBase");
const loginService = require("./services/loginService");
const slotSessionProvider = require("./services/slotSessionProvider");
const registrationService = require("./services/registrationService");

class WildzModule extends CasinoModuleBase {
  constructor() {
    super(
      "WILDZ",
      loginService,
      slotSessionProvider,
      registrationService
    );

    this.url = "https://rootz-game.casinomodule.com";
  }

  getDepositLink() {
    return {
      cookies: this.casinoCookie,
      url: "https://www.wildz.com/en/cashier"
    };
  }
}

module.exports = WildzModule;
