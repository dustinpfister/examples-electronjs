//-------- ----------
// HELPERS
//-------- ----------
// item update loop
const itemLoop = function(state){
    state.itemIndex = 0;
    const len = state.files.length;
    const el_progress = state.el_progress;
    el_progress.style.width = '0%';
    clearTimeout(state.t);
    const loop = function(){
        if(state.itemIndex < ( len - 1 ) ){
            state.t = setTimeout(loop, 0);
        }
        (function(itemData, i){
            fm.run('file -i ' + itemData[2] + ' | cut -d " " -f 2')
           .then( (result) => {
               itemData[4].mime = result.replace(';', '').trim();
               const per = i / (len - 1);
               el_progress.style.width = Math.round(per * 100 ) + '%';
               if(per >= 1){
                   el_progress.style.width = '0%';
               }
               setDivStyle(state, itemData, false);
            });
        }(state.files[ state.itemIndex ], state.itemIndex));
        state.itemIndex += 1;
    };
    loop();
};
const preformExecFileCheckAction = (state, itemData) => {
    return fm.run('find ' + itemData[2] + ' -maxdepth 1 -type f -executable')
    .then((result) => {
        console.log( 'result of find command call for shell script' );
        console.log(result)
        if(result){
            fm.run('bash -c ' + itemData[2] + '');
        }
    });
};
// prefrom an action for the given item based on its mime type
const perfromMimeAction = (state, itemData) => {
    const mime = itemData[4].mime;
    console.log('Mime Action Started for ' + mime );
    // FOR FOLDERS
    if(mime === 'inode/directory'){
        setPWD(state, itemData[2]);
    }
    if(mime === 'text/plain'){
        console.log('we have a plain text file!');
        fm.run('mousepad ' + itemData[2]);
    }
    if(mime === 'text/html'){
        console.log('we have an html file!');
        fm.run('mousepad ' + itemData[2]);
    }
    if(mime === 'text/x-shellscript'){
        console.log('We have a shellscript');
        preformExecFileCheckAction(state, itemData);
    }
};
// set style of a single div
const setDivStyle = (state, itemData, selectedState, div) => {
    // get div and update style
    div = div || document.getElementById('item_' + itemData[3]);

    let r = 0.5, g = 0.5, b = 0.5;

    const mime = itemData[4].mime;
    // folder color
    if(mime === 'inode/directory'){
        r = 1; g = 0.7; b = 0;
    }
    if(mime === 'text/plain'){
        r = 1; g = 1; b = 1;
    }
    if(mime === 'text/html'){
        r = 0; g = 0.8; b = 1;
    }
    if(mime === 'text/x-shellscript'){
        r = 0; g = 1; b = 0;
    }

    const st = selectedState ? 0.5 : 1;
    const rc = (r * st) * 255;
    const gc = (g * st) * 255;
    const bc = (b * st) * 255;
    const bgColor = 'rgb( ' + rc + ', ' + gc + ', ' + bc +')';
    div.style.backgroundColor = bgColor;

    // if folder
    //if(itemData[1] && selectedState){
        //div.className = 'contents_item contents_item_folder_selected';
    //}
    // if file
    //if(!itemData[1] && selectedState){
        //div.className = 'contents_item contents_item_file_selected';
    //}
    // if folder
    //if(itemData[1] && !selectedState){
        //div.className = 'contents_item contents_item_folder';
    //}
    // if file
    //if(!itemData[1] && !selectedState){
        //div.className = 'contents_item contents_item_file';
    //}
};
// set style for all selcted divs
const setSelectedDivStyle = (state, selectedState ) => {
    state.selected.forEach( ( itemIndex ) => {
        const itemData = state.files[itemIndex];
        setDivStyle(state, itemData, selectedState);
    });
};
// event hander for items
const createItemClickHandler = (state, itemData) => {
    return (e) => {
        const i = itemData[3];
        // if NOT CTRL, AND state.selcted.length is one, AND current item is selected item
        if(!state.CTRL && state.selected.length === 1 && state.files[ state.selected[0] ][3] === i ){
            perfromMimeAction(state, itemData);
            setSelectedDivStyle(state, false);
            state.selected = [];
            return;
        }
        // if NOT CTRL, result selected array at this point
        if(!state.CTRL){
            setSelectedDivStyle(state, false);
            state.selected = [];
        }
        // push index to selcted array
        state.selected.push(i);
        setDivStyle(state, itemData, true);
    };
};
// create a single div element for an itemData object
const createListItem = (state, itemData) => {
    const div = document.createElement('div');
    div.className = 'contents_item';
    div.id = 'item_' + itemData[3];
    div.addEventListener('pointerup', createItemClickHandler(state, itemData ) );
    div.innerText = itemData[0];
    // set the div style
    setDivStyle(state, itemData, false, div);
    return div;
};
// update contents with given files array
const createListContents = (state, files) => {
    const el = state.el_contents_pwd;
   state.el_contents_pwd.innerHTML = '';
   files.forEach( (itemData) => {
       const div = createListItem(state, itemData);
       state.el_contents_pwd.appendChild(div);
   });
};
// set the current pwd
const setPWD = (state, pwd) => {
    state.pwd = pwd;
    // using realpath to convert ~ to /home/currentuser
    return fm.run('realpath ' + state.pwd)
    .then((result)=>{
        state.pwd = result.trim();
        // using fm.readdir
        return fm.readdir(state.pwd);
    })
    // get files array from fm api and update state.files
   .then((files)=>{
       // format of files as as follows
       //[ fileName, isDir, uri_item, i, fStat, mimeObj ]
        state.files = files;
        // SORT FOLDERS ABOVE FILES
        state.files.sort(function(itemA, itemB){
            if(itemA[1] && !itemB[1]){
                return -1;
            }
            return 1;
        });
        // UPDATE INDEX VALUES AS THEY HAVE BEEN SORTED
        state.files = state.files.map((item, i)=>{
             item[3] = i;
             return item;
        });
        // upadte value of input pwd
        state.el_input_pwd.value = state.pwd;
        // create the list contents
        createListContents(state, state.files);
        // start the infoLoop
        itemLoop(state);
   });
};
//-------- ----------
// STATE OBJECT
//-------- ----------
const state = {
    pwd: '~/Documents/github/examples-electronjs/proto/electronjs-example-file-manager',
    files: [],
    CTRL: false,
    itemIndex: 0, // item loop index
    t: null,      // use to clear out any loop in progress when starting a new loop
    selected: [], // an array of currentlt selected index values of items in state.files
    el_contents_pwd : document.getElementById('contents_pwd'),
    el_input_pwd : document.getElementById('input_pwd'),
    el_runterm : document.getElementById('input_runterm'),
    el_progress : document.getElementById('progressbar')
};
//-------- ----------
// SETUP
//-------- ----------
setPWD(state, state.pwd);
//-------- ----------
// INPUT_PWD
//-------- ----------
state.el_input_pwd.addEventListener('change', (e)=> {
    setPWD(state, e.target.value);
});
//-------- ----------
// INPUT_RUNTERM
//-------- ----------
state.el_runterm.addEventListener('click', (e)=> {
    fm.run('lxterminal --working-directory=\"'+ state.pwd +'\"');
});
