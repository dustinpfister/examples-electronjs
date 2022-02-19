(function () {

    var WRAP_CANVAS = document.querySelector('#wrap_canvas');


    // CAMERA
    var camera = new THREE.PerspectiveCamera(40, 640 / 480, 0.1, 100);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // SCENE
    var scene = new THREE.Scene();
    //scene.add(new THREE.GridHelper(8, 8));
    // RENDER
    var renderer = new THREE.WebGLRenderer();
    // append to wrap canvas
    WRAP_CANVAS.appendChild(renderer.domElement);
    renderer.setSize(320, 240);

    // APP LOOP STATE

    // define the sm object
    var sm = window.sm = {
        frame: 0,
        frameFrac: 0,
        frameMax: 300,
        loopActive: false
    };

    var secs = 0,
    methodSecs = 0,
    methodIndex = 0,
    methodName = '',
    fps_update = 30,   // fps rate to update ( low fps for low CPU use, but choppy video )
    fps_movement = 60, // fps rate to move camera
    frame = 0,
    frameMax = 600,
    loopActive = false,
    lt = new Date();

    var getBias = function(per){
        return 1 - Math.abs(per - 0.5) / 0.5;
    };

    var update = function(){
        var per = Math.round(sm.frame) / sm.frameMax,
        bias = getBias(per);

        var state = {
            frame: sm.frame,
            frameMax: sm.frameMax,
            per: per,
            bias: bias,
            scene: scene,
            camera: camera
        };

        VIDEO.update(state, scene, camera, per, bias);
    };

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


    VIDEO.init(scene, camera);

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

}
    ());