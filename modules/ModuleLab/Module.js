const CasinoModuleBase = require("../CasinoModuleBase");
const registrationService = require("./services/registrationService");

class Module extends CasinoModuleBase {
  constructor() {
    super("MODULE_NAME", null, null, registrationService);
  }

  getDepositLink() {
    return {
      cookies: this.casinoCookie,
      url: "https://url-to-deposit"
    };
  }
}

module.exports = Module;
