// Turtleshell is an asynchronous interface for interacting with the operating system using shell/bash-like commands
// that are commonly found on Linux-based operating systems.
const fs = require('fs');
const path = require('path');

// ls lists the contents of a directory. If no directory is given, then it lists the content of the current working
// directory of the process from which it is called.
//
// dir string the path of the directory to examine
//
// ```javascript
// const tshell = require('turtleshell');
// let task = async () => {
//     let dirs = await tshell.ls();
//     console.log(dirs);
// };
// ```
async function ls(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir || process.cwd(), (err, items) => {
            if (err) return reject('ls: failed to read directory contents: ' + err.message);
            resolve(items);
        });
    });
}

// cat prints the contents of the file(s) passed as paramters to the function in UTF8 format.
//
// ```javascript
// const tshell = require('turtleshell');
// let task = async () => {
//     let contents = await tshell.cat('README.md');
//     console.log(contents);
// };
// ````
async function cat() {
    let read = file =>
        new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, text) => {
                if (err) return reject('cat: failed to read file: ' + err.message);
                resolve(text);
            });
        });
    switch (arguments.length) {
        case 0:
            return Promise.resolve('');
        case 1:
            if (!Array.isArray(arguments[0])) {
                return read(arguments[0]);
            } else {
                // TODO: verify that this is okay
                arguments = arguments[0];
            }
        default:
            let filesToRead = [];
            for (let i = 0; i < arguments.length; i++) {
                filesToRead.push(read(arguments[i]));
            }
            return Promise.all(filesToRead);
    }
}

// cp copies the one file or the contents of one file into another directory or another file.
//
// ```javascript
// const tshell = require('turtleshell');
// let task = async () => {
//     await tshell.cp('source.txt', '/path/to/dest.txt');
// };
// ```
async function cp() {
    let copy = (source, destination) =>
        new Promise((resolve, reject) => {
            fs.copyFile(source, destination, err => {
                if (err) return reject('cp: failed to copy file: ' + err.message);
                resolve();
            });
        });
    if (arguments.length < 2) {
        return Promise.reject("cp: not enough arguments: usage: cp('source', ..., 'dest')");
    }
    switch (arguments.length) {
        case 2:
            return copy(arguments[0], arguments[1]);
        default:
            let dest = arguments[arguments.length - 1];
            let filesToCopy = [];
            for (let i = 0; i < arguments.length - 1; i++) {
                filesToCopy.push(copy(arguments[i], dest));
            }
            return Promise.all(filesToCopy);
    }
}

// mv will move a file to a new location or rename a file if the source and destination are located in the same
// directory. Currently mv does not support moving files and directories accross partitions or devices.
//
// ```javascript
// const tshell = require('turtleshell');
// let task = async () => {
//     await tshell.mv('source-file.txt', 'dest-file.txt');
// }
// ```
async function mv() {
    // TODO: add support for transporting across partitions and devices
    let fail = message => {
        return 'mv: failed to move file: ' + message;
    };
    let move = (source, destination) =>
        new Promise((resolve, reject) => {
            let sourceDir = path.dirname(source);
            let destDir = path.dirname(destination);
            if (sourceDir !== destDir) {
                fs.rename(source, destination, err => {
                    if (err) return reject(fail(err.message));
                    resolve();
                });
            } else {
                fs.stat(source, (err, sourceStats) => {
                    if (err) return reject(fail(err.message));
                    fs.stat(destination, (err, destStats) => {
                        if (err) return reject(fail(err.message));
                        if (
                            (sourceStats.isDirectory() && destStats.isFile()) ||
                            (sourceStats.isFile() && destStats.isDirectory())
                        ) {
                            return reject(fail('cannot move directory to file and visa-versa'));
                        }
                        // Everything is okay - proceed
                        fs.link(source, dest, err => {
                            if (err) reject(fail(err.message));
                            fs.unlink(source, err => {
                                if (err) throw err;
                                resolve();
                            });
                        });
                    });
                });
            }
        });
    if (arguments.length < 2) {
        return Promise.reject("mv: not enough arguments: usage: mv('source', ..., 'dest')");
    }
    switch (arguments.length) {
        case 2:
            return move(arguments[0], arguments[1]);
        default:
            let dest = arguments[arguments.length - 1];
            let filesToMove = [];
            for (let i = 0; i < arguments.length - 1; i++) {
                filesToMove.push(move(arguments[i], dest));
            }
            return Promise.all(filesToMove);
    }
}

async function touch() {}

async function mkdir() {}

module.exports = {
    ls,
    cat,
    cp,
    mv,
    touch,
    mkdir
};
