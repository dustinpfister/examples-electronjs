// init method for the video
VIDEO.init = function(sm, scene, camera){

    // static camera
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
    // GRID HELPER
    //scene.add(new THREE.GridHelper(8, 8));

    // WORLD OBJECT
    let world = scene.userData.world = new THREE.Mesh(
        new THREE.SphereGeometry(3, 20, 20),
        new THREE.MeshNormalMaterial());
    world.userData.world = true;
    scene.add(world);

    // UNIT OBJECT
    let unit = scene.userData.unit = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
    unit.userData.world = false;
    scene.add(unit);
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){

    let unit = scene.userData.unit,
    world = scene.userData.world;

    unit.position.set(0, 0, 0);


    // origin
    let ori = new THREE.Vector3(0, 4, 2);

    // direction
    let dir = new THREE.Vector3();
    dir.setFromSphericalCoords(1, Math.PI, 0); 
    
    // normalize dir
    dir.normalize();

    // create and set raycaster
    let raycaster = new THREE.Raycaster();
    raycaster.set(ori, dir);


    // result
    let result = raycaster.intersectObject( world );
    let resObj = result[0];

    console.log(resObj)
    console.log(resObj.point)

    unit.position.copy(resObj.point);

/*
    result.forEach((resObj) => {
        var obj = resObj.object;
        console.log(obj.type);
        if(obj.type === 'Mesh'){
            console.log(obj.userData.world)
        }
    });
*/

};

