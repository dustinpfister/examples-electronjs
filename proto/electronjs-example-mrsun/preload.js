// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const promisfy = require('util').promisify;
const readFile = promisfy(fs.readFile);
const writeFile = promisfy(fs.readFile);
const os = require('os');
const path = require('path');

const MS = {};

// get a save file at a standard location
// if it is not there, create a new one
MS.auto_load = () => {
    console.log('MS.auto_load of preload.js');
    const dir_home = os.homedir();
    const file_name = 'mr_sun_autosave.txt';
    const uri_filesave = path.join(dir_home, file_name);
    readFile(uri_filesave, 'utf8')
    .then(((text) => {
       console.log('have some text')
    }))
    .catch((e) => {
        console.warn('Error loading autosave:');
        console.warn('code: ' + e.code);
        console.warn('message: ' + e.message);
        if(e.code === 'ENOENT'){
            console.log('looks like I do not have a file.');
        }
    });
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('MS', MS);
