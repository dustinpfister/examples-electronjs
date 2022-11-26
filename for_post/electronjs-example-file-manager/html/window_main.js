//-------- ----------
// HELPERS
//-------- ----------
// item update loop
const itemLoop = function(state){
    state.loop.i = 0;
    state.loop.pwd = state.pwd;
    const len = state.files.length;
    const el_progress = state.el_progress;
    el_progress.style.width = '100%';
    const loop = function(){
        (function(itemData, i, loopPwd ){
           // using new Actions object
           Actions.run(state, 'get_mime_type', itemData)
           .then( ( result ) => {
               itemData[4].mime = result.trim();
               const per = i / (len - 1);
               el_progress.style.width = Math.round(per * 100 ) + '%';
               // check that it is still the same object before calling setDivStyle
               if(state.files[i] === itemData){
                   setDivStyle(state, itemData, false);
               }
               // keep looping or stop, using i >= len - 1 over per === 1,
               // because of 0 / 0 bug when state.files.length is 1 ( empty folder )
               if(i >= len - 1){
                   el_progress.style.width = '0%';
               }else{
                   // if the loop folder is still the current folder keep looping
                   if(loopPwd === state.pwd){
                       loop();
                   }
               }
            })
           .catch((e) => {
               console.log('ERROR while getting mime types');
               console.log(e)
           })
        }(state.files[ state.loop.i ], state.loop.i, state.loop.pwd));
        state.loop.i += 1;
    };
    loop();
};
// preform an action for the given item based on its mime type
const perfromMimeAction = (state, itemData) => {
    const mime = itemData[4].mime;
    const ext = itemData[4].ext;
    // FOR FOLDERS
    if(mime === 'inode/directory' || mime ===  'inode/symlink'){
        setPWD(state, itemData[2] );
    }
    // mime types
    if(mime === 'text/plain'){
        console.log('we have a plain text file!');
        Actions.run(state, 'text_edit', itemData);
        return;
    }
    if(mime === 'text/html'){
        console.log('we have an html file!');
        Actions.run(state, 'text_edit', itemData);
        return;
    }
    if(mime === 'text/x-shellscript'){
        console.log('We have a shellscript');
        Actions.run(state, 'exec_file', itemData);
        return;
    }
    if(mime === 'application/javascript'){
        console.log('We have a js file!');
        Actions.run(state, 'exec_file', itemData);
        return;
    }
    // ext if there is nothing for the mime
    if(ext === 'md' || ext === 'txt' || ext === 'sh' || ext === "html" || ext === 'js'){
        Actions.run(state, 'text_edit', itemData);
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
// set style for all selected divs
const setSelectedDivStyle = (state, selectedState ) => {
    state.selected.forEach( ( itemIndex ) => {
        const itemData = state.files[itemIndex];
        setDivStyle(state, itemData, selectedState);
    });
};
// event hander for items
const createItemClickHandler = (state, itemData) => {
    return (e) => {
        //!!! WEIRD BUG found that thus far I do not know how to reproduce
        // so I am doing a try cath here for now
        try{
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
        }catch(e){
            console.log('**********');
            console.log('Error while clicking item');
            console.log('itemData: ', itemData);
            console.log('state: ', state);
            console.log('error', e);
            console.log('**********');
        }
    };
};
// create a single div element for an itemData object
const createListItem = (state, itemData) => {
    const div = document.createElement('div');
    div.className = 'contents_item';
    div.id = 'item_' + itemData[3];
    div.addEventListener('pointerup', createItemClickHandler(state, itemData ) );
    div.innerText = itemData[0];
    div.title = itemData[0];
    // set the div style
    setDivStyle(state, itemData, false, div);
    return div;
};
// update contents with given files array
const createListContents = (state, files) => {
    const el = state.el_contents_pwd;
    state.selected = [];
    state.el_contents_pwd.innerHTML = '';
    files.forEach( (itemData) => {
        const div = createListItem(state, itemData);
        state.el_contents_pwd.appendChild(div);
    });
};
// set the current pwd
const setPWD = (state, pwd) => {
    // using parseURI each time for any given pwd string
    state.pwd = Actions[state.actionMod].parseURI(pwd);
    state.selected = [];
    // read the current state.pwd path
    return fm.readdir(state.pwd)
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
        // update value of input pwd
        state.el_input_pwd.value = state.pwd;
        // create the list contents
        createListContents(state, state.files);
        // start the infoLoop
        itemLoop(state);
    })
    .catch((e) => {
        console.log('Error While calling setPWD for : ' + state.pwd);
        console.log(e);
    });
};
//------ ----------
// STATE OBJECT
//-------- ----------
const state = {
    // set action mod string by using os.platform nodejs method
    actionMod: fm.get_platform(),
    pwd: '~/',
    files: [],
    CTRL: false,
    loop: {
       i: 0,   // item loop index
       pwd: '' // compare to state.pwd to find out if looping should continue
    },
    selected: [], // an array of currentlt selected index values of items in state.files
    copy: [],     // to store copy urls
    el_contents_pwd : document.getElementById('contents_pwd'),
    el_input_pwd : document.getElementById('input_pwd'),
    el_runterm : document.getElementById('input_runterm'),
    el_runalt : document.getElementById('input_runalt'),
    el_runup : document.getElementById('input_runup'),
    el_run_new_folder : document.getElementById('input_newfolder'),
    el_run_new_file : document.getElementById('input_newfile'),
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
// BUTTONS
//-------- ----------
state.el_run_new_folder.addEventListener('click', (e)=> {
    console.log('new folder');
    Actions.run(state, 'new_folder')
    .then((result)=>{
        console.log('made the new folder okay');
        setPWD(state, state.pwd);
    })
    .catch((e)=>{
        console.log('there was an error making new new folder');
        console.log(e);
    });
});
state.el_run_new_file.addEventListener('click', (e)=> {
    console.log('new file');
    //fm.run('echo -n \"Hello World\" > ' + state.pwd + '/new.txt')
    Actions.run(state, 'new_file')
    .then((result)=>{
        setPWD(state, state.pwd);
    });
});
state.el_runterm.addEventListener('click', (e)=> {
    //fm.run('lxterminal --working-directory=\"'+ state.pwd +'\"');
    Actions.run(state, 'terminal');
});
state.el_runalt.addEventListener('click', (e)=> {
    //fm.run('pcmanfm \"'+ state.pwd +'\"');
    Actions.run(state, 'alt_fm');
});
state.el_runup.addEventListener('click', (e)=> {
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
        if(tar.id === 'wrap_main' || tar.id === 'contents_pwd'){
            state.selected = [];
            createListContents(state, state.files);
        }
    }
});
//-------- ----------
// MENU BAR EVENTS
//-------- ----------
// delete the current slected item
fm.on_edit_delete( (evnt) => {
    if(state.selected.length >= 1){
        const itemData = state.files[state.selected[0]];
        fm.run('rm -frd ' + itemData[2])
        .then(()=>{
            console.log('Delete of file done');
            state.selected = [];
            setPWD(state, state.pwd);
        });
    }else{
        console.log('nothing selected to delete');
    }
});
// copy edit event
fm.on_edit_copy( (evnt) => {
    console.log('COPY!');
    state.copy = state.selected.map( (i) => {
        return state.files[i];
    });
    console.log(state.copy);
});
// paste edit event
fm.on_edit_paste( (evnt) => {
    console.log('PASTE!');
    if(state.copy.length >= 1){
        const itemData = state.copy[0];
        Actions.run(state, 'copy_item', itemData)
        .then(()=>{
            console.log('copy done');
            state.copy = [];
            setPWD(state, state.pwd);
        });
    }
});
