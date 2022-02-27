
// I should be able to set a list of dea files
// that need to be loaded, relative to the location of this
// video js file
VIDEO.daePaths = [
  './dae/rpi4/rpi4_start_box.dae'
];

// init method for the video
VIDEO.init = function(scene, camera){
    // GRID HELPER
    scene.add(new THREE.GridHelper(8, 8));
    //scene.add(VIDEO.daeResults[0].scene.children[2])
    scene.add(VIDEO.daeResults[0].scene)

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.z = -10 + 20 * sm.bias;
    camera.lookAt(0,0,0);
};

