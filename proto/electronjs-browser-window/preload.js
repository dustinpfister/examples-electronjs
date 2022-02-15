// preload with contextIsolation enabled
const { contextBridge } = require('electron');

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('api', {
  func: function(){
      return 'hello world';
  }
});


console.log('preload');