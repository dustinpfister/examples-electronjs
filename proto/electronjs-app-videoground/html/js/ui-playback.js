(function () {



   new Vue({
       el: '#wrap_playpack',
       template: '<div>' +
           '<input type="button" value="play/pause" v-on:click="play"><br>' +
           '<input type="button" value="set" v-on:click="setFrame"><br>' +
           '<span> {{ sm.frame }} / {{ sm.frameMax}} </span>' + 
       '</div>',
       data: {
          sm: sm,
          setFrame: 0
       },
       methods: {
           setFrame: function(){
               //var sm = this.$data.sm;
               //sm.frameFrac = sm.frame;


               sm.setFrame();
           },
           play: function(){
               var sm = this.$data.sm;
               sm.play();
           }
       }
   });

}
    ());