// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { VertexNormalsHelper } from 'VertexNormalsHelper';
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
    cursor: new THREE.Vector3(0, 0, 0),
    view: null,
    scene: null,
    current_object: null, // the current object that is begin worked on
    camera: null,
    renderer: null,
    user_input: false,
    orbit: null,
    x: 0,
    y: 0
};
// ---------- ----------
// HELPERS
// ---------- ----------
// update json text
const replacer = function (key, value) {
    if (key === "") {
        return value;
    }
    if (key === "matrix") {
        return 'REPLACE_ARR_OPEN' + value.toString() + 'REPLACE_ARR_CLOSE';
    }
    // !!! this can be used to do what I would like in terms of spacing
    if (key === "itemSize") {
        //console.log(value);
    }
    if (key === "array") {
        return 'REPLACE_ARR_OPEN' + value.toString() + 'REPLACE_ARR_CLOSE';
    }
    return value;
};
// update the JSON output
const updateJSON = () => {
    // clean export scene object
    const scene_export = new THREE.Scene();
    //!!! just exporting the current object only for now
    if(state.current_object){
        scene_export.add( state.current_object.clone() );
    }
    // CUSTOM REPLACER AND SPACING
    const str_raw = JSON.stringify(scene_export.toJSON(), replacer, 4);
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
// load a JOSN file, returns a promise
const loadJSON = ( url = 'json/scene_1_box.json' ) => {
    return new Promise( (resolve, reject) => {
        const loader = new THREE.ObjectLoader();
        loader.load(url, (obj) => {
            resolve(obj);
        });
    });
};
// crate a cursor object
const createCursorSprite = (state) => {
    // canvas texture for cross hairs
/*
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = 32, h = 32;
    canvas.width = w; canvas.height = h;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo( 0, 0);
    ctx.lineTo( w, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo( w, 0);
    ctx.lineTo( 0, h);
    ctx.stroke();
    const texture = new THREE.CanvasTexture( canvas );
    // the material for the sprite
    const material = new THREE.SpriteMaterial({
        map: texture,
        sizeAttenuation: false,
        depthTest: false,
        transparent: true,
        opacity: 1
    });
    const sprite = new THREE.Sprite(  material );
  //console.log( JSON.stringify( sprite.toJSON()) );
*/

    return loadJSON('json/scene_2_cursor.json')
    .then( (sprite) => {
        const s = 0.07;
        sprite.scale.set( s, s, s);
        sprite.position.copy( state.cursor );
        return sprite;
    });
};
// create a scene object
const createScene = () => {
    // start scene with blank geometry and Points Material
    /*
    const scene = new THREE.Scene();
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial();
    const points = new THREE.Points(geometry, material);
    scene.add( points );
    return scene;
     */
    // start scene with hard coded JSON
    //return new THREE.ObjectLoader().parse(JSON.parse(START_SCENE));
    return loadJSON();
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
    state.scene = !state.scene ? new THREE.Scene() : state.scene;
    // remove and children
    let i = state.scene.children.length;
    while (i--) {
        const child = state.scene.children[i];
        child.removeFromParent()
    }
    if (obj3d.type === 'Scene') {
        obj3d.children.forEach((child) => {
            state.scene.add(child);
        });
        state.scene.matrix.copy(obj3d.matrix);
        state.scene.position.setFromMatrixPosition(state.scene.matrix);
        //state.scene.applyMatrix4( obj3d.matrix );
    } else {
        // any other kind of object just add it as a child
        state.scene.add(obj3d);
    }
    // set current object to first child if there is one, else scene?
    state.current_object = state.scene.children[0] || state.scene;
    // add grid helper
    const grid = new THREE.GridHelper(10, 10);
    state.scene.add(grid);
    // add normals helper
    if(state.current_object.type === 'Mesh'){
        const helper = new VertexNormalsHelper( state.current_object );
        state.scene.add(helper);
    }
    // light
    const dl = new THREE.DirectionalLight( 0xffffff, 1 );
    dl.position.set(3, 2, 1);
    state.scene.add(dl);
    // cursor
    createCursorSprite(state)
    .then( (sprite) => {
        state.scene.add(sprite);
        // update json and draw for first time
        updateJSON();
        draw()
    });
};
// update scene from JSON
const updateSceneFromJSON = (state, str_json ) => {
    const obj = JSON.parse(str_json);
    const obj3d = new THREE.ObjectLoader().parse( obj );
    updateScene(state, obj3d);
};
// setup is to be called when the view is ready
const setup = () => {
    state.camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
    state.renderer = new THREE.WebGL1Renderer();
    state.renderer.setSize(state.canvas.width, state.canvas.height, false);
    state.canvas.addEventListener('pointerdown', (e) => {
        state.x = e.clientX;
        state.y = e.clientY;
        if (!state.user_input) {
            updateJSON();
        }
    });
    state.orbit = new OrbitControls(state.camera, state.canvas);
    state.camera.position.set(2.7, 1.5, 5);
    state.camera.lookAt(0, 0, 0);
    
    return createScene()
    .then( (scene) => {
        updateScene(state, scene);
    });
};
// ---------- ----------
// EVENTS
// ---------- ----------
text_json.addEventListener('input', (e) => {
    state.user_input = true;
});
text_json.addEventListener('blur', (e) => {
    updateSceneFromJSON( state, e.target.value );
    state.user_input = false;
});
// ---------- ----------
// DRAG AND DROP
// ---------- ----------
{
    const slots = document.querySelectorAll('.slot');
    let el_drag = null;
    // document wide handlers
    document.addEventListener('drag', (e) => {});
    document.addEventListener('dragstart', (e) => {
        el_drag = e.target;
    });
    document.addEventListener('dragend', (e) => {
        el_drag = null;
    });
    document.addEventListener('dragover', (e) => {
        event.preventDefault();
    });
    document.addEventListener('dragenter', (e) => {});
    document.addEventListener('dragleave', (e) => {});
    // handler for drag start
    text_json.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
    // attach handlers for each slot div
    Array.prototype.forEach.call(slots, (slot) => {
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            const slot = e.currentTarget;
            slot.style.opacity = 1;
            console.log(slot.children);
            console.log(el_drag);
        });
        slot.addEventListener('dragenter', (e) => {
            const slot = e.currentTarget;
            slot.style.opacity = 0.25;
        });
        slot.addEventListener('dragleave', (e) => {
            const slot = e.currentTarget;
            slot.style.opacity = 1;
        });
    });
}
// ---------- ----------
// CURSOR
// ---------- ----------
const Cursor = {};
// parse a string value and set the value of the cursor
Cursor.parseString = (state, string = '0,0,0') => {
    const arr_str = string.split(',');
    const arr = [];
    arr[0] = parseFloat(arr_str[0]) || 0;
    arr[1] = parseFloat(arr_str[1]) || 0;
    arr[2] = parseFloat(arr_str[2]) || 0;
    state.cursor.fromArray(arr);
};
// push the cursor state to the position attribute of the current object
Cursor.pushToPosition = (state) => {
    if (!state.current_object) {
        return;
    }
    // check state.current_object if it has a geometry
    const geometry = state.current_object.geometry;
    if (!geometry) {
        return;
    }
    // check if the geometry has a pos attribute
    // if it does not have one create a new one
    let pos = geometry.getAttribute('position');
    let data = [];
    if (pos) {
        data = Array.from(pos.array);
    }
    // push current cursor value
    const v = state.cursor;
    data.push(v.x, v.y, v.z);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data), 3));
    updateJSON();
    draw();
};

const input_pos = document.getElementById('input_cursor_pos');
const input_push = document.getElementById('input_cursor_push');
// on input event for pos text input for cursor string
input_pos.addEventListener('input', (e) => {
    Cursor.parseString(state, e.target.value);
    updateSceneFromJSON( state, text_json.value);
});
// on click event for push function
input_push.addEventListener('click', (e) => {
    Cursor.pushToPosition(state);
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
    if (frame_view.contentWindow.state) {
        state.view = frame_view.contentWindow.state;
        if (state.view.ready) {
            state.canvas = state.view.canvas;
            state.ctx = state.view.ctx;
            setup()
            .then( ()=> {
                sm.current = 'run';
                // set value of input element to array of Vector3 cursor
                input_pos.value = state.cursor.toArray();
            });
        }
    } else {
        console.log('OKAY YEAH NOT READY!');
    }
};
sm.states.run = () => {
    state.orbit.update();
    state.draw();
};
const loop = function () {
    const now = new Date();
    const secs = (now - sm.lt) / 1000;
    requestAnimationFrame(loop);
    if (secs >= 1 / sm.fps) {
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
