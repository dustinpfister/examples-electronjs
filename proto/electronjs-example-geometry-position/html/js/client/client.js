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
    pointer: new THREE.Vector2(),
    raycaster: new THREE.Raycaster()
};
// ---------- ----------
// HELPERS
// ---------- ----------

const createReplacer = () => {
    let item_size = 1;
    let int = false;
    return function (key, value) {
        if (key === "") {
            return value;
        }
        if (key === "matrix") {
            return 'REPLACE_ARR_OPEN' + value.toString() + 'REPLACE_ARR_CLOSE';
        }
        // set item size
        if( key === 'index'){
            item_size = 3;
            int = true;
        }
        if (key === "itemSize") {
            item_size =  parseInt(value);
        }
        if( key === 'type'){
            int = false;
            if( value === 'Uint16Array' || value === 'Uint8Array'){
                int = true;
            }
        }
        // format array
        if (key === "array") {
            let i = 0;
            let str_arr = '';
            const len = value.length;
            while(i < len){
                let d = 0;
                if(i % 4 === 0){
                    str_arr += 'REPLACE_EOL';
                }
                while(d < item_size){
                    const i2 = i + d;
                    const n = value[ i + d ];
                    const left = n < 0 ? '' : ' ';
                    const right =  i2 >= len - 1 ? '' : ',';
                    let val = n.toFixed(2);
                    if(int){
                        val = parseInt(n);
                    }
                    str_arr += left + val + right;
                    d += 1;
                }
                str_arr += ' ';
                i += item_size;
            }
            return 'REPLACE_ARR_OPEN' + str_arr + 'REPLACE_ARR_CLOSE';
        }
        return value;
    };
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
    const str_raw = JSON.stringify(scene_export.toJSON(), createReplacer(), 4);
    text_json.value = str_raw
        .replace(/REPLACE_EOL/g, '\n')
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
    ctx.fillText('pointer: ' + state.pointer.x + ',' + state.pointer.y, 10, 10);
    // raycaster
    const ray = state.raycaster.ray;
    const v1 = ray.origin;
    const v2 = ray.direction;
    ctx.fillText('ray_origin: ' + v1.x.toFixed(2) + ',' + v1.y.toFixed(2) + ',' + v1.z.toFixed(2), 10, 20);
    ctx.fillText('ray_dir   : ' + v2.x.toFixed(2) + ',' + v2.y.toFixed(2) + ',' + v2.z.toFixed(2), 10, 30);
};
// load a JOSN file, returns a promise
const loadJSON = ( url = 'json/scene_3_points.json' ) => {
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
        if(state.current_object.geometry.getAttribute('normal')){
            const helper = new VertexNormalsHelper( state.current_object );
            state.scene.add(helper);
        }
    }
    // light
    const dl = new THREE.DirectionalLight( 0xffffff, 1 );
    dl.position.set(3, 2, 1);
    state.scene.add(dl);
    // cursor
    createCursorSprite(state)
    .then( (sprite) => {
        sprite.name = 'cursor';
        state.scene.add( sprite );
        // update json and draw for first time
        updateJSON();
        draw();
    });
};
// update scene from JSON
const updateSceneFromJSON = (state, str_json ) => {
    const obj = JSON.parse(str_json);
    const obj3d = new THREE.ObjectLoader().parse( obj );
    updateScene(state, obj3d);
};
// get a point using raycaster in state.current_object using state.pointer
/*
const getRayPoint = (state) => {
    const object = state.current_object;
    const v = new THREE.Vector3();
    // what to do if no object
    if(!object){
        return v;
    }
    // use distance from camera as a way to set threshold
    const d = state.camera.position.distanceTo( object.position );
    state.raycaster.params.Points.threshold = d;
    // check for intersection and copy point of interset object 0
    const intersects = state.raycaster.intersectObject( object );
    if(intersects.length >= 1){
        v.copy( intersects[0].point );
    }
    return v;
};
*/
// loop over points of the position attribute, and return the index that is near the given vector3
/*
const getPositonIndexNear = ( geometry, v3 ) => {
    const pos = geometry.getAttribute('position');
    if(!pos){
        return null;
    }
    let pos_index = 0;
    let dist_high = Infinity;
    let i = 0;
    while(i < pos.count){
        const v = new THREE.Vector3( pos.getX(i), pos.getY(i), pos.getZ(i) );
        const d = v.distanceTo( v3 );
        if(d < dist_high){
            dist_high = d;
            pos_index = i;
        }
        i += 1;
    }
    return pos_index;
};
*/
const getPositionIndexNearRay = ( state, geometry ) => {
    const pos = geometry.getAttribute('position');
    if(!pos){
        return null;
    }
    let pos_index = 0;
    let dist_high = Infinity;
    let i = 0;
    while(i < pos.count){
        const v_pos = new THREE.Vector3( pos.getX(i), pos.getY(i), pos.getZ(i) );
        const v_onray = new THREE.Vector3();
        state.raycaster.ray.closestPointToPoint( v_pos, v_onray );  //v.distanceTo( v3 );
        const d = v_onray.distanceTo( v_pos );
        if(d < dist_high){
            dist_high = d;
            pos_index = i;
        }
        i += 1;
    }
    return pos_index;
};

// setup is to be called when the view is ready
const setup = () => {
    state.camera = new THREE.PerspectiveCamera(45, 320 / 240, 0.1, 1000);
    state.renderer = new THREE.WebGL1Renderer();
    state.renderer.setSize(state.canvas.width, state.canvas.height, false);


    state.canvas.addEventListener('pointerdown', (e) => {
        state.pointer.set( e.clientX, e.clientY );

        const geometry = state.current_object.geometry;
        const pos = geometry.getAttribute('position');

        // use distance from camera as a way to set threshold
        const object = state.current_object;
        const d = state.camera.position.distanceTo( object.position );
        state.raycaster.params.Points.threshold = d;


        const mouse = new THREE.Vector2( 0, 0 );
        const canvas = state.canvas;
        mouse.x = ( state.pointer.x / canvas.scrollWidth ) * 2 - 1;
        mouse.y = - ( state.pointer.y / canvas.scrollHeight ) * 2 + 1;
        state.raycaster.setFromCamera( mouse, state.camera );

        //const v = getRayPoint(state);
        //console.log(v);
        
        //const i = getPositonIndexNear(geometry, v);


        const i = getPositionIndexNearRay(state, geometry);

        // once we have a position index...
        const v_pos = new THREE.Vector3( pos.getX(i), pos.getY(i), pos.getZ(i) );
        console.log(i, v_pos);
        const sprite = state.scene.getObjectByName('cursor');
        state.cursor.copy( v_pos );
        sprite.position.copy( state.cursor );
        draw();

        
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
    states: {},
    setup_call: false
};
sm.states.init = () => {
    if (frame_view.contentWindow.state) {
        state.view = frame_view.contentWindow.state;
        if (state.view.ready) {
            state.canvas = state.view.canvas;
            state.ctx = state.view.ctx;
            if(!sm.setup_call){
                sm.setup_call = true;
                setup()
                .then( ()=> {
                    sm.current = 'run';
                    // set value of input element to array of Vector3 cursor
                    input_pos.value = state.cursor.toArray();
                });
            }
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
