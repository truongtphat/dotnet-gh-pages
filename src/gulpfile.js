const fs = require('fs');
const rimraf = require("rimraf");
const githubPages = require('gh-pages');
const microsoftBuild = require('msbuild');
const config = require('./config');

function createConfigFile() {
    if (!fs.existsSync(config.configFilePath)) {
        fs.copyFileSync(config.configExampleFilePath, config.configFilePath);
    } else {
        console.log('config.json file was created');
    }
}

function clearDeployFolder() {
    rimraf(config.msb.deployFolderPath, err => {
        if (err) {
            console.log(err);
        }
    });
}

function deploy() {
    const msb = initMicrosoftBuild();
    msb.overrideParams.push(config.msb.parameter.publishUrl);
    msb.publish();
}

function commit() {
    githubPages.publish(config.msb.deployFolderPath, {
        branch: config.git.branch,
        repo: config.git.repo,
        message: `committed ${new Date()}`
    });
}

function initMicrosoftBuild() {
    const msb = new microsoftBuild();
    msb.version = config.msb.version;
    msb.configuration = config.msb.configuration;
    msb.sourcePath = config.msb.projectFilePath;

    if (fs.existsSync(config.msb.projectFilePath)) {
        msb.publishProfile = config.msb.publishProfile;
    }

    msb.overrideParams.push(config.msb.parameter.errorsOnly);

    return msb;
}

function createConfigFileTask(done) {
    createConfigFile();
    done();
}

function deployTask(done) {
    clearDeployFolder();
    deploy();
    done();
}

function commitTask(done) {
    commit();
    done();
}

function clearDeployFolderTask(done) {
    clearDeployFolder();
    done();
}

function defaultTask(done) {
    clearDeployFolder();
    deploy();
    commit();

    done();
}

exports.createConfigFile = createConfigFileTask;
exports.clearDeployFolder = clearDeployFolderTask;
exports.deploy = deployTask;
exports.commit = commitTask;
exports.default = defaultTask;