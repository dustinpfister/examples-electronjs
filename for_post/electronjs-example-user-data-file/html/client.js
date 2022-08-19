var con = document.querySelector('#text_console');

con.value += 'App Start \n';
// get user data
var getUserData = function(){
    return UserDataApp.getUserData()
    .then((dataObj) => {
        console.log(dataObj);
        con.value += 'dir_open_start: ' + dataObj.dir_open_start + '\n';
    })
    .catch((e) => {
        console.warn(e.message);
        con.value += 'err: ' + e.message + '\n';
    });
};

// get user data for the first time
getUserData();

// EVENTS
UserDataApp.on('fileOpen', function(evnt, result){
        console.log(result.filePaths[0]);
        getUserData();
});
