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
    camera.position.set(6, 6, 6);
    scene.background = new THREE.Color('#1a2f2f');
    // ---------- ----------
    // MESH OBJECTS
    // ---------- ----------
    // guy1 object with all mesh objects
    var guy1 = scene.userData.guy1 = new Guy();
    // guy1 canvas obj
    var guy1_canvasObj = scene.userData.guy1_canvasObj = GuyCanvas.createCanvasObject(sm);
    guy1.head.material[1] = guy1.head.material[1] = new THREE.MeshStandardMaterial({ 
        map:  guy1_canvasObj.texture
    });
    scene.add(guy1.group);
    // add HAT to head of guy1 head
    var hat = new THREE.Mesh(
        new THREE.ConeGeometry(0.80, 1.5),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('red')
        })
    );
    hat.rotation.x = THREE.MathUtils.degToRad(-30);
    hat.position.set(0, 0.83 ,-0.6)
    guy1.head.add(hat);
    // grass
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
   var guy1_canvasObj = scene.userData.guy1_canvasObj;
   // update face
   var mPer = sm.per * 8 % 1;
   guy1_canvasObj.draw({
       drawMethod: 'talk',
       mouthPer: 1 - Math.abs(0.5 - mPer) / 0.5
   });
   guy1.walk(sm.per, 16);
   guy1.moveHead(0.8 + 0.3 * sm.bias);
   guy1.group.position.set(-2 + 8 * sm.per, 4, 0)
   guy1.group.rotation.y = 1.57 + 0.75 - 1.5 * sm.bias;
   camera.lookAt(guy1.group.position);
};

