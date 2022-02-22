var text_area = document.querySelector('#text_area'),
status_area = document.querySelector('#wrap_status>span')


var getByteSize = function(text){
    return new Blob([text]).size;
};

var updateStatus = function(text){
    var statusText = '';
    statusText += 'size: ' + getByteSize(text) + ' bytes';
    status_area.innerText = statusText;
};

myAPI.onMenuOpenFile(function(evnt, text, result){
    var filePath = result.filePaths[0];
    // update title
    document.title = 'Text Editor' + ' - ' + filePath;
    text_area.value = text;
    updateStatus(text);
});

myAPI.onMenuSaveFile(function(evnt, result){
    myAPI.saveText(text_area.value, result.filePath)
});