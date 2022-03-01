VIDEO.scripts = [
  './js/guy.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // static camera
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
    // GRID HELPER
    scene.add(new THREE.GridHelper(8, 8));

    // MESH
    var guy1 = new Guy();
    scene.add(guy1.group);

    
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
   
};

