const fs = require('fs');
const path = require('path');

function exists(filepath) {
    if (fs.existsSync(filepath)) {
        console.log(`${path.basename(filepath)} file already exists.`);
        return true;
    } else {
        console.log(`${path.basename(filepath)} file could not be found.`);
        return false;
    }
}

function read(filePath) {
    return fs.readFileSync(filePath);
}

function rename(oldPath, newPath) {
    fs.renameSync(oldPath, newPath, err => {
        if (err) {
            throw err;
        }

        console.log(`${path.basename(oldPath)} was renamed to ${path.basename(newPath)}`);
    });
}

function copy(sourcePath, destinationPath) {
    fs.copyFileSync(sourcePath, destinationPath, (err) => {
        if (err) {
            throw err;
        }

        console.log(`${path.basename(sourcePath)} was copied to ${path.basename(destinationPath)}`);
    });
}

module.exports = {
    exists,
    read,
    copy,
    rename
}