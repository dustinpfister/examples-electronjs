var con = document.querySelector('#text_console');
var con2 = document.querySelector('#text_content');

// logger
var logger = function(mess){
    con.value += mess + '\n';
};

logger('App Start: ');
// get user data
var getUserData = function(){
    return UserDataApp.getUserData()
    .then((dataObj) => {
        logger('Got User Data: ');
        logger('dir_open_start: ' + dataObj.dir_open_start);
    })
    .catch((e) => {
        logger('Err: ' + e.message);
    });
};

// get user data for the first time
getUserData();

// EVENTS
UserDataApp.on('fileOpen', function(evnt, result){
        logger('File open event:');
        getUserData();
});
