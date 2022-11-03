// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const exec = require('child_process').exec;

// main file manager api
const fm = {};
// run a command
fm.run = ( bin) => {
    const com = exec(bin);
    // out
    return new Promise( (resolve, reject) => {
        com.stdout.on('data', (data) => {
            resolve(`${data}`);
        });
        com.stderr.on('data', (data) => {
            reject(`${data}`);
        });
        //com.on('close', (code) => {
        //    console.log(`child process exited with code ${code}`);
        //});
    });
};
fm.readdir = ( uri ) => {
    // read files array
    return readdir(uri)
    // create an array of arrays such as [ [folder, true], [file, false] ]
    .then( (files) => {
        // unshift in '..' for non root folders
        if(uri != '/'){
            files.unshift('..');
        }
        return Promise.all( files.map( (fileName, i) => {
            const uri_item = path.join(uri, fileName);
            return stat( uri_item )
            .then((fStat)=>{
                 return [fileName, fStat.isDirectory(), uri_item, i];
             })
        }) );
    });
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('fm', fm);
