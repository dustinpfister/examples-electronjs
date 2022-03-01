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
    let mesh = scene.userData.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    try{
       if(Guy){
            console.log(Guy);
       }
    }catch(e){
        console.log('Error Getting Guy Module.');
        console.log(e.message)
    }
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let mesh = scene.userData.mesh;
    mesh.position.x = -4 + 8 * sm.bias;
};

