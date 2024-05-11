const vscode = require("vscode");
const loadInputs = require("./prompt");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "resource-generator-fivem.generate-resource",
    function (uri) {
      loadInputs(context.extensionPath + "/templates", uri.fsPath);
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
