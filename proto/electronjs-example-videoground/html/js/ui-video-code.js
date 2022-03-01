(function () {
    // template and vm instance for video code ui
    var vm = new Vue({
        el: '#wrap_video_code',
        template: '<div class="wrap_ui">' +
            '<span>{{ filePath }}</span><br>' +
            '<textarea v-model="videoJS" cols="60" rows="10" v-on:input="updateVideo"></textarea>'+
        '</div>',
        data: {
           sm: sm,
           filePath: null, // the current path for the video.js file
           videoJS: '\/\/ Video JavaScript goes here'
        },
        methods: {
            updateVideo : function(e){
                loadText(e.target.value);
            }
        }
    });
    // load text
    var loadText = (text) => {
        try{
            // by default no dae files are used
            VIDEO.daePaths = null;
            VIDEO.daeResults = [];
            // !!! - #1 - USING EVAL FOR NOW UNTIL I FIGURE OUT SOMTHING BETTER
            eval(text);
            vm.$data.videoJS = text;
            // if there are dea paths then I will want to load them	
	    if(VIDEO.daePaths){
                var manager = new THREE.LoadingManager(function (result) {
                    sm.setup();
                });
                var loader = new THREE.ColladaLoader(manager);
                VIDEO.daePaths.forEach(function(daeRelUrl){
	            var url = videoAPI.pathJoin(vm.$data.filePath, daeRelUrl);
                    loader.load(url, function (result) {
                        VIDEO.daeResults.push(result);
                    });
                });
            }else{
	       // just call setup if there are no *.dae files	
               sm.setup();
            }
        }catch(e){
            console.warn(e.message);
        }
    };
    // ********** **********
    // LOAD STARTING VIDEO FILE
    // ********** **********
    var startFilePath = videoAPI.pathJoin( videoAPI.dir_root, 'start-videos/video5.js' );
    videoAPI.loadFile(startFilePath, (text, e, filePath) => {
        vm.$data.filePath = videoAPI.pathDirname(filePath);
        if(e){
            console.warn(e.message);
        }else{
            loadText(text);
        }
    });
    // ********** **********
    // LOAD VIDEO FILE FROM MENU
    // ********** **********
    videoAPI.on('menuOpenFile', function(text, e, filePath){
        console.log('Menu open event handler in ui-video-code.js');
        vm.$data.filePath = videoAPI.pathDirname(filePath);
        loadText(text);
    });
    // on save file
    videoAPI.on('menuSaveFile', function(evnt, result){
        if(!result.canceled){
            videoAPI.writeJSFile(result.filePath, vm.$data.videoJS, (e) => {
                if(e){
                    console.warn(e.message);
                }else{
                    console.log('wrote file: ' + result.filePath);
                }
            });
        }
    });
    // on menu error
    videoAPI.on('menuError', function(evnt, err){
        console.log(err);
    });
}
    ());