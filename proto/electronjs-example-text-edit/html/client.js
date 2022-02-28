const text_area = document.querySelector('#text_area'),
status_area = document.querySelector('#wrap_status>span')

const APP_NAME = 'Text Editor';

document.title = APP_NAME;

const getByteSize = (text) => {
    return new Blob([text]).size;
};

const updateStatus = (text) => {
    let statusText = '';
    statusText += 'size: ' + getByteSize(text) + ' bytes';
    status_area.innerText = statusText;
};

const updateText = (text) => {
   text_area.value = text;
};

textAPI.onMenuOpenFile((evnt, text, result) => {
    const filePath = result.filePaths[0];
    // update title
    document.title = APP_NAME + ' - ' + filePath;
    updateText(text);
    updateStatus(text);
});

textAPI.onMenuSaveFile((evnt, result) => {
    textAPI.saveText(text_area.value, result.filePath)
});

textAPI.onMenuCanceled((evnt) => {
    console.log('the user cancled a menu option');
});

textAPI.onMenuError((evnt, err) => {
    console.log('Menu Error');
    console.log(evnt);
    console.log(err);
});

text_area.addEventListener('keyup', (e) => {
    let text = e.target.value;
    updateText(text);
    updateStatus(text);
});
