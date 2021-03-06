class CasinoModuleBase {
  constructor(
    casinoName,
    loginService,
    slotSessionProvider,
    registrationService
  ) {
    this.casinoName = casinoName;
    this.loginService = loginService;
    this.slotSessionProvider = slotSessionProvider;
    this.registrationService = registrationService;
    this.casinoCookie = "";
  }

  async register(user) {
    if (!this.registrationService) {
      throw Error("Registration not implemented.");
    }

    this.casinoCookie = await this.registrationService.register(user);
  }

  async login(user) {
    if (!this.loginService) {
      return;
    }
    console.log("Logging in...");
    this.casinoCookie = await this.loginService.login(user);
  }

  getSlotSession(slotSettings) {
    if (!this.casinoCookie) {
      console.warn("No casino session is set.");
    }

    const slotId = slotSettings.casinoSlotIds[this.casinoName];
    return this.slotSessionProvider.getSlotSession(slotId, this.casinoCookie);
  }

  getDepositLink() {
    throw new Error("Depositlink is not implemented in " + this.casinoName);
  }
}

module.exports = CasinoModuleBase;
