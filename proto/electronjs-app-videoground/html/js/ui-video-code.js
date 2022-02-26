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
            sm.setup();
        }catch(e){
            console.log(e.message);
        }
    };

    var startFilePath = 'html/js/start-videos/video5.js';

    videoAPI.loadFile(startFilePath, (text, e, filePath) => {
		
		console.log('we have a file path here');
		console.log(filePath);
		vm.$data.filePath = filePath;
		console.log(VIDEO.deaPaths)
		
		
        if(e){
            console.warn(e.message);
        }else{
            loadText(text);
        }
    });


    //videoAPI.on('menuOpenFile', function(evnt, text, result){
    videoAPI.on('menuOpenFile', function(text, e){
        loadText(text);
    });

    videoAPI.on('menuSaveFile', function(evnt, result){
        //console.log('save file option');
        //console.log(a, b);
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