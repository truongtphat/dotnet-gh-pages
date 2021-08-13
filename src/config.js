const fs = require('fs');
const path = require('path');

const configFilePath = path.join(__dirname, 'configuration/config.json');
const configFilePathExample = path.join(__dirname, 'configuration/config.json.example');

function msbuild() {
    const configObject = JSON.parse(fs.readFileSync(configFilePath));

    return {
        version: '16.0',
        configuration: 'Release',
        publishFolder: configObject.msbuild.publishFolder,
        publishProfile: configObject.msbuild.publishProfile,
        projectFileName: configObject.msbuild.projectFileName,
        projectFolder: configObject.msbuild.projectFolder,
        projectFilePath: path.join(configObject.msbuild.projectFolder, configObject.msbuild.projectFileName),
        deployFolder: path.join(__dirname, `../deploy/${configObject.msbuild.publishFolder}`),
        parameter: {
            errorsOnly: '/clp:ErrorsOnly',
            publishurl: `/p:publishUrl=${path.join(__dirname, `../deploy/${configObject.msbuild.publishFolder}`)}`
        }
    }
}

function git() {
    return {
        branch: configObject.git.branch,
        repo: configObject.git.repo
    }
}

module.exports = {
    msbuild,
    git
}

module.exports = {
    filePath: configFilePath,
    fileExample: configFilePathExample
}