(function () {

    var WRAP_CANVAS = document.querySelector('#wrap_canvas');


    // CAMERA
    var camera = new THREE.PerspectiveCamera(40, 640 / 480, 0.1, 100);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // SCENE
    var scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(8, 8))
    // RENDER
    var renderer = new THREE.WebGLRenderer();
    // append to wrap canvas
    WRAP_CANVAS.appendChild(renderer.domElement);
    renderer.setSize(640, 480);

    // MESH
    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
    mesh.position.set(0, 0, 0);
    scene.add(mesh);


    // APP LOOP STATE
    var secs = 0,
    methodSecs = 0,
    methodIndex = 0,
    methodName = '',
    fps_update = 30,   // fps rate to update ( low fps for low CPU use, but choppy video )
    fps_movement = 60, // fps rate to move camera
    frame = 0,
    frameMax = 600,
    lt = new Date();

    var getBias = function(per){
        return 1 - Math.abs(per - 0.5) / 0.5;
    };

    var update = function(secs){
        var per = Math.round(frame) / frameMax,
        bias = getBias(per);
    };

    var loop = function () {
        var now = new Date(),
        secs = (now - lt) / 1000;
        requestAnimationFrame(loop);
        if(secs > 1 / fps_update){
            // call update method
            update(secs);
            // render
            renderer.render(scene, camera);
            frame += fps_movement * secs;
            frame %= frameMax;
            lt = now;
        }
    };

    loop();
}
    ());