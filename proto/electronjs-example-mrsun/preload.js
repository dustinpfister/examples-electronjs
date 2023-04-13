// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');

const MS = {};

MS.autoload = () => {
    console.log('this is autoload');
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('MS', MS);
