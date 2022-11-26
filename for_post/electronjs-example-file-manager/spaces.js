const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
// can not read a path that has spaces in windows

let dir = '';
//dir = 'C:\\Program Files'; // <== WORKS
dir = 'C:\\Users\\Dustin\\Documents\\Sound recordings';
readdir(dir)
.then( ( files) => {
    console.log('works okay.');
    console.log(files);
})
.catch((e) => {
    console.log('nope');
    console.log(e.message);
});