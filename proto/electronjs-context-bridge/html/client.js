var con = document.querySelector('#text_console');

myAPI.onMenuOpenFile(function(evnt, text, result){
    con.value = text;
});

myAPI.onMenuSaveFile(function(evnt, result){
    //console.log('Save As!...');
    //console.log(result)
    myAPI.saveText(con.value, result.filePath)
});