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


    videoAPI.on('menuOpenFile', function(evnt, text, result){
        vm.$data.videoJS = text;
        // USING EVEAL FOR NOW UNTIL I FIGURE OUT SOMTHING BETTER
        eval(text);
        sm.setup();
    });

    videoAPI.on('menuError', function(evnt, err){
        console.log(err);
    });

    videoAPI.on('menuExport', function(evnt, result, imageFolder, mode){
        console.log('okay so far so good...');
        console.log(evnt, result, imageFolder, mode);

    });

}
    ());