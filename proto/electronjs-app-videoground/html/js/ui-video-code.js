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
        console.log(evnt, result);
        console.log(text);
        vm.$data.videoJS = text;
    });

    videoAPI.on('menuError', function(evnt, err){
        console.log(err);
    });

}
    ());