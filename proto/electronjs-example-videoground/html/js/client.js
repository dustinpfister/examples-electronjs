(function () {

    var WRAP_CANVAS = document.querySelector('#wrap_canvas');

    // ********** **********
    // SCENE, CAMERA, and RENDERER
    // ********** **********
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 640 / 480, 0.1, 100);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    var renderer = new THREE.WebGLRenderer(),
    canvas = renderer.domElement;
    // append to wrap canvas
    WRAP_CANVAS.appendChild(canvas);
    renderer.setSize(640, 480);
    canvas.style.width = '320px';
    canvas.style.height = '240px';

    // ********** **********
    // THE STATE MACHINE (sm) object
    // ********** **********
    var sm = window.sm = {
        canvas: canvas,
        frame: 0,
        frameFrac: 0,
        frameMax: 600,
        per: 0,
        bias: 0,
        scene: scene,
        camera: camera,
        loopActive: false
    };
    var secs = 0,
    fps_update = 30,   // fps rate to update ( low fps for low CPU use, but choppy video )
    fps_movement = 60, // fps rate to move camera
    frame = 0,
    frameMax = 600,
    loopActive = false,
    lt = new Date();
    // get bias value helper
    var getBias = function(per){
        return 1 - Math.abs(per - 0.5) / 0.5;
    };
    // update
    var update = function(){
        sm.per = Math.round(sm.frame) / sm.frameMax;
        sm.bias = getBias(sm.per);
        VIDEO.update(sm, scene, camera, sm.per, sm.bias);
    };
    // app loop
    var loop = function () {
        var now = new Date(),
        secs = (now - lt) / 1000;
        if(sm.loopActive){
            requestAnimationFrame(loop);
            if(secs > 1 / fps_update){

                sm.setFrame();

                sm.frameFrac += fps_movement * secs;
                sm.frameFrac %= sm.frameMax;
                sm.frame = Math.floor(sm.frameFrac)
                lt = now;
            }
        }
    };
    // setup
    sm.setup = function(){
        sm.frame = 0;
        sm.frameFrac = 0;
        sm.loopActive = false;
        scene.children = [];
        VIDEO.init(sm, scene, camera);
        sm.setFrame();
    };
    // set frame
    sm.setFrame = function(){
        // call update method
        update(secs);
        // render
        renderer.render(scene, camera);
    };
    // start loop
    sm.play = function(){
        sm.loopActive = !sm.loopActive;
        if(sm.loopActive){
            lt = new Date();
            loop();
        }
    };

    sm.setup();

}
    ());