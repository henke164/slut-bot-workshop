const recursive = require("recursive-readdir");
const fs = require("fs");
const stdin = process.openStdin();

function getModuleFiles() {
  return new Promise(resolve => {
    recursive("./modules/ModuleLab", (err, files) => {
      if (err) {
        resolve([]);
        return;
      }

      resolve(files);
    });
  });
}

let enumName = "";
let moduleName = "";
console.log("Enter casino enum name (ex LUCKY_DINO):");
stdin.addListener("data", async d => {
  if (!enumName) {
    enumName = d.toString().trim();
    console.log("Enter Upper camelcase name (ex NetEnt):");
    return;
  }
  moduleName = d.toString().trim() + "Module";

  console.log(`
  enum: ${enumName}
  module: ${moduleName}
  `);

  const moduleContent = fs.readFileSync("modules/ModuleLab/Module.js");
  let content = moduleContent
    .toString()
    .replace("MODULE_NAME", enumName)
    .replace(/ Module/g, ` ${moduleName}`);

  const targetRootFolder = `./build/modules/casino-modules/${enumName}/`;

  if (!fs.existsSync(targetRootFolder)) {
    fs.mkdirSync(targetRootFolder, { recursive: true });
  }

  fs.writeFileSync(`${targetRootFolder}/${moduleName}.js`, content);

  let files = await getModuleFiles();
  // Exclude main file
  files = files.filter(f => f.indexOf("Module.js") === -1);

  console.log(`Publishing ${files.length + 1} files`);
  for (var x = 0; x < files.length; x++) {
    const content = fs.readFileSync(files[x]);
    const path = files[x].replace("modules\\ModuleLab\\", "");
    const pathParts = path.split("\\");
    let targetDirectory = targetRootFolder;
    for (var y = 0; y < pathParts.length - 1; y++) {
      targetDirectory += "/" + pathParts[y];
      if (!fs.existsSync(targetDirectory)) {
        console.log("Creating directory:", targetDirectory);
        fs.mkdirSync(targetDirectory);
      }
    }
    console.log("Writing file:", `${targetRootFolder}/${path}...`);
    fs.writeFileSync(`${targetRootFolder}/${path}`, content);
  }

  console.log("Publish complete: ", targetRootFolder);
  process.exit();
});
