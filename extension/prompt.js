const vscode = require("vscode");
const create = require('./create.js');
const prompts = require('./prompts.js');

function loadInputs(templatesPath, templates, resource) {
  let template = "standalone";
  let quickPick = vscode.window.createQuickPick();
  quickPick.items = templates.map((template) => {
    return { label: template };
  });
  quickPick.canSelectMany = false;
  quickPick.title = "Template";
  quickPick.placeholder = "choose one...";
  quickPick.onDidAccept(function () {
    template = quickPick.selectedItems[0].label;
    // @ts-ignore
    prompts["resourceName"].input.show();
  });
  quickPick.show();

  for (const key in prompts) {
    prompts[key].input = vscode.window.createInputBox();

    prompts[key].input.title = prompts[key].title;
    prompts[key].input.placeholder = prompts[key].placeholder;

    prompts[key].input.onDidAccept(function () {
      if (prompts[key].input.value.trim().length > 0) {
        prompts[key].value = prompts[key].input.value;

        prompts[key].input.hide();

        if (prompts[key].nextInput != "") {
          prompts[prompts[key].nextInput].input.show();
        } else {
          create(templatesPath + "/" + template, resource);
        }
      } else {
        vscode.window.showErrorMessage(
          `You need to complete this input (${prompts[key].title}).`
        );
      }
    });
  }
}

module.exports = loadInputs;
