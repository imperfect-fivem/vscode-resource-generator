const vscode = require("vscode");
const { readdirSync } = require("fs");
const loadInputs = require("./prompt");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let templatesPath = context.extensionPath + "/templates";
  let templates = readdirSync(templatesPath, {
    encoding: "utf-8",
    withFileTypes: true,
  })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  let disposable = vscode.commands.registerCommand(
    "resource-generator-fivem.generate-resource",
    function (uri) {
      loadInputs(templatesPath, templates, uri.fsPath);
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
