// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
// ---------- ----------
// REFS TO VIEW IFRAME, and TEXT JSON
// ---------- ----------
const frame_view = document.getElementById('frame_view');
const text_json = document.getElementById('text_json');


// ---------- ----------
// CANVAS FOR view iframe
// ---------- ----------
const view = frame_view.contentWindow.state;

//const canvas = view.canvas;
//const ctx = canvas.getContext('2d');
// ---------- ----------
// SCENE, CAMERA, RENDERER
// ---------- ----------
//const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
//const renderer = new THREE.WebGL1Renderer();
//renderer.setSize(canvas.width, canvas.height, false);
// ---------- ----------
// SCENE CHILD OBJECTS
// ---------- ----------
//scene.add( new THREE.GridHelper(10, 10) );
//const material = new THREE.MeshBasicMaterial();
//const geometry = new THREE.BufferGeometry().copy(new THREE.BoxGeometry( 1, 1, 1 ));
//const points = new THREE.Mesh( geometry, material );
//scene.add(points);
// ---------- ----------
// MAIN STATE OBJECT
// ---------- ----------
const state = window.state = {
    canvas: null,
    ctx: null,
    scene: null,
    camera: null,
    renderer: null,
    object: null,
    user_input: false,
    orbit: null, //new OrbitControls(camera, canvas),
    x: 0, y: 0
};
// ---------- ----------
// HELPERS
// ---------- ----------
// update json text
const updateJSON = () => {
    text_json.value = JSON.stringify( state.scene.toJSON(), null, 4 );
};
// draw to the view canvas
const draw = state.draw = () => {
    const ctx = state.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    state.renderer.render(state.scene, state.camera);
    ctx.drawImage(state.renderer.domElement, 0, 0, state.canvas.width, state.canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText(state.x + ',' + state.y, 10, 10);
};
// setup is to be called when the view is ready
const setup = () => {
    const scene = state.scene = new THREE.Scene();
    state.camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
    state.renderer = new THREE.WebGL1Renderer();
    state.renderer.setSize(state.canvas.width, state.canvas.height, false);
    state.canvas.addEventListener('pointerdown', (e) => {
        state.x = e.clientX;
        state.y = e.clientY;
        if(!state.user_input){
            updateJSON();
        }
    });
    state.orbit = new OrbitControls(state.camera, state.canvas);
    state.camera.position.set( 5, 5, 5 );
    state.camera.lookAt( 0, 0, 0 );
    // child objects

    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    //const geometry = new THREE.BufferGeometry().copy(new THREE.BoxGeometry( 1, 1, 1 ));
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
    scene.add( new THREE.GridHelper(10, 10) );
    // update and draw for first time
    updateJSON();
    draw();
};
// ---------- ----------
// EVENTS
// ---------- ----------
text_json.addEventListener('input', (e) => {
    state.user_input = true;
});
text_json.addEventListener('blur', (e) => {
    console.log(  );
    const str_json = e.target.value;
    const obj = JSON.parse( str_json );
    const obj3d = new THREE.ObjectLoader().parse(obj);

    // remove all children from state.scene

    state.scene = obj3d;

    state.user_input = false;

});
// ---------- ----------
// MAIN APP LOOP
// ---------- ----------
const sm = {
   current: 'init',
   states: {}
};
sm.states.init = () => {
    if(view.ready){
        console.log('looks like the view is ready');
        state.canvas = view.canvas;
        state.ctx = view.ctx;
        setup();
        sm.current = 'run';
    }
};
sm.states.run = () => {
    state.orbit.update();
    state.draw();
};
const loop = function(){
    requestAnimationFrame(loop);
    sm.states[sm.current]();
};
loop();
