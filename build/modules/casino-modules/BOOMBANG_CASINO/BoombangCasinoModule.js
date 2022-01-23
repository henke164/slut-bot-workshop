const CasinoModuleBase = require("../CasinoModuleBase");
const loginService = require("./services/loginService");
const slotSessionProvider = require("./services/slotSessionProvider");
const registrationService = require("./services/registrationService");

class BoombangCasinoModule extends CasinoModuleBase {
  constructor() {
    super(
      "BOOMBANG_CASINO",
      loginService,
      slotSessionProvider,
      registrationService
    );

    this.url = "https://ocdcom-game.casinomodule.com";
  }

  getDepositLink() {
    return {
      cookies: this.casinoCookie,
      url: "https://www.boombangcasino.com/"
    };
  }
}

module.exports = BoombangCasinoModule;
