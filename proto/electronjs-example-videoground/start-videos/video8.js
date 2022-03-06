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
        new THREE.MeshNormalMaterial({
            wireframe: true
        }));
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

    var toPhi = THREE.MathUtils.degToRad( 90 );
    var toTheta = Math.PI * 2 * sm.per;

    unit.position.setFromSphericalCoords(5, toPhi, toTheta );
    unit.lookAt(0,0,0);

    // origin
    let ori = unit.position.clone();

    // direction (can not just subtract or add pi to do it this way)
    let dir = new THREE.Vector3(0,0,-1);
    //let phi = toPhi, //THREE.MathUtils.degToRad( 90 ),
    //theta = toTheta + Math.PI; // THREE.MathUtils.degToRad( 180 );
    //dir.setFromSphericalCoords(1, toPhi, toTheta + Math.PI);
    
    // normalize dir
    dir.normalize();

    // create and set raycaster
    let raycaster = new THREE.Raycaster();
    raycaster.set(ori, dir);


    // result
    let result = raycaster.intersectObject( world );
    let resObj = result[0];

    if(resObj){
        unit.position.copy(resObj.point);
    }


};
