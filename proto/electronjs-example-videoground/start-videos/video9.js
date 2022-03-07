/*     video9 - testing out positon of object to dae file world rather than sphere gemetry
 *         Also making use of a new javaScript file in which I am creating code that has to do with
 *        positionong of groups and mesh objects
 */
VIDEO.daePaths = [
  './dae/world/world.dae'
];
// init 
VIDEO.init = function(sm, scene, camera){
    // static camera
    camera.position.set(6.0, 7.0, 7.0);
    camera.lookAt(0, 0.25, 0);
    // WORLD OBJECT
    let world2 = scene.userData.world = utils.DAE.getMesh( VIDEO.daeResults[0] );
    world2.material = new THREE.MeshNormalMaterial({
            //color: new THREE.Color('lime'),
            //wireframe: true
        });
    scene.add(world2);
    console.log(world2);
    // UNIT OBJECT
    let unit = scene.userData.unit = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshNormalMaterial({
            //color: new THREE.Color('red'),
            //wireframe: true
        }));
    scene.add(unit);
};

// update 
VIDEO.update = function(sm, scene, camera, per, bias){
    let unit = scene.userData.unit,
    world = scene.userData.world;
    // phi and theta for steting start position
    var toPhi = THREE.MathUtils.degToRad( 20 + 100 * sm.bias  );
    var toTheta = THREE.MathUtils.degToRad( 30); //Math.PI * 2 * sm.per;
    unit.position.setFromSphericalCoords(10, toPhi, toTheta );
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

