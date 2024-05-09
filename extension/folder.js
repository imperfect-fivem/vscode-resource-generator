const { readFileSync, readdirSync, mkdirSync, writeFileSync } = require("fs");

function getGeneratedFolder(base, url = "") {
  var folder = {
    url,
    files: {},
    folders: {},
  };

  var files = readdirSync(base + url, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  for (const file of files) {
    if (file.isDirectory()) {
      folder.folders[file.name] = getGeneratedFolder(
        base,
        url + "/" + file.name
      );
    } else {
      folder.files[file.name] = readFileSync(`${base + url}/${file.name}`, {
        encoding: "utf-8",
      });
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
  getGeneratedFolder,
  writeFolder,
};

