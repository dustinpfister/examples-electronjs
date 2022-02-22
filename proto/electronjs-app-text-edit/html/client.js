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

textAPI.onMenuOpenFile((evnt, text, result) => {
    const filePath = result.filePaths[0];
    // update title
    document.title = APP_NAME + ' - ' + filePath;
    text_area.value = text;
    updateStatus(text);
});

textAPI.onMenuSaveFile((evnt, result) => {
    textAPI.saveText(text_area.value, result.filePath)
});

text_area.addEventListener('keyup', (e) => {
    updateStatus(e.target.value);
});