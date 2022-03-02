// using guy.js
VIDEO.scripts = [
  './js/guy.js',
  './js/guy-canvas.js'
];
// init method for the video
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // CAMERA, GRID HELPER
    // ---------- ----------
    camera.position.set(8, 8, 8);
    scene.add(new THREE.GridHelper(8, 8));
    // ---------- ----------
    // GUY, grass MESH
    // ---------- ----------
    var guy1 = scene.userData.guy1 = new Guy();

    var guy1_canvasObj = GuyCanvas.createCanvasObject(sm);
    guy1.head.material[1] = guy1.head.material[1] = new THREE.MeshStandardMaterial({ 
        map:  guy1_canvasObj.texture
    });
    scene.add(guy1.group);
    var grass = new THREE.Mesh(
        new THREE.BoxGeometry(55, 1, 55),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('#008800')
        })
    );
    scene.add(grass);
    // ---------- ----------
    // SPOTLIGHT
    // ---------- ----------
    var color = new THREE.Color('white'),
    intensity = 1,
    distance = 30,
    angle = Math.PI * 0.15,
    penumbra = 0.5,
    decay = 0.75;
    var spotLight = scene.userData.spotlight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
    spotLight.position.set(10, 10, 0);
    spotLight.target = guy1.group;
    scene.add(spotLight);
    scene.add( new THREE.AmbientLight(0xffffff, 0.1));
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
   var guy1 = scene.userData.guy1;
   guy1.walk(sm.per, 16);
   guy1.moveHead(0.8 + 0.3 * sm.bias);

   guy1.group.position.set(-16 + 32 * sm.per, 4, 0)
   guy1.group.rotation.y = 1.57 + 0.75 - 1.5 * sm.bias;

   camera.lookAt(guy1.group.position);
};

