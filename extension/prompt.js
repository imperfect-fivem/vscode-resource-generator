const vscode = require("vscode");
const defaults = vscode.workspace.getConfiguration(
  "FivemResourceGenerator.defaults"
);

/** @type {{ key: string, prompt: Function }[]} */
const inputs = [];
let index = 0,
  data = {},
  callback;
function _setDatum(key, value) {
  data[key] = value;
  if (++index < inputs.length) inputs[index].prompt();
  else
    callback(data);
}

function addQuickPick(key, title, placeholder, itemsFetcher) {
  let quickPick = vscode.window.createQuickPick();
  quickPick.canSelectMany = false;
  quickPick.title = title;
  quickPick.placeholder = placeholder;
  quickPick.onDidAccept(function () {
    _setDatum(key, quickPick.selectedItems[0].label);
  });

  inputs.push({
    key,
    prompt: function () {
      quickPick.items = itemsFetcher();
      quickPick.selectedItems = [];
      quickPick.value = "";
      quickPick.show();
    },
  });
}

function addInputBox(key, title, placeholder) {
  let box = vscode.window.createInputBox();
  box.title = title;
  box.placeholder = placeholder;
  box.onDidAccept(function () {
    let value = box.value.trim();
    if (value.length == 0) {
      if (!defaults.has(key)) {
        vscode.window.showErrorMessage(
          `You need to complete '${title}' input.`
        );
        return;
      }
      value = defaults.get(key);
      vscode.window.showInformationMessage(
        `Set '${title}' to the default value (${value}).`
      );
    }
    _setDatum(key, value);
    box.hide();
  });

  inputs.push({
    key,
    prompt: function () {
      box.value = "";
      box.show();
    },
  });
}

function promptInputs(cb) {
  index = 0;
  data = {};
  inputs[0].prompt();
  callback = cb;
}

module.exports = { addQuickPick, addInputBox, promptInputs };
