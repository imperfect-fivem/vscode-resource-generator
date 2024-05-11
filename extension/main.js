const vscode = require("vscode");
const configuration = vscode.workspace.getConfiguration(
  "FivemResourceGenerator"
);
const { addQuickPick, addInputBox, promptInputs } = require("./prompt");
const create = require("./create");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  addQuickPick("template", "Resource Template", "choose one...", () =>
    Object.keys(configuration.get("templates")).map((template) => {
      return { label: template };
    })
  );
  addInputBox("name", "Resource Name", "Jobs, Phone, ...");
  addInputBox("description", "Resource description", "This resource is ...");
  addInputBox("author", "Resource author", "m-imperfect, ...");
  addInputBox("version", "Resource version", "1.0.0, ...");

  const templatesPath = context.extensionPath + "/templates";
  let disposable = vscode.commands.registerCommand(
    "resource-generator-fivem.generate-resource",
    function (uri) {
      promptInputs((data) => {
        data.templatePath = configuration
          .get("templates")
          [data.template].replace("::templates::", templatesPath),
        create(data, uri.fsPath).catch(err => vscode.window.showErrorMessage(err.message));
      });
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
