// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('myAPI', {
  func: function(){
      return 'hello world';
  },
  onMenuOpenFile: function(callback){
      ipcRenderer.on('menu-open-file', callback)
  }
});


console.log('preload');
