const fs = require('fs');
const path = require('path');

const configFilePath = path.join(__dirname, 'configuration', 'config.json');
const configFilePathExample = path.join(__dirname, 'configuration', 'config.json.example');
const configObject = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath)) : null;

function msBuild() {
    if (!configObject) {
        return null;
    }

    return {
        version: '16.0',
        configuration: 'Release',
        deployFolderName: configObject.msb.deployFolderName,
        deployProfile: configObject.msb.deployProfile,
        projectFileName: configObject.msb.projectFileName,
        projectFolderPath: configObject.msb.projectFolderPath,
        projectFilePath: path.join(configObject.msb.projectFolderPath, configObject.msb.projectFileName),
        deployFolderPath: path.join(__dirname, `../deploy/${configObject.msb.deployFolderName}`),
        parameter: {
            errorsOnly: '/clp:ErrorsOnly',
            publishUrl: `/p:publishUrl=${path.join(__dirname, `../deploy/${configObject.msb.deployFolderName}`)}`
        }
    }
}

function git() {
    if (!configObject) {
        return null;
    }

    return {
        branch: configObject.git.branch,
        repo: configObject.git.repo
    }
}

module.exports = {
    configFilePath: configFilePath,
    configExampleFilePath: configFilePathExample,
    git: git(),
    msb: msBuild()
}