const path = require('path');
const rimraf = require("rimraf");
const ghpages = require('gh-pages');
const msbuild = require('msbuild');
const config = require('./gulp-config');
const { series } = require('gulp');

const publishFolder = path.resolve(`../deploy/${config.msbuild.publishFolder}`);

function initMsbuild() {
    const msb = new msbuild();
    msb.version = '16.0'
    msb.configuration = 'Release';
    msb.sourcePath = config.msbuild.projectFilePath;
    msb.publishProfile = config.msbuild.publishProfile;

    // ignore logging information.
    msb.overrideParams.push('/clp:ErrorsOnly');

    return msb;
}

function removeAllFilesTask(done) {
    rimraf(publishFolder, () => { console.log("done"); });
    done();
}

function buildTask(done) {
    initMsbuild().build();
    done();
}

function publishTask(done) {
    const msb = initMsbuild();

    // custom publish url.
    msb.overrideParams.push(`/p:PublishUrl=${publishFolder}`);
    msb.publish();
    done();
}

function commitTask(done) {
    ghpages.publish(publishFolder, {
        branch: config.git.branch,
        repo: config.git.repo,
        message: `committed ${new Date()}`
    }, () => {
        console.log('Finished publishing to github pages');
    }, err => {
        console.log('Pubish github error:', err)
    });
    done();
}

function defaultTask(done) {
    // removeAllFilesTask(done);
    publishTask(done);
    commitTask(done);
    done();
}

exports.build = buildTask;
exports.publish = publishTask;
exports.commit = commitTask;
exports.removeFile = removeAllFilesTask;
exports.default = defaultTask;