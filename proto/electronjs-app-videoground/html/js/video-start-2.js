// init method for the video
VIDEO.init = function(scene, camera){
    // GRID HELPER
    scene.add(new THREE.GridHelper(8, 8));
    // MESH
    let sphere = scene.userData.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 30, 30),
        new THREE.MeshNormalMaterial());
    sphere.position.set(0, 0, 0);
    scene.add(sphere);
};

// update method for the video
VIDEO.update = function(state, scene, camera, per, bias){
    let sphere = scene.userData.sphere,
    radian = Math.PI * 2 * state.per;
    sphere.position.x = Math.cos(radian) * 4;
    sphere.position.z = Math.sin(radian) * 4;
};

