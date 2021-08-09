const fs = require('fs');
const path = require('path');

const configObject = JSON.parse(fs.readFileSync('./config.json'));

module.exports.msbuild = {
    publishFolder: configObject.msbuild.publishFolder,
    projectFilePath: configObject.msbuild.projectFilePath,
    publishProfile: configObject.msbuild.publishProfile
}

module.exports.git = {
    branch: configObject.git.branch,
    repo: configObject.git.repo
}