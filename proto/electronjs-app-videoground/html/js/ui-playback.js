(function () {



   new Vue({
       el: '#wrap_playpack',
       template: '<div>' + 
           '<span> {{ sm.frame }} / {{ sm.frameMax}} </span>' + 
       '</div>',
       data: {
          sm: sm
       }
   });

}
    ());