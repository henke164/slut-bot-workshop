const CasinoModule = require("./modules/ModuleLab/Module");
const { user, slotId } = require("./settings.json");
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
      await casinoModule.registerAccount(user);
      console.log("Done");
      break;
    case 2:
      const cookieString = await casinoModule.login(user);
      console.log("Cookies", cookieString);
      break;
    case 3:
      const session = await casinoModule.getSlotSession(slotSettings);
      console.log(session);
      break;
    case 4:
      require("./publish");
      break;
  }
});
