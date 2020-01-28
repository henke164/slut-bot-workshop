const CasinoModule = require("./modules/ModuleLab/Module");
const { user, slotId, authCookie } = require("./settings.json");
const stdin = process.openStdin();

const casinoModule = new CasinoModule();

const slotSettings = {
  casinoSlotIds: {}
};

slotSettings.casinoSlotIds[casinoModule.casinoName] = slotId;

console.log("What to do?");
console.log("1. Test registration service");
console.log("2. Test login service");
console.log("3. Test sessionProvider");
console.log("4. Build");

stdin.addListener("data", async d => {
  const selection = parseInt(d);
  switch (selection) {
    case 1:
      await casinoModule.registerAccount(registerAccount);
      console.log("Done");
      break;
    case 2:
      const cookieString = await casinoModule.login(username, password);
      console.log("Cookies", cookieString);
      break;
    case 3:
      casinoModule.casinoCookie = "sessionId=42_1580194200250714d5f47de32355f8e30569_7a4bd1bfe24cf1_0;0bf04cf90ac495ebce851f21d27d92de3792aaf32b67728b0ab35c7a5d=7c8ea63bbe84ef8511ea8b809e50190df0aa9a562e541b5b5ada5bc0c9";
      const session = await casinoModule.getSlotSession(slotSettings);
      console.log(session);
      break;
    case 4:
      require("./publish");
      break;
  }
});
