const CasinoModuleBase = require("../CasinoModuleBase");
const loginService = require("./services/loginService");
const slotSessionProvider = require("./services/slotSessionProvider");
const registrationService = require("./services/registrationService");

class CasumoModule extends CasinoModuleBase {
  constructor() {
    super(
      "CASUMO",
      loginService,
      slotSessionProvider,
      registrationService
    );

    this.url = "https://casumo-game.casinomodule.com";;
  }

  getDepositLink() {
    return {
      cookies: this.casinoCookie,
      url: "https://www.casumo.com"
    };
  }
}

module.exports = CasumoModule;
