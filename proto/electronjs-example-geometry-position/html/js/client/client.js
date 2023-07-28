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
// MAIN STATE OBJECT
// ---------- ----------
const state = window.state = {
    view: null,
    canvas: null,
    ctx: null,
    scene: null,
    camera: null,
    renderer: null,
    object: null,
    user_input: false,
    orbit: null,
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
// setup scene with new/updated object
const updateScene = (state, obj3d) => {
    state.scene = !state.scene ? new THREE.Scene(): state.scene;
    // remove and children
    let i = state.scene.children.length;
    while(i--){
        const child = state.scene.children[i];
        child.removeFromParent()
    }
    if(obj3d.type === 'Scene'){
        obj3d.children.forEach( (child) => {
            state.scene.add(child);
        });
    }else{
        // any other kind of object just add it as a child
        state.scene.add(object3d);
    }
    // add a grid helper
    //state.scene.add( new THREE.GridHelper(10, 10) );
    updateJSON();
    draw();
};
// setup is to be called when the view is ready
const setup = () => {
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
    const scene = new THREE.Scene();
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    //const geometry = new THREE.BufferGeometry().copy(new THREE.BoxGeometry( 1, 1, 1 ));
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
    //scene.add( new THREE.GridHelper(10, 10) );
    updateScene(state, scene)

    // update and draw for first time
    //updateJSON();
    //draw();
};
// ---------- ----------
// EVENTS
// ---------- ----------
text_json.addEventListener('input', (e) => {
    state.user_input = true;
});
text_json.addEventListener('blur', (e) => {
    const str_json = e.target.value;
    const obj = JSON.parse( str_json );
    const obj3d = new THREE.ObjectLoader().parse(obj);
    updateScene(state, obj3d);
    state.user_input = false;
});
// ---------- ----------
// DRAG AND DROP
// ---------- ----------
{
    const slots = document.querySelectorAll('.slot');
    let el_drag = null;
    document.addEventListener("drag", ( e ) => {});
    document.addEventListener("dragstart", ( e ) => {
        el_drag = e.target;
    });
    document.addEventListener("dragend", ( e ) => {
        el_drag = null;
    });
    document.addEventListener("dragover", ( e ) => {
        event.preventDefault();
    });
    document.addEventListener("dragenter", ( e ) => {
    });
    document.addEventListener('dragleave', ( e ) => {});
    Array.prototype.forEach.call(slots, ( slot ) => {
        slot.addEventListener('drop', ( e ) => {
            e.preventDefault();
            const slot = e.currentTarget;
            slot.style.opacity = 1;
            console.log(slot.children);
            console.log(el_drag);
        });
        slot.addEventListener('dragenter', ( e ) => {
            const slot = e.currentTarget;
            slot.style.opacity = 0.25;
        });
        slot.addEventListener('dragleave', ( e ) => {
            const slot = e.currentTarget;
            slot.style.opacity = 1;
        });
    });
}
// ---------- ----------
// MAIN APP LOOP
// ---------- ----------
const sm = {
   current: 'init',
   states: {}
};
sm.states.init = () => {
    if(frame_view.contentWindow.state){
        state.view = frame_view.contentWindow.state
        if(state.view.ready){
            console.log('Looks like the view is ready');
            state.canvas = state.view.canvas;
            state.ctx = state.view.ctx;
            setup();
            sm.current = 'run';
        }
    }else{
        console.log('OKAY YEAH NOT READY!');
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

window.addEventListener('load', () => {
    console.log('client.js onload event fired, starting loop');
    loop();
    //!!! I might have to do this to help with the 'iframe load slow' bug
    //setTimeout(loop, 2000)
});


