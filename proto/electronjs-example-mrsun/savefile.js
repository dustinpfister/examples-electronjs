const fs = require('fs');
const promisfy = require('util').promisify;
const readFile = promisfy(fs.readFile);
const writeFile = promisfy(fs.writeFile);

const uri_file = process.argv[2];
const data = process.argv[3];
console.log(uri_file, data)
writeFile(uri_file, data, 'utf8')