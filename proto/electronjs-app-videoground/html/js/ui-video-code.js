(function () {

    new Vue({
        el: '#wrap_video_code',
        template: '<div class="wrap_ui">' +
            '<textarea cols="60" rows="10"></textarea>'+
        '</div>',
        data: {
           sm: sm
        },
        methods: {
            updateVideo : function(){

            }
        }
    });


    videoAPI.on('menuOpenFile', function(evnt, text, result){
        console.log(evnt, result);
        console.log(text);
    });

    videoAPI.on('menuError', function(evnt, err){
        console.log(err);
    });

}
    ());