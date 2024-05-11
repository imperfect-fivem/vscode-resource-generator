const vscode = require("vscode");
const { mkdirSync } = require("fs");
const { getGeneratedFolder, writeFolder } = require("./folder");

function create(templatePath, url, inputs) {
  var folder = getGeneratedFolder(templatePath);

  for (const file in folder.files) {
    for (const key in inputs) {
      folder.files[file] = folder.files[file].replace(
        "${" + key + "}",
        inputs[key]
      );
    }
  }

  mkdirSync(`${url}/${inputs.resourceName}`);
  writeFolder(`${url}/${inputs.resourceName}`, folder);

  vscode.window.showInformationMessage(
    `Created '${inputs.resourceName}', a FiveM lua resource.`
  );
}

module.exports = create;
