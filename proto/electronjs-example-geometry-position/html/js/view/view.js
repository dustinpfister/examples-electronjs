// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
// ---------- ----------
// 2D CANVAS ELEMENT
// ---------- ----------
const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
// ---------- ----------
// SCENE, CAMERA, RENDERER
// ---------- ----------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(canvas.width, canvas.height, false);
// ---------- ----------
// STATE OBJECT TO ATTACH TO WINDOW
// ---------- ----------
const state = window.state = {
    scene: scene,
    x: 0, y: 0
};

scene.add( new THREE.GridHelper(10, 10) );

const draw = state.draw = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderer.render(scene, camera);
    ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white';
    ctx.fillText(state.x + ',' + state.y, 10, 10);
};

camera.position.set( 5, 5, 5 );
camera.lookAt( 0, 0, 0 );
draw();

canvas.addEventListener('pointerdown', (e) => {
    state.x = e.clientX;
    state.y = e.clientY;
    draw();
})
