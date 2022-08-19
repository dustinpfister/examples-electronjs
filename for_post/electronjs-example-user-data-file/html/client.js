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
    // log current state
    .then((dataObj) => {
        logger('Got User Data: ');
        logger('dir_open_start: ' + dataObj.dir_open_start);
        logger('file_name: ' + dataObj.file_name);
        logger('');
    })
    .then((uDat)=>{
        return UserDataApp.readFile();
    })
    .then((text)=>{
         logger('text read worked: ');
         con2.value = text;
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
