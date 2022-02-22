var con = document.querySelector('#text_console');

myAPI.onMenuOpenFile(function(evnt, text, result){
    var filePath = result.filePaths[0];
    // update title
    document.title = 'Text Editor' + ' - ' + filePath;
    con.value = text;
});

myAPI.onMenuSaveFile(function(evnt, result){
    myAPI.saveText(con.value, result.filePath)
});