
// I should be able to set a list of dea files
// that need to be loaded, relative to the location of this
// video js file
VIDEO.daePaths = [
  './dae/obj/obj.dae',
  './dae/rpi4/rpi4_start_box.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // GRID HELPER
    scene.add(new THREE.GridHelper(12, 12));

    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight());
    light.position.set(0, 5, -5);
    scene.add(light);

    //scene.add(VIDEO.daeResults[0].scene.children[2])

    let mesh = VIDEO.daeResults[1].scene.children[2];
    mesh.rotation.set(-1.57,0,0)
    scene.add(mesh);
    let obj = VIDEO.daeResults[0].scene.children[2];
    obj.position.set(0,0,5)
    scene.add(obj);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.z = -10 + 20 * sm.bias;
    camera.lookAt(0,0,0);
};

