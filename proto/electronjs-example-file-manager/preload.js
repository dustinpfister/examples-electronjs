// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

// main file manager api
const fm = {};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('fm', fm);
