// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const readdir = promisify(fs.readdir);

// main file manager api
const fm = {};

fm.readdir = ( uri ) => {
    return readdir(uri);
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('fm', fm);
