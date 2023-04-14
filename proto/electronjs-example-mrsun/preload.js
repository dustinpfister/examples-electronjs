// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const promisfy = require('util').promisify;
const readFile = promisfy(fs.readFile);
const writeFile = promisfy(fs.readFile);
const os = require('os');
const path = require('path');

const dir_home = os.homedir();
const file_name = 'mr_sun_autosave.txt';
const uri_filesave = path.join(dir_home, file_name);

const MS = {};

// get a save file at a standard location
// if it is not there, create a new one
MS.auto_load = () => {
    return readFile(uri_filesave, 'utf8')
    .then(((text) => {
       return Promise.resolve(text);
    }))
    .catch((e) => {
        if(e.code === 'ENOENT'){
            // no file
        }
        return Promise.reject(e);
    });
};

MS.auto_save = (text_lz) => {
    console.log('autosave!');
    console.log(text_lz);
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('MS', MS);
