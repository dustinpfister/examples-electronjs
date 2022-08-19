// user-data.js - common user data methods to use in main.js and preload.js
const path = require('path');
const os = require('os');
const fs = require('fs');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// dirs
const dir_home = os.homedir();
const dir_userdata = path.join(dir_home, '.userDataApp');
const uri_data = path.join(dir_userdata, 'data.json');

var api = module.exports = {};

// get the user data
api.get = () => {
    return readFile(uri_data, 'utf8')
    .then((jText)=>{
        try{
            return JSON.parse(jText);
        }catch(e){
            return Promise.reject(e);
        }
    });
};

// set a user data key
api.set = (key, value) => {
    // first get curent set of data
    return api.getUserData()
    .then((obj)=>{
        // update key and write new data
        obj[key] = value;
        return writeFile(uri_data, JSON.stringify(obj));
    });
};
