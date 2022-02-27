(function () {

    var vm = new Vue({
        el: '#wrap_video_code',
        template: '<div class="wrap_ui">' +
            '<span>{{ filePath }}</span>' +
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

    var loadText = (text) => {
        console.log('loading text...');
        try{
            // by default no dae files are used
            VIDEO.daePaths = null;
            VIDEO.daeResults = [];
            // !!! - #1 - USING EVAL FOR NOW UNTIL I FIGURE OUT SOMTHING BETTER
            eval(text);
            vm.$data.videoJS = text;
            // if there are dea paths then I will want to load them	
	    if(VIDEO.daePaths){
                // !!! loading just dae 0 for now, but I am going to want to load more than one
	        var url = videoAPI.pathJoin(vm.$data.filePath, VIDEO.daePaths[0]);

                var manager = new THREE.LoadingManager(function (result) {
		    console.log('done method of loader manager');
                    sm.setup();
                });
                var loader = new THREE.ColladaLoader(manager);
                loader.load(url, function (result) {
		    console.log('dae file loaded:');
                    console.log(result);
                    VIDEO.daeResults.push(result);
                });
            }else{
	       // just call setup if there are no *.dae files	
               sm.setup();
            }
        }catch(e){
            console.log(e.message);
        }
    };

    // ********** **********
    // LOAD STARTING VIDEO FILE
    // ********** **********
    //var startFilePath = 'html/js/start-videos/video5.js';
    var startFilePath = videoAPI.pathJoin( videoAPI.dir_root, 'start-videos/video5.js' );

    videoAPI.loadFile(startFilePath, (text, e, filePath) => {
        console.log('first client side call of videoAPI.loadFile');
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

    videoAPI.on('menuError', function(evnt, err){
        console.log(err);
    });


}
    ());