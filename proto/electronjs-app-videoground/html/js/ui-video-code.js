(function () {

    var vm = new Vue({
        el: '#wrap_video_code',
        template: '<div class="wrap_ui">' +
            '<textarea v-model="videoJS" cols="60" rows="10"></textarea>'+
        '</div>',
        data: {
           sm: sm,
           videoJS: '\/\/ Video JavaScript goes here'
        },
        methods: {
            updateVideo : function(){

            }
        }
    });

    var loadText = (text) => {
        vm.$data.videoJS = text;
        // USING EVEAL FOR NOW UNTIL I FIGURE OUT SOMTHING BETTER
        eval(text);
        sm.setup();
    }

    var startFilePath = '/home/pi/Documents/github_dustinpfister/' +
        'examples-electronjs/proto/electronjs-app-videoground/html/js/video-start.js';

    videoAPI.loadFile(startFilePath, (text, e)=>{
        loadText(text);
    });


    //videoAPI.on('menuOpenFile', function(evnt, text, result){
    videoAPI.on('menuOpenFile', function(text, e){
        loadText(text);
    });

    videoAPI.on('menuError', function(evnt, err){
        console.log(err);
    });


}
    ());