/*     video10 - Custom Geometry starting out with the example at threejs.org
 *       found here: https://threejs.org/docs/#api/en/core/BufferGeometry
 *       The first step with this is just having the position attribute which is
 *       the main focus of this video
 */
VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);
    // GRID HELPER
    scene.add(new THREE.GridHelper(8, 8));
    // GEOMETRY
    var geometry = new THREE.BufferGeometry();
    // create a simple square shape. 
    var vertices = new Float32Array( [
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0
    ]);
    // must have at least a position attribute, there are 3 values per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    // Material - going with basic for this one
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    // MESH
    var mesh = scene.userData.mesh = new THREE.Mesh(
        geometry,
        material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
};
VIDEO.update = function(sm, scene, camera, per, bias){
    var mesh = scene.userData.mesh;
    //mesh.rotation.y = Math.PI * 2 * sm.per;
};

