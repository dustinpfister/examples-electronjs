// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile);
// start the demo api
const demoAPI = {};
// demoAPI.on method - what to do for an event such as 'info-request'
//  demoAPI.on('info-ready', function(e, b){
//      console.log('info is ready: ', b);
//  });
demoAPI.on = (type, callback) => {
    ipcRenderer.on(type, callback);
};
// demoAPI.getInfo method - start a request for info from the main process
demoAPI.getInfo = () => {
    ipcRenderer.send('info-request');
};
// create an api for window objects in web pages
contextBridge.exposeInMainWorld('demoAPI', demoAPI);
