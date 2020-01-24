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

    this.url = "https://url-where-the-spin-requests-are-sent";
  }

  getDepositLink() {
    return {
      cookies: this.casinoCookie,
      url: "https://url-to-deposit"
    };
  }
}

module.exports = WildzModule;
