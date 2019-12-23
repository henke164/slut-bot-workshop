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

  async registerAccount(account) {
    this.casinoCookie = await this.registrationService.registerAccount(account);
  }
}

module.exports = CasinoModuleBase;
