var fs = require('fs'),
    path = require('path');

function getConfig(overrides) {
    overrides = {};
    var config = {},
        configFile = {};
    try {
        configFile = fs.readFileSync(path.join(__dirname, './config.json'));
        configFile = configFile.toString();
        configFile = JSON.parse(configFile);
    } catch(err) {
        console.log(err);
    }

    return Object.assign({}, overrides, configFile, process.env);

}

module.exports = getConfig;
