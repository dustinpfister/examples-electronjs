//-------- ----------
// HELPERS
//-------- ----------
// parse an itemData uri to work with file -i [filePath] | cut -d " " -f 2
// I first noticed that i need to to this for a markdown file that has a '$' in the file name
// I may need to expand this as i find more problems like this as needed
const parseItemDataURI = (itemData) => {
    return '\"' + itemData[2].replace('$', '\\$') + '\"';
};
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
            fm.run('file -i ' + parseItemDataURI(itemData) + ' | cut -d " " -f 2')
           .then( (result) => {
               itemData[4].mime = result.replace(';', '').trim();
               const per = i / (len - 1);
               el_progress.style.width = Math.round(per * 100 ) + '%';
               if(per >= 1){
                   el_progress.style.width = '0%';
               }
               // check that it is still the same object before calling setDivStyle
               if(state.files[i] === itemData){
                   setDivStyle(state, itemData, false);
               }
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
            fm.runFile( state.pwd , itemData[2] );
        }
    });
};
// prefrom an action for the given item based on its mime type
const perfromMimeAction = (state, itemData) => {
    const mime = itemData[4].mime;
    const ext = itemData[4].ext;
    console.log('Mime Action Started for ' + mime );
    // FOR FOLDERS
    if(mime === 'inode/directory' || mime ===  'inode/symlink'){
        setPWD(state, itemData[2]);
    }
    // mime types
    if(mime === 'text/plain'){
        console.log('we have a plain text file!');
        fm.run('mousepad ' + itemData[2]);
        return;
    }
    if(mime === 'text/html'){
        console.log('we have an html file!');
        fm.run('mousepad ' + itemData[2]);
        return;
    }
    if(mime === 'text/x-shellscript'){
        console.log('We have a shellscript');
        preformExecFileCheckAction(state, itemData);
        return;
    }
    if(mime === 'application/javascript'){
        console.log('We have a js file!');
        preformExecFileCheckAction(state, itemData);
        return;
    }
    // ext if there is nothing for the mime
    if(ext === 'md' || ext === 'txt' || ext === 'sh' || ext === "html" || ext === 'js'){
        fm.run('mousepad ' + itemData[2]);
    }
};
// set style of a single div
const setDivStyle = (state, itemData, selectedState, div) => {
    // get div and update style
    div = div || document.getElementById('item_' + itemData[3]);
    let r = 0.5, g = 0.5, b = 0.5;
    const mime = itemData[4].mime;
    // folder color
    if(mime === 'inode/directory' || mime ===  'inode/symlink'){
        r = 1; g = 0.7; b = 0;
    }
    if(mime === 'text/plain'){
        r = 1; g = 1; b = 1;
    }
    // some of my *.md files show up as this such as linux-gcc.md
    if(mime === 'text/x-c'){
        r = 0.9; g = 0.9; b = 0.9;
    }
    // some of my *.md files show up as this such as python-class.md
    if(mime === 'text/x-python'){
        r = 0.9; g = 0.9; b = 0.9;
    }
    if(mime === 'text/html'){
        r = 0; g = 0.8; b = 1;
    }
    if(mime === 'text/x-shellscript' || mime === 'application/javascript'){
        r = 0; g = 1; b = 0;
    }
    // set the style
    const st = selectedState ? 0.5 : 1;
    const rc = (r * st) * 255;
    const gc = (g * st) * 255;
    const bc = (b * st) * 255;
    const bgColor = 'rgb( ' + rc + ', ' + gc + ', ' + bc +')';
    if(div){
        div.style.backgroundColor = bgColor;
    }
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
    pwd: '/home/pi/.edit-menu-test',
    files: [],
    CTRL: false,
    itemIndex: 0, // item loop index
    t: null,      // use to clear out any loop in progress when starting a new loop
    selected: [], // an array of currentlt selected index values of items in state.files
    copy: [],     // to store copy urls
    el_contents_pwd : document.getElementById('contents_pwd'),
    el_input_pwd : document.getElementById('input_pwd'),
    el_runterm : document.getElementById('input_runterm'),
    el_runalt : document.getElementById('input_runalt'),
    el_runup : document.getElementById('input_runup'),
    el_progress : document.getElementById('progressbar')
};
//-------- ----------
// SETUP
//-------- ----------
setPWD(state, state.pwd);

console.log( state.pwd );
console.log( fm.getUpOne(state.pwd) );

//-------- ----------
// INPUT_PWD
//-------- ----------
state.el_input_pwd.addEventListener('change', (e)=> {
    setPWD(state, e.target.value);
});
//-------- ----------
// BUTTONS
//-------- ----------
state.el_runterm.addEventListener('click', (e)=> {
    fm.run('lxterminal --working-directory=\"'+ state.pwd +'\"');
});
state.el_runalt.addEventListener('click', (e)=> {
    fm.run('pcmanfm \"'+ state.pwd +'\"');
});
state.el_runup.addEventListener('click', (e)=> {
    //fm.run('pcmanfm \"'+ state.pwd +'\"');
    setPWD(state, fm.getUpOne(state.pwd));
});
//-------- ----------
// GLOBAL CLICK OF WINDOW
//-------- ----------
window.addEventListener('pointerup', (e) => {
    const tar = e.target;
    // if not an item, clear selected and create list contents again
    if( !(tar.className.trim() === 'contents_item') ){
        // clear selected if wrap main clicked
        if(tar.id === 'wrap_main'){
            state.selected = [];
            createListContents(state, state.files);
        }
    }
});
//-------- ----------
// MENU BAR EVENTS
//-------- ----------

fm.on_edit_copy( (evnt) => {
    state.copy = state.selected.map( (i) => {
        return state.files[i];
    });
    console.log('COPY!');
    console.log(state.copy);
});

fm.on_edit_paste( (evnt) => {
    console.log('PASTE!');
    if(state.copy.length >= 1){
        const itemData = state.copy[0];
        // get source and dist
        const source = itemData[2];
        let dest = fm.path_join( state.pwd, itemData[0] );
        // update dist if same
        if(source === dest){
            const ext = '.' + itemData[4].ext;
            dest = fm.path_join(
                state.pwd,
                fm.path_basename(itemData[0], ext) + '_copy_1' + ext
            );
        }
        // run cp with source and dist
        fm.run('cp -r ' + source + ' ' + dest)
        .then(()=>{
            console.log('copy done');
            state.copy = [];
            setPWD(state, state.pwd);
        });
    }
});

