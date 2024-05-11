const vscode = require("vscode");
const { mkdirSync, statSync } = require("fs");
const { getGeneratedFolder, writeFolder } = require("./folder");

async function create(data, url) {
  let { templatePath } = data;
  if (!statSync(templatePath).isDirectory())
    throw new Error("Invalid template.");

  var folder = getGeneratedFolder(templatePath);

  for (const file in folder.files) {
    for (const key in data) {
      folder.files[file] = folder.files[file].replace(
        "${" + key + "}",
        data[key]
      );
    }
  }

  mkdirSync(`${url}/${data.name}`);
  writeFolder(`${url}/${data.name}`, folder);

  vscode.window.showInformationMessage(
    `Created a FiveM lua resource '${data.name}'.`
  );
}

module.exports = create;
