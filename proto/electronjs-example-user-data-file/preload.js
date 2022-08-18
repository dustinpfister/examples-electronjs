// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');


var UserDataApp = {};

//******** **********
// EXPOSE API
//******** **********
// create an api for window objects in web pages
contextBridge.exposeInMainWorld('UserDataApp', UserDataApp);
