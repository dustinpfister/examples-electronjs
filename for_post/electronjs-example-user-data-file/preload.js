// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// dirs
const dir_home = os.homedir();
const dir_userdata = path.join(dir_home, '.userDataApp');
const uri_data = path.join(dir_userdata, 'data.json');

var UserDataApp = {};

UserDataApp.getUserData = () => {
    return readFile(uri_data, 'utf8')
    .then((jText)=>{
        try{
            return JSON.parse(jText);
        }catch(e){
            return Promise.reject(e);
        }
    });
};

UserDataApp.setUserData = (key, value) => {
    // first get curent set of data
    return UserDataApp.getUserData()
    .then((obj)=>{
        // update key and write new data
        obj[key] = value;
        return writeFile(uri_data, JSON.stringify(obj));
    });
};

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
            console.log(filePath);
            callback(evnt, result)
        });
    });
};

EVENTS.fileSave = function(callback){
	
	
};

UserDataApp.on = function(eventName, callback){
   EVENTS[eventName](callback);
};

//******** **********
// EXPOSE API
//******** **********
// create an api for window objects in web pages
contextBridge.exposeInMainWorld('UserDataApp', UserDataApp);
