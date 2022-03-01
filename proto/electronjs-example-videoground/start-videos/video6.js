VIDEO.scripts = [
  './js/guy.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    // GRID HELPER
    scene.add(new THREE.GridHelper(8, 8));
    // GUY
    var guy1 = scene.userData.guy1 = new Guy();
    guy1.group.position.set(0,3,0);
    scene.add(guy1.group);
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
   var guy1 = scene.userData.guy1;
   guy1.walk(sm.per, 4);
};

