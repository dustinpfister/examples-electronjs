/*     video10 - Custom Geometry starting out with the example at threejs.org
 *       found here: 
 *       https://threejs.org/docs/#api/en/core/BufferGeometry
 *
 *       There is also the needs update bool of the position prop that is of interest
 *       and it is also a good idea to read of the BufferGeometry docs:
 *       https://threejs.org/docs/#manual/en/introduction/How-to-update-things
 *       https://threejs.org/docs/#api/en/core/BufferGeometry
 *
 *       The first step with this is just having the position attribute which is
 *       the main focus of this video.
 */
VIDEO.scripts = [
  './js/helper-vertex-normals.js'
];
VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);
    // GRID HELPER
    scene.add(new THREE.GridHelper(8, 8));
    // GEOMETRY
    var geometry =  scene.userData.geo = new THREE.BufferGeometry();
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

    // this will create a normals attribute at least seems to work okay most of the time
    geometry.computeVertexNormals();
    
    // Material - going with basic for this one
    //var material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    var material = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide } );
    // MESH
    var mesh = scene.userData.mesh = new THREE.Mesh(
        geometry,
        material);
    mesh.position.set(0, 0, 0);

    // using vertext helper
    var helper = new THREE.VertexNormalsHelper( mesh, 2, 0x00ff00, 1 );
    mesh.userData.vertexNormalsHelper = helper;
    mesh.add(helper);

    scene.add(mesh);
};
VIDEO.update = function(sm, scene, camera, per, bias){
    var mesh = scene.userData.mesh,
    geo = scene.userData.geo;
    //mesh.rotation.y = Math.PI * 2 * sm.per;

    // mutation of position over time
    var pos = geo.attributes.position;
    pos.array[0] = -1 + 1 * sm.bias;
    pos.array[3] = 1 + 1 * sm.bias;
    pos.array[6] = 1 + 1 * sm.bias;
    pos.needsUpdate = true;

    // bounding box and sphere
    geo.computeBoundingBox();
    geo.computeBoundingSphere();

    // update vertex normals and helper
    geo.computeVertexNormals();
    var helper = mesh.userData.vertexNormalsHelper;
    helper.update();

};

