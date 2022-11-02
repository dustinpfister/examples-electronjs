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
        return Promise.all( files.map( (fileName) => {
            const uri_item = path.join(uri, fileName);
            return stat( uri_item )
            .then((fStat)=>{
                 return [fileName, fStat.isDirectory(), uri_item];
             })
        }) );
    });
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('fm', fm);
