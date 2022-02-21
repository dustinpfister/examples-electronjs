// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('myAPI', {
    func: function(){
        return 'hello world';
    },
    // CLIENT EVENT for open file option in menu
    onMenuOpenFile: function(callback){
        ipcRenderer.on('menu-open-file', callback)
    },
    // CLIENT EVENT for save file option in menu
    onMenuSaveFile: function(callback){
        ipcRenderer.on('menu-save-file', callback)
    },
    saveText: function(text, filePath){

    console.log(text);
    console.log(filePath);  

    }
});


console.log('preload');
