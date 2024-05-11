const vscode = require("vscode");
const create = require("./create.js");
const { stat } = require("fs");
const configuration = vscode.workspace.getConfiguration(
  "FivemResourceGenerator"
);

const prompts =  {
  resourceName: {
    title: "Resource name",
    placeholder: "B_Jobs, Phone, esx_garage, ...",
    nextInput: "description",
    input: null,
  },
  description: {
    title: "Resource description",
    placeholder: "This resource is ...",
    nextInput: "author",
    input: null,
  },
  author: {
    title: "Resource author",
    placeholder: "m-imperfect, ...",
    nextInput: "version",
    input: null,
  },
  version: {
    title: "Resource version",
    placeholder: "1.0.0, ...",
    nextInput: "",
    input: null,
  },
};

function loadInputs(templatesPath, resource) {
  /** @type {{ [key: string]: string }} */
  let templates = configuration.get("templates"),
    templatePath, inputs = {};
  let quickPick = vscode.window.createQuickPick();
  quickPick.items = Object.keys(templates).map((template) => {
    return { label: template };
  });
  quickPick.canSelectMany = false;
  quickPick.title = "Template";
  quickPick.placeholder = "choose one...";
  quickPick.onDidAccept(function () {
    templatePath = templates[quickPick.selectedItems[0].label].replace("::templates::", templatesPath);
    stat(templatePath, (err, stats) => {
      if (err) {
        vscode.window.showErrorMessage(err.message);
        return;
      }
      if (!stats.isDirectory()) {
        vscode.window.showErrorMessage("Invalid template.");
        return;
      }
      // @ts-ignore
      prompts["resourceName"].input.show();
    });
  });
  quickPick.show();

  for (const key in prompts) {
    prompts[key].input = vscode.window.createInputBox();

    prompts[key].input.title = prompts[key].title;
    prompts[key].input.placeholder = prompts[key].placeholder;

    prompts[key].input.onDidAccept(function () {
      if (prompts[key].input.value.trim().length > 0) {
        inputs[key] = prompts[key].input.value;

        prompts[key].input.hide();

        if (prompts[key].nextInput != "") {
          prompts[prompts[key].nextInput].input.show();
        } else {
          create(templatePath, resource, inputs);
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
