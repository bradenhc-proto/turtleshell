const tshell = require('..');
const assert = require('assert');
const path = require('path');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

let task = async () => {
    let testFile = 'test-file.txt';
    try {
        // Test listing directories
        let dirs = await tshell.ls();
        assert(dirs.indexOf(testFile) >= 0, 'assert: test file not found in pwd');

        let contents = await tshell.cat(testFile);
        assert(contents != null, 'assert: contents is null');

        let testFileCopy = 'files/test-file-copy.txt';
        await tshell.cp(testFile, testFileCopy);

        let testFileMove = 'files/test-file-move.txt';
        await tshell.mv(testFile, testFileMove);

        await tshell.rm(testFileMove);

        let fileToCreate = 'files/test-file-created.txt';
        await tshell.touch(fileToCreate);

        let dirToCreate = 'files/dir';
        await tshell.mkdir(dirToCreate);

    } catch (err) {
        console.log(err);
    }
};

task();
