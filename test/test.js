const tshell = require('..');

let task = async () => {
    let testFile = 'test-file.txt';
    try {
        let dirs = await tshell.ls();
        console.log(dirs);

        let contents = await tshell.cat(testFile);
        console.log(contents);

        let testFileCopy = 'files/test-file-copy.txt';
        await tshell.cp(testFile, testFileCopy);

        let testFileMove = 'files/test-file-move.txt';
        await tshell.mv(testFile, testFileMove);
        await tshell.mv(testFileMove, testFile);

        let fileToCreate = 'files/test-file-created.txt';
        await tshell.touch(fileToCreate);

    } catch (err) {
        console.log(err);
    }
};

task();
