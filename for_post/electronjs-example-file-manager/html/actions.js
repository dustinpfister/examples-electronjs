(function(Actions){
    //-------- ----------
    // LINUX ACTIONS
    //-------- ----------
    Actions.linux = {};
    // parse a URI to a folder, file, link, ect
    Actions.linux.parseURI = (uri) => {
        // replace $ with \$
        let a = uri.replace(/\$/g, '\\$');
        // space
        let b = a;
        if(b[0] === '~'){
            // I want "Documents/foo" from "~/Documents/foo" and "" from "~"
            const from_home = b.replace(/~\//, '').replace(/~/, '');
            b = fm.path_join( fm.get_home_dir(), from_home );
        }
        return b;
    };
    // get mime type of the given itemData object
    Actions.linux.get_mime_type = (state, itemData) => {
        return fm.run('file -b --mime-type \"' + Actions.linux.parseURI(itemData[2]) + '\"' );
    };
    // exec file action
    Actions.linux.exec_file = (state, itemData) => {
       console.log('run an exec file action!');
        return fm.run('find ' + itemData[2] + ' -maxdepth 1 -type f -executable')
        .then((result) => {
            console.log( 'result of find command call for shell script' );
            console.log(result)
            if(result){
                fm.runFile( state.pwd , itemData[2] );
            }
        });
    };
    // text edit action
    Actions.linux.text_edit = (state, itemData) => {
        return fm.run('mousepad ' + itemData[2])
        .catch((e) => {
            console.log(e);
            return Promise.resolve('mousepad bin called but with errors');
        });
    };
    // open a terminal window at current pwd
    Actions.linux.terminal = (state) => {
        return fm.run('lxterminal --working-directory=\"'+ state.pwd +'\"');
    };
    // start the alternate file manager as pwd
    Actions.linux.alt_fm = (state) => {
        return fm.run('pcmanfm \"'+ state.pwd +'\"');
    };
    // new folder
    Actions.linux.new_folder = (state) => {
       return fm.run('mkdir ' + state.pwd + '/new_folder');
    };
    // new file
    Actions.linux.new_file = (state) => {
       return fm.run('echo -n \"Hello World\" > ' + state.pwd + '/new.txt');
    };
    // copy a single given item
    Actions.linux.copy_item = (state, itemData) => {
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
        return fm.run('cp -r ' + source + ' ' + dest)
    };
    //-------- ----------
    // WIN32 ACTIONS
    //-------- ----------
    Actions.win32 = {};
    // parse a URI
    Actions.win32.parseURI = (uri) => {
        // replace $ with \$
        let a = uri.replace(/\$/g, '\\$');
        // space
        let b = a;
        if(b[0] === '~'){
            // I want "Documents/foo" from "~/Documents/foo" and "" from "~"
            const from_home = b.replace(/~\//, '').replace(/~/, '');
            b = fm.path_join( fm.get_home_dir(), from_home );
        }
        return b;
    };
    // get mime type of the given itemData object
    Actions.win32.get_mime_type = (state, itemData) => {
        // if folder return 'inode/directory'
        // USE dir /a:h TO SEE WHAT THE DEAL IS WITH JUNCTIONS
        if(itemData[1]){ // <== NOT A GOOD WAY TO DO THIS BECUASE OF JUNCTIONS
            // for now I am using lstat in place of stat that seems to help with junctions
            // However a better way of figure out the mime type should be used
            return Promise.resolve('inode/directory');
        }
        // no native 'file' program in windows, but if there is an extension we can use that
        const info = itemData[4];
        if(info.ext === 'md'){
            Promise.resolve('text/html');
        }
        return Promise.resolve('unkown');
    };
    // exec file action
    Actions.win32.exec_file = (state, itemData) => {};
    // text edit action
    Actions.win32.text_edit = (state, itemData) => {};
    // open a terminal window at current pwd
    Actions.win32.terminal = (state) => {
        return fm.run('start cmd /k "pushd ' +  state.pwd + '"');
    };
    // start the alternate file manager as pwd
    Actions.win32.alt_fm = (state) => {
        return fm.run('Explorer \"'+ state.pwd +'\"');
    };
    // new folder
    Actions.win32.new_folder = (state) => {};
    // new file
    Actions.win32.new_file = (state) => {};
    // copy a single given item
    Actions.win32.copy_item = (state, itemData) => {};
    //-------- ----------
    // MAIN RUN ACTION METHOD
    //-------- ----------
    // Main run action method
    Actions.run = (state, action, itemData ) => {
        return Actions[state.actionMod][action](state, itemData);
    };
}( this['Actions'] = {} ) )