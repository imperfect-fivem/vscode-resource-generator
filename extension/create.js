const { mkdirSync, statSync, existsSync, readFileSync, writeFileSync } = require("fs");
const { dirname } = require("path");

async function create(data, url) {
  let { templatePath } = data;
  if (!statSync(templatePath).isDirectory())
    throw new Error("Invalid template directory.");

  if (!existsSync(templatePath + "/schema.json"))
    throw new Error("Template schema was not found.");
  const schema = JSON.parse(
    readFileSync(templatePath + "/schema.json", { encoding: "utf-8" })
  );
  if (typeof schema != "object" || schema == null)
    throw new Error("Invalid template schema.");

  let creations = {};
  for (let filePath in schema) {
    let fileContent = schema[filePath];
    if (fileContent.startsWith("file:"))
      fileContent = readFileSync(templatePath + "/" + fileContent.slice(5), {
        encoding: "utf-8",
      });

    creations[filePath] = fileContent.replace(
      /\{\{([^\}]+)\}\}/g,
      (_, key) => data[key] || "{{" + key + "}}"
    );
  }

  for (let creation in creations) {
    let creationPath = url + '/' + data.name + '/' + creation;
    mkdirSync(dirname(creationPath), { recursive: true });
    writeFileSync(creationPath, creations[creation], { encoding: "utf-8" });
  }

  return data;
}

module.exports = create;
