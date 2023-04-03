// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');

const MS = {};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('MS', MS);
