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
        try{
            // !!! - #1 - USING EVAL FOR NOW UNTIL I FIGURE OUT SOMTHING BETTER
            eval(text);
            vm.$data.videoJS = text;
			
			
			// !!! START OF USING THE DAE LOADER, JUST NEED A URL TO SEE IF IT WORKS
			//console.log(vm.$data.filePath)
            //console.log(VIDEO.daePaths);
			console.log('loading text');
			console.log(videoAPI.pathJoin(vm.$data.filePath, VIDEO.daePaths[0]));

/*
            var manager = new THREE.LoadingManager();
            var loader = new THREE.ColladaLoader(manager);
            loader.load(url,
                // done
                function (result) {
                    resultValue = result;
                    daeObjects.results.push(result);
                }
		    };
*/
            sm.setup();
        }catch(e){
            console.log(e.message);
        }
    };

    var startFilePath = 'html/js/start-videos/video5.js';

    videoAPI.loadFile(startFilePath, (text, e, filePath) => {
        console.log('first client side call of videoAPI.loadFile');
        console.log(filePath);
        vm.$data.filePath = videoAPI.pathDirname(filePath);
        if(e){
            console.warn(e.message);
        }else{
            loadText(text);
        }
    });

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