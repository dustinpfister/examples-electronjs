const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const readdir = promisify(fs.readdir);

readdir('C:/Users/Dustin/My Documents')
.then( ( files) => {
	
	console.log('works okay.');
	console.log(files);
	
})
.catch((e) => {
	
	console.log('nope');
	console.log(e.message);
	
});