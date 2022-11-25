//const fs = require('fs');
//const path = require('path');
const exec = require('child_process').exec;

//const promisify = require('util').promisify;

// run a command
const run = ( bin ) => {
    //const com = exec(bin, { shell: '/bin/bash' });
    const com = exec(bin, {cwd: 'C:/Users/Dustin/Documnets/Sound recordings' });
    // out
    return new Promise( (resolve, reject) => {
        let text = '';
        com.stdout.on('data', (data) => {
            //resolve(`${data}`);
            text += `${data}`;
        });
        com.stderr.on('data', (data) => {
            reject(`${data}`);
        });
        com.on('close', (code) => {
            //console.log(`child process ${bin} with code ${code}`);
            resolve(text);
        });
    });
};

run('dir')
.then((result)=>{
	
	console.log('yeah');
	console.log(result)
	
})
.catch(()=>{
	
	console.log('nope');
})
