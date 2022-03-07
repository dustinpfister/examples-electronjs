/*     video9 - testing out positon of object to dae file world rather than sphere gemetry
 *         Also making use of a new javaScript file in which I am creating code that has to do with
 *        positionong of groups and mesh objects
 */
// init 
VIDEO.init = function(sm, scene, camera){
    // static camera
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
    // WORLD OBJECT
    let world = scene.userData.world = new THREE.Mesh(
        new THREE.SphereGeometry(3, 20, 20),
        new THREE.MeshBasicMaterial({
            color: new THREE.Color('lime'),
            wireframe: true
        }));
    world.userData.world = true;
    scene.add(world);
    // UNIT OBJECT
    let unit = scene.userData.unit = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({
            color: new THREE.Color('red'),
            wireframe: true
        }));
    unit.userData.world = false;
    scene.add(unit);
};

// update 
VIDEO.update = function(sm, scene, camera, per, bias){
    let unit = scene.userData.unit,
    world = scene.userData.world;
    // phi and theta for steting start position
    var toPhi = THREE.MathUtils.degToRad( 20 + 140 * sm.bias );
    var toTheta = THREE.MathUtils.degToRad( 360 * sm.per ); //Math.PI * 2 * sm.per;
    unit.position.setFromSphericalCoords(5, toPhi, toTheta );
    unit.lookAt(0, 0, 0);
    // origin
    let ori1 = unit.position.clone();
    // direction
    let dir1 = ori1.clone().normalize().multiplyScalar(-1);
    // normalize dir
    dir1.normalize();
    // create and set raycaster
    let raycaster = new THREE.Raycaster();
    raycaster.set(ori1, dir1);
    // result
    let result = raycaster.intersectObject( world );
    let resObj = result[0];
    if(resObj){
        unit.position.copy(resObj.point);
    }
};

