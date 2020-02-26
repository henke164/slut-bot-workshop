const CasinoModuleBase = require("../CasinoModuleBase");
const loginService = require("./services/loginService");
const slotSessionProvider = require("./services/slotSessionProvider");
const registrationService = require("./services/registrationService");

class MobileBetModule extends CasinoModuleBase {
  constructor() {
    super(
      "MOBILEBET",
      loginService,
      slotSessionProvider,
      registrationService
    );

    this.url = "https://comeon-game.casinomodule.com";
  }

  getDepositLink() {
    return {
      cookies: this.casinoCookie,
      url: "https://www.mobilebet.com/en/casino/explore?sidebar=account%2Cdeposit"
    };
  }
}

module.exports = MobileBetModule;
