(function () {



   new Vue({
       el: '#wrap_playpack',
       template: '<div>' +
           '<input type="button" value="play/pause" v-on:click="play"><br>' +
           '<input type="text" size="5" v-model="targetFrame"><input type="button" value="set frame" v-on:click="setFrame"><br>' +
           '<span> {{ sm.frame }} / {{ sm.frameMax}} </span>' + 
       '</div>',
       data: {
          sm: sm,
          targetFrame: 0
       },
       methods: {
           setFrame: function(){
               var sm = this.$data.sm;
               //sm.frameFrac = sm.frame;

               sm.frameFrac = parseFloat(this.$data.targetFrame);
               sm.frame = Math.floor(sm.frameFrac);

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