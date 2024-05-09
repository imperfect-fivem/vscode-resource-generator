const vscode = require("vscode");
const { mkdirSync } = require("fs");
const { getGeneratedFolder, writeFolder } = require("./folder");
const prompts = require("./prompts.js");

function create(templatePath, url) {
  var folder = getGeneratedFolder(templatePath);

  for (const file in folder.files) {
    for (const key in prompts) {
      folder.files[file] = folder.files[file].replace(
        "${" + key + "}",
        prompts[key].value
      );
    }
  }

  mkdirSync(`${url}/${prompts.resourceName.value}`);
  writeFolder(`${url}/${prompts.resourceName.value}`, folder);

  vscode.window.showInformationMessage(
    `Created '${prompts.resourceName.value}', a FiveM lua resource.`
  );
}

module.exports = create;
