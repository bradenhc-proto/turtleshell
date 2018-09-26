const tshell = require('.');

let task = async () => {
    try {
        let dirs = await tshell.ls('/home/braden/Code/nodejs');
        console.log(dirs);
    } catch (err) {
        console.log(err);
    }
};

task();
