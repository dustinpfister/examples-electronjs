// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
// using user-data.js module for main.js and preload.js
const userData = require(path.join(__dirname, 'user-data.js'));

var UserDataApp = {};
// get and set user data helpers
UserDataApp.getUserData = userData.get;
UserDataApp.setUserData = userData.set;
UserDataApp.readFile = userData.readFile;
UserDataApp.saveFile = userData.saveFile;

//******** **********
// EVENTS
//******** **********

var EVENTS = {};

EVENTS.fileOpen = function(callback){
    ipcRenderer.on('fileOpen', function(evnt, result) {
        const filePath = result.filePaths[0];
        // UPDATE STATE ON EACH FILE OPEN
        UserDataApp.setUserData('dir_open_start', path.dirname(filePath) )
        .then(()=>{
            return UserDataApp.setUserData('file_name', path.basename(filePath) )
         })
        .then(()=>{
            // call front end callback with result
            callback(evnt, result)
        });
    });
};

EVENTS.fileSave = function(callback){
    ipcRenderer.on('fileSave', function(evnt, result) {
console.log(result)
        const filePath = result.filePath;
        // UPDATE STATE ON EACH FILE OPEN
        UserDataApp.setUserData('dir_open_start', path.dirname(filePath) )
        .then(()=>{
            return UserDataApp.setUserData('file_name', path.basename(filePath) )
         })
        .then(()=>{
            // call front end callback with result
            callback(evnt, result)
        });
    });
};

UserDataApp.on = function(eventName, callback){
   EVENTS[eventName](callback);
};

//******** **********
// EXPOSE API
//******** **********
// create an api for window objects in web pages
contextBridge.exposeInMainWorld('UserDataApp', UserDataApp);
