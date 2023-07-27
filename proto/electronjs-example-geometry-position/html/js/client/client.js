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
const canvas = frame_view.contentWindow.canvas;
const ctx = canvas.getContext('2d');
// ---------- ----------
// SCENE, CAMERA, RENDERER
// ---------- ----------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(canvas.width, canvas.height, false);
// ---------- ----------
// SCENE CHILD OBJECTS
// ---------- ----------
scene.add( new THREE.GridHelper(10, 10) );
const material = new THREE.MeshBasicMaterial();
const geometry = new THREE.BufferGeometry().copy(new THREE.BoxGeometry( 1, 1, 1 ));
const points = new THREE.Mesh( geometry, material );
scene.add(points);
// ---------- ----------
// MAIN STATE OBJECT
// ---------- ----------
const state = window.state = {
    scene: scene,
    object: points,
    user_input: false,
    orbit: new OrbitControls(camera, canvas),
    x: 0, y: 0
};
// ---------- ----------
// HELPERS
// ---------- ----------
// draw to the view canvas
const draw = state.draw = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderer.render(scene, camera);
    ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText(state.x + ',' + state.y, 10, 10);
};
// update json text
const updateJSON = () => {
    text_json.value = JSON.stringify( points.toJSON(), null, 4 );
};
// ---------- ----------
// EVENTS
// ---------- ----------
canvas.addEventListener('pointerdown', (e) => {
    state.x = e.clientX;
    state.y = e.clientY;
    if(!state.user_input){
        updateJSON();
    }
});
text_json.addEventListener('input', (e) => {
    state.user_input = true;
});
text_json.addEventListener('blur', (e) => {
    console.log(  );
    const str_json = e.target.value;
    const obj = JSON.parse( str_json );
    const obj3d = new THREE.ObjectLoader().parse(obj);
    state.object.copy(obj3d);
    state.user_input = false;
});
// ---------- ----------
// MAIN APP LOOP
// ---------- ----------
camera.position.set( 5, 5, 5 );
camera.lookAt( 0, 0, 0 );
draw();
updateJSON();
const loop = function(){
    requestAnimationFrame(loop);
    state.orbit.update();
    state.draw();
};
loop();
