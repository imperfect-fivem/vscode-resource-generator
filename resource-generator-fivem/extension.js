// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { readFileSync, readdirSync, mkdirSync, writeFileSync } = require("fs");
const vscode = require("vscode");
var templatesPath = "",
  template,
  templates = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  templatesPath = context.extensionPath + "/templates";
  templates = readdirSync(templatesPath, {
    encoding: "utf-8",
    withFileTypes: true,
  })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  let disposable = vscode.commands.registerCommand(
    "resource-generator-fivem.generate-resource",
    function (uri) {
      loadInputs(uri.fsPath);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

var InputData = {
  resourceName: {
    title: "Resource name",
    placeholder: "B_Jobs, Phone, esx_garage, ...",
    nextInput: "description",
    value: "",
    input: null,
  },
  description: {
    title: "Resource description",
    placeholder: "This resource is ...",
    nextInput: "author",
    value: "",
    input: null,
  },
  author: {
    title: "Resource author",
    placeholder: "m-imperfect, ...",
    nextInput: "version",
    value: "",
    input: null,
  },
  version: {
    title: "Resource version",
    placeholder: "1.0.0, ...",
    nextInput: "",
    value: "",
    input: null,
  },
};

function loadInputs(resource) {
  let quickPick = vscode.window.createQuickPick();
  quickPick.items = templates.map((template) => {
    return { label: template };
  });
  quickPick.canSelectMany = false;
  quickPick.title = "Template";
  quickPick.placeholder = "choose one...";
  quickPick.onDidAccept(function () {
    template = quickPick.selectedItems[0].label;
    InputData["resourceName"].input.show();
  });
  quickPick.show();

  for (const key in InputData) {
    InputData[key].input = vscode.window.createInputBox();

    InputData[key].input.title = InputData[key].title;
    InputData[key].input.placeholder = InputData[key].placeholder;

    InputData[key].input.onDidAccept(function () {
      if (InputData[key].input.value.trim().length > 0) {
        InputData[key].value = InputData[key].input.value;

        InputData[key].input.hide();

        if (InputData[key].nextInput != "") {
          InputData[InputData[key].nextInput].input.show();
        } else {
          startProcessing(resource);
        }
      } else {
        vscode.window.showErrorMessage(
          `You need to complete this input (${InputData[key].title}).`
        );
      }
    });
  }
}

function startProcessing(url) {
  var folder = getGeneratedFolder("");

  mkdirSync(`${url}/${InputData.resourceName.value}`);
  writeFolder(`${url}/${InputData.resourceName.value}`, folder);

  vscode.window.showInformationMessage(
    `You just created a new FiveM Lua Resource named '${InputData.resourceName.value}'.`
  );
}

function Folder(url) {
  var folder = {
    url: url,
    files: {},
    folders: {},
  };

  return folder;
}

function getGeneratedFolder(url) {
  var folder = Folder(url);

  var files = readdirSync(templatesPath + "/" + template + url, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  for (const file of files) {
    if (file.isDirectory()) {
      folder.folders[file.name] = getGeneratedFolder(`${url}/${file.name}`);
    } else {
      folder.files[file.name] = readFileSync(
        `${templatesPath + "/" + template + url}/${file.name}`,
        { encoding: "utf-8" }
      );

      for (const key in InputData) {
        folder.files[file.name] = folder.files[file.name].replace(
          "${" + key + "}",
          InputData[key].value
        );
      }
    }
  }

  return folder;
}

function writeFolder(url, folder) {
  url = url;

  for (const key in folder.files) {
    writeFileSync(url + "/" + key, folder.files[key], { encoding: "utf-8" });
  }

  for (const key in folder.folders) {
    var fold = folder.folders[key];
    mkdirSync(url + "/" + folder.url + fold.url);

    writeFolder(url + "/" + folder.url + fold.url, fold);
  }
}

module.exports = {
  activate,
  deactivate,
};
