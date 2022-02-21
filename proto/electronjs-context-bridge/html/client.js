var con = document.querySelector('#text_console');

myAPI.onMenuOpenFile(function(evnt, text, result){
   console.log('yes this is dog.');
   console.log(text)
   console.log(result);
   con.value = text;
});