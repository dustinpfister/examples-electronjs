(function () {



   new Vue({
       el: '#wrap_playpack',
       template: '<div>' +
           '<input type="button" value="play/pause" v-on:click="play"><br>' +
           '<span> <input v-model="sm.frame" v-on:keydown="setFrame" size="4"> / {{ sm.frameMax}} </span>' + 
       '</div>',
       data: {
          sm: sm
       },
       methods: {
           setFrame: function(){
               var sm = this.$data.sm;
               sm.frameFrac = sm.frame;
           },
           play: function(){
               var sm = this.$data.sm;
               sm.play();
           }
       }
   });

}
    ());