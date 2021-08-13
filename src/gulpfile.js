const rimraf = require("rimraf");
const githubPages = require('gh-pages');
const msbuild = require('msbuild');
const config = require('./config');
const fileUtils = require('./file-utils');

// const msbConfig = config.msbuild();
// const gitConfig = config.git();

function initConfigFileTask(done) {
    if (!fileUtils.exists(config.filePath)) {
        fileUtils.copy(config.fileExample, config.filePath);
    } else {
        console.log('config file was created');
    }

    done();
}

function buildTask(done) {
    const msb = initMsBuild();
    msb.build();

    done();
}

function deployTask(done) {
    const msb = initMsBuild();
    msb.overrideParams.push(msbConfig.parameter.publishurl);
    msb.publish();

    done();
}

function commitTask(done) {
    githubPages.publish(publishFolder, {
        branch: gitConfig.branch,
        repo: gitConfig.repo,
        message: `committed ${new Date()}`
    }, () => {
        console.log('finished publishing to github pages');
    }, err => {
        console.log('pubish github error:', err)
    });
    done();
}

function argvTask(done) {
    console.log(process.argv);
    done();
}

function defaultTask(done) {
    removeFilesInDeployFolderTask(done);
    deployTask(done);
    commitTask(done);

    done();
}

function initMsBuild() {
    const msb = new msbuild();
    msb.version = msbConfig.version;
    msb.configuration = msbConfig.configuration;
    msb.sourcePath = msbConfig.projectFilePath;

    if (fileUtils.exists(msbConfig.projectFilePath)) {
        msb.publishProfile = msbConfig.publishProfile;
    }

    msb.overrideParams.push(msbConfig.parameter.errorsOnly);

    return msb;
}

function removeFilesInDeployFolderTask(done) {
    rimraf(msbConfig.deployFolder, err => {
        console.log(err);
    });
    done();
}

exports.argv = argvTask;
exports.build = buildTask;
exports.publish = deployTask;
exports.commit = commitTask;
exports.removeFile = removeFilesInDeployFolderTask;
exports.initConfigFile = initConfigFileTask;

exports.default = defaultTask;