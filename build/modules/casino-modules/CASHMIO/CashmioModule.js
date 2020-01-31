const CasinoModuleBase = require("../CasinoModuleBase");
const loginService = require("./services/loginService");
const slotSessionProvider = require("./services/slotSessionProvider");
const registrationService = require("./services/registrationService");

class CashmioModule extends CasinoModuleBase {
  constructor() {
    super(
      "CASHMIO",
      loginService,
      slotSessionProvider,
      registrationService
    );

    this.url = "https://igc-game.casinomodule.com";
  }

  getDepositLink() {
    return {
      cookies: this.casinoCookie,
      url: "https://www.cashmio.com"
    };
  }
}

module.exports = CashmioModule;
