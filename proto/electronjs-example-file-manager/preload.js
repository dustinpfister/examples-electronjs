// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const promisify = require('util').promisify;

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const exec = require('child_process').exec;
//const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;

// main file manager api
const fm = {};

fm.path_basename = path.basename;
fm.path_join = path.join;

// get up one uri
fm.getUpOne = (uri) => {
    return path.join(uri, '..');
};
// get the home path
fm.get_home_dir = () => {
    return os.homedir();
};
// get platform
fm.get_platform = () => {
    return os.platform();
};
// run a command
fm.run = ( bin) => {
    const com = exec(bin, { shell: '/bin/bash' });
    // out
    return new Promise( (resolve, reject) => {
        let text = '';
        com.stdout.on('data', (data) => {
            //resolve(`${data}`);
            text += `${data}`;
        });
        com.stderr.on('data', (data) => {
            reject(`${data}`);
        });
        com.on('close', (code) => {
            //console.log(`child process ${bin} with code ${code}`);
            resolve(text);
        });
    });
};

fm.runFile = ( cwd, uri_sh, argu ) => {
    //execFile( uri_sh, { shell: '/bin/bash', timeout: 60000 }, function (error, stdout, stderr) {
    //    console.log(error, stdout, stderr);
    //});
    argu = argu || [];
    const child = spawn(uri_sh, argu, {
        cwd: cwd,
        shell: '/bin/bash',
        detached: true,
        stdio: 'ignore'
    });

    //child.stdout.on('data', (data) => {
        //resolve(`${data}`);
    //    console.log(`${data}`);
    //});
    //child.stderr.on('data', (data) => {
    //    console.warn(`${data}`);
    //});

    child.on('close', (code) => {
        console.log(`detached script ${uri_sh} exited with code ${code}`);
    });

    child.unref();
};

// read a dir and get itemData objects
fm.readdir = ( uri ) => {
    // read files array
    return readdir(uri)
    // create an array of arrays such as [ [folder, true], [file, false] ]
    .then( (files) => {
        // unshift in '..' for non root folders
        if(uri != '/'){
            files.unshift('..');
        }
        // return a promise, using Promise.all for all items in uri to do so
        return Promise.all( files.map( (fileName, i) => {
            let uri_item = path.join(uri, fileName);
            // get stat for each item
            return stat( uri_item )
            .then((fStat)=>{
                 // when we have the stat object return an array of values
                 // for the item
                 const fileInfo = Object.assign({}, fStat, {
                     ext: path.extname(fileName).replace('.', ''),
                     mime: ''
                 });
                 return [fileName, fStat.isDirectory(), uri_item, i, fileInfo];
             })
        }) );
    });
};

fm.on_edit_copy = (cb) => {
    ipcRenderer.on('edit_copy', (evnt) => {
        cb(evnt);
    });
};

fm.on_edit_paste = (cb) => {
    ipcRenderer.on('edit_paste', (evnt) => {
        cb(evnt);
    });
};

fm.on_edit_delete = (cb) => {
    ipcRenderer.on('edit_delete', (evnt) => {
        cb(evnt);
    });
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('fm', fm);
