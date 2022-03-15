// preload with contextIsolation enabled
const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs')

const api = {};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('videoAPI', api);
