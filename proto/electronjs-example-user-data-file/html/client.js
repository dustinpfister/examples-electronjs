var con = document.querySelector('#text_console');

con.value += 'App Start \n';

UserDataApp.getUserData()
.then((dataObj) => {
    console.log(dataObj);
    con.value += 'dir_open_start: ' + dataObj.dir_open_start + '\n';
})
.catch((e) => {
    console.warn(e.message);
    con.value += 'err: ' + e.message + '\n';
})
