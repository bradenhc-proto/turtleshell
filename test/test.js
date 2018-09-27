const tshell = require('..');

let task = async () => {
    let testFile = 'test-file.txt';
    try {
        let dirs = await tshell.ls();
        console.log(dirs);

        let contents = await tshell.cat(testFile);
        console.log(contents);

        let testFileCopy = 'test-file-copy.txt';
        await tshell.cp(testFile, testFileCopy);
    } catch (err) {
        console.log(err);
    }
};

task();
