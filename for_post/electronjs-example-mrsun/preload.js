// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const promisfy = require('util').promisify;
const readFile = promisfy(fs.readFile);
const writeFile = promisfy(fs.writeFile);
const os = require('os');
const path = require('path');

const dir_home = os.homedir();
const file_name = 'mr_sun_autosave.txt';
const uri_filesave = path.join(dir_home, file_name);

// Mr Sun (MS) global API toolkit
const PLATFORM = {};

// get a save file at a standard location
// if it is not there, create a new one
PLATFORM.auto_load = () => {
    return readFile(uri_filesave, 'utf8')
    .then((text) => {
        return Promise.resolve(text);
    })
    .catch((e) => {
        if (e.code === 'ENOENT') {
            // no file
        }
        return Promise.reject(e);
    });
};
// save to the autosave file
PLATFORM.auto_save = (text_lz) => {
    const fork = require('child_process').fork;
    const process = fork(path.join(__dirname, 'savefile.js'), [uri_filesave, text_lz], {
       detached: true,
       stdio: 'ignore'
    });
};
// simple log function (using this to just test out features like visibility change events and so forth might remove )
PLATFORM.log = (mess) => {
    process.stdout.write( mess.toString() + '\n' );
};
// create an api for window objects in web pages
contextBridge.exposeInMainWorld('PLATFORM_ELECTRON', PLATFORM);
