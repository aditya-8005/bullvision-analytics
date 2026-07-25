const fs = require("fs");

function readJson(filePath) {

    const fileContent = fs.readFileSync(filePath, "utf8");

    return JSON.parse(fileContent);

}

function writeJson(filePath, data) {

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2),
        "utf8"
    );

}

module.exports = {
    readJson,
    writeJson
};