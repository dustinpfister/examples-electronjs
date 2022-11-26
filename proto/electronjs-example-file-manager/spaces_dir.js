const exec = require('child_process').exec;

let dir = '';
dir = 'C:\\Program Files'; // <== WORKS
//dir = 'C:\\Users\\Dustin\\Documents\\Sound recordings';
// run a command
const run = ( bin ) => {
    const com = exec(bin, {cwd: dir });
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
