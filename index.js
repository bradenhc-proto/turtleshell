const fs = require('fs');

async function ls(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir || '.', (err, items) => {
            if (err) {
                return reject('ls: Failed to read directory contents: ' + err.message);
            }
            resolve(items);
        });
    });
}

async function cat() {}

async function cp() {}

async function mv() {}

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
