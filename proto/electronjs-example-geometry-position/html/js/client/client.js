// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const START_SCENE = `
{
    "metadata": {
        "version": 4.5,
        "type": "Object",
        "generator": "Object3D.toJSON"
    },
    "geometries": [
        {
            "uuid": "030169bb-efe4-43cf-a24e-9b45045a6388",
            "type": "BufferGeometry",
            "data": {
                "attributes": {
                    "position": {
                        "itemSize": 3,
                        "type": "Float32Array",
                        "array": [0,0,0,0,1,0,0,0,1],
                        "normalized": false
                    }
                },
                "index": {
                    "type": "Uint16Array",
                    "array": [0,2,1]
                },
                "boundingSphere": {
                    "center": [
                        0,
                        0.5,
                        0.5
                    ],
                    "radius": 0.7071067811865476
                }
            }
        }
    ],
    "materials": [
        {
            "uuid": "2ffd6b11-b527-4301-8b7c-1635714e5d0c",
            "type": "MeshBasicMaterial",
            "color": 16777215,
            "reflectivity": 1,
            "refractionRatio": 0.98,
            "side": 1,
            "depthFunc": 3,
            "depthTest": true,
            "depthWrite": true,
            "colorWrite": true,
            "stencilWrite": false,
            "stencilWriteMask": 255,
            "stencilFunc": 519,
            "stencilRef": 0,
            "stencilFuncMask": 255,
            "stencilFail": 7680,
            "stencilZFail": 7680,
            "stencilZPass": 7680
        }
    ],
    "object": {
        "uuid": "c0338dfe-9212-43ff-b125-4db913944a4c",
        "type": "Scene",
        "layers": 1,
        "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        "up": [
            0,
            1,
            0
        ],
        "children": [
            {
                "uuid": "ae13731a-12df-4c1b-8022-0121fba89347",
                "type": "Mesh",
                "layers": 1,
                "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
                "up": [
                    0,
                    1,
                    0
                ],
                "geometry": "030169bb-efe4-43cf-a24e-9b45045a6388",
                "material": "2ffd6b11-b527-4301-8b7c-1635714e5d0c"
            }
        ]
    }
}
`;


// ---------- ----------
// REFS TO VIEW IFRAME, and TEXT JSON
// ---------- ----------
const frame_view = document.getElementById('frame_view');
const text_json = document.getElementById('text_json');
// ---------- ----------
// MAIN STATE OBJECT
// ---------- ----------
const state = window.state = {
    canvas: null,
    ctx: null,

    cursor: new THREE.Vector3(1,2,3),

    view: null,


    scene: null,
    camera: null,
    renderer: null,
    //object: null,
    user_input: false,
    orbit: null,
    x: 0, y: 0
};
// ---------- ----------
// HELPERS
// ---------- ----------
// update json text
const replacer = function(key, value){
   if( key === ""){
       return value;
   }
   if( key === "matrix" ){
       return 'REPLACE_ARR_OPEN' + value.toString() + 'REPLACE_ARR_CLOSE';
   }
   // !!! this can be used to do what I would like in terms of spacing
   if( key === "itemSize" ){
       //console.log(value);
   }
   if( key === "array" ){
       return 'REPLACE_ARR_OPEN' + value.toString() + 'REPLACE_ARR_CLOSE';
   }
   return value;
};
// update the JSON output
const updateJSON = () => {
    // CUSTOM REPLACER AND SPACING
    const str_raw = JSON.stringify( state.scene.toJSON(), replacer, 4 );
    text_json.value = str_raw
    .replace(/"REPLACE_ARR_OPEN/g, '[')
    .replace(/REPLACE_ARR_CLOSE"/g, ']');
    // NULL REPLACER AND SPACING
    //text_json.value = JSON.stringify( state.scene.toJSON(), null, 4 );
    // JUST SERIALIZE
    //text_json.value = JSON.stringify( state.scene.toJSON());
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
const createScene = () => {
    // start scene with blank geometry and Points Material
    const scene = new THREE.Scene();
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial();
    const points = new THREE.Points(geometry, material);
    scene.add( points );
    return scene;

    // start scene with hard coded JSON
    //return new THREE.ObjectLoader().parse( JSON.parse( START_SCENE ) );
/*
    // child objects
    const scene = new THREE.Scene();
    const material = new THREE.MeshBasicMaterial({ 
        side: THREE.DoubleSide
    });
    // start geometry
    const geometry = new THREE.BufferGeometry().copy(new THREE.BoxGeometry( 1, 1, 1 ));
    //const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //const geometry = new THREE.BufferGeometry();
    // start points
    //const data_pos = [0,0,0, 0,1,0, 0,0,1];
    //geometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array(data_pos), 3 ) );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
    return scene;
*/
};
// setup scene with new/updated object
const updateScene = (state, obj3d) => {
    state.scene = !state.scene ? createScene() : state.scene;
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
        state.scene.matrix.copy( obj3d.matrix );
        state.scene.position.setFromMatrixPosition(state.scene.matrix);
        //state.scene.applyMatrix4( obj3d.matrix );
    }else{
        // any other kind of object just add it as a child
        state.scene.add(object3d);
    }
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
    state.camera.position.set( 2, 2, 2 );
    state.camera.lookAt( 0, 0, 0 );
    updateScene(state, createScene() );
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
    // document wide handlers
    document.addEventListener('drag', ( e ) => {
    });
    document.addEventListener('dragstart', ( e ) => {
        el_drag = e.target;
    });
    document.addEventListener('dragend', ( e ) => {
        el_drag = null;
    });
    document.addEventListener('dragover', ( e ) => {
        event.preventDefault();
    });
    document.addEventListener('dragenter', ( e ) => {
    });
    document.addEventListener('dragleave', ( e ) => {});
    // handler for drag start
    text_json.addEventListener('dragstart', ( e ) => {
        e.preventDefault();
    });
    // attach handlers for each slot div
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
// CURSOR
// ---------- ----------
const input_pos = document.getElementById('input_cursor_pos');
const input_push = document.getElementById('input_cursor_push');
// on input event for pos text input for cursor string
input_pos.addEventListener('input', (e) => {
    const str_pos = e.target.value;
    const arr = str_pos.split(',');
    state.cursor.fromArray(arr);
    console.log(state.cursor);
});
// on click event for push
input_pos.addEventListener('click', (e) => {
   
});
// ---------- ----------
// MAIN APP LOOP
// ---------- ----------
const sm = {
   current: 'init',
   fps: 20,
   lt: new Date(),
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
            // set value of input element to array of Vector3 cursor
            input_pos.value = state.cursor.toArray();

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
    const now = new Date();
    const secs = ( now - sm.lt ) / 1000;
    requestAnimationFrame(loop);
    if(secs >= 1 / sm.fps){
        sm.states[sm.current]();
        sm.lt = now;
    }
};

window.addEventListener('load', () => {
    console.log('client.js onload event fired, starting loop');
    loop();
    //!!! I might have to do this to help with the 'iframe load slow' bug
    //setTimeout(loop, 2000)
});


