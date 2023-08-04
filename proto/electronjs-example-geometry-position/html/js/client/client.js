// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { VertexNormalsHelper } from 'VertexNormalsHelper';
// ---------- ----------
// MAIN STATE OBJECT
// ---------- ----------
const app = window.app = {
    // view
    el_view: document.getElementById('frame_view'),
    view: null, // the state object attached to the window of the iframe
    canvas: null,
    ctx: null,

    // json
    el_json: document.getElementById('text_json'),

    cursor: new THREE.Vector3(0, 0, 0),
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
    if(app.current_object){
        scene_export.add( app.current_object.clone() );
    }
    // CUSTOM REPLACER AND SPACING
    const str_raw = JSON.stringify(scene_export.toJSON(), createReplacer(), 4);
    app.el_json.value = str_raw
        .replace(/REPLACE_EOL/g, '\n')
        .replace(/"REPLACE_ARR_OPEN/g, '[')
        .replace(/REPLACE_ARR_CLOSE"/g, ']');
    // NULL REPLACER AND SPACING
    //app.el_json.value = JSON.stringify( app.scene.toJSON(), null, 4 );
    // JUST SERIALIZE
    //app.el_json.value = JSON.stringify( app.scene.toJSON());
};
// draw to the view canvas
const draw = app.draw = () => {
    const ctx = app.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, app.canvas.width, app.canvas.height);
    app.renderer.render(app.scene, app.camera);
    ctx.drawImage(app.renderer.domElement, 0, 0, app.canvas.width, app.canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText('pointer: ' + app.pointer.x + ',' + app.pointer.y, 10, 10);
    // raycaster
    const ray = app.raycaster.ray;
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
const createCursorSprite = (app) => {
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
        sprite.position.copy( app.cursor );
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
const updateScene = (app, obj3d) => {
    app.scene = !app.scene ? new THREE.Scene() : app.scene;
    // remove and children
    let i = app.scene.children.length;
    while (i--) {
        const child = app.scene.children[i];
        child.removeFromParent()
    }
    if (obj3d.type === 'Scene') {
        obj3d.children.forEach((child) => {
            app.scene.add(child);
        });
        app.scene.matrix.copy(obj3d.matrix);
        app.scene.position.setFromMatrixPosition(app.scene.matrix);
        //app.scene.applyMatrix4( obj3d.matrix );
    } else {
        // any other kind of object just add it as a child
        app.scene.add(obj3d);
    }
    // set current object to first child if there is one, else scene?
    app.current_object = app.scene.children[0] || app.scene;
    // add grid helper
    const grid = new THREE.GridHelper(10, 10);
    app.scene.add(grid);
    // add normals helper
    if(app.current_object.type === 'Mesh'){
        if(app.current_object.geometry.getAttribute('normal')){
            const helper = new VertexNormalsHelper( app.current_object );
            app.scene.add(helper);
        }
    }
    // light
    const dl = new THREE.DirectionalLight( 0xffffff, 1 );
    dl.position.set(3, 2, 1);
    app.scene.add(dl);
    // cursor
    createCursorSprite(app)
    .then( (sprite) => {
        sprite.name = 'cursor';
        app.scene.add( sprite );
        // update json and draw for first time
        updateJSON();
        draw();
    });
};
// update scene from JSON
const updateSceneFromJSON = (app, str_json ) => {
    const obj = JSON.parse(str_json);
    const obj3d = new THREE.ObjectLoader().parse( obj );
    updateScene(app, obj3d);
};
// get an index in the position attribute of the given geometry that is the nerset the ray of the raycaster
const getPositionIndexNearRay = ( app, geometry ) => {
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
        app.raycaster.ray.closestPointToPoint( v_pos, v_onray );
        const d = v_onray.distanceTo( v_pos );
        if(d < dist_high){
            dist_high = d;
            pos_index = i;
        }
        i += 1;
    }
    return pos_index;
};
// update raycaster
const updateRaycaster = ( app ) => {
    const mouse = new THREE.Vector2( 0, 0 );
    const canvas = app.canvas;
    mouse.x = ( app.pointer.x / canvas.scrollWidth ) * 2 - 1;
    mouse.y = - ( app.pointer.y / canvas.scrollHeight ) * 2 + 1;
    app.raycaster.setFromCamera( mouse, app.camera );
};
// setup is to be called when the view is ready
const setup = () => {
    app.camera = new THREE.PerspectiveCamera(45, 320 / 240, 0.1, 1000);
    app.renderer = new THREE.WebGL1Renderer();
    app.renderer.setSize(app.canvas.width, app.canvas.height, false);


    app.canvas.addEventListener('pointerdown', (e) => {
        app.pointer.set( e.clientX, e.clientY );

        const geometry = app.current_object.geometry;
        const pos = geometry.getAttribute('position');

        // use distance from camera as a way to set threshold
        const object = app.current_object;
        const d = app.camera.position.distanceTo( object.position );
        app.raycaster.params.Points.threshold = d;

        updateRaycaster(app);


        const i = getPositionIndexNearRay(app, geometry);

        // once we have a position index...
        const v_pos = new THREE.Vector3( pos.getX(i), pos.getY(i), pos.getZ(i) );
        Cursor.update(app, v_pos );

        if (!app.user_input) {
            updateJSON();
        }
    });
    app.orbit = new OrbitControls(app.camera, app.canvas);
    app.camera.position.set(2.7, 1.5, 5);
    app.camera.lookAt(0, 0, 0);
    return createScene()
    .then( (scene) => {
        updateScene(app, scene);
    });
};
// ---------- ----------
// EVENTS
// ---------- ----------
app.el_json.addEventListener('input', (e) => {
    app.user_input = true;
});
app.el_json.addEventListener('blur', (e) => {
    updateSceneFromJSON( app, e.target.value );
    app.user_input = false;
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
    app.el_json.addEventListener('dragstart', (e) => {
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
const input_pos = document.getElementById('input_cursor_pos');
const input_push = document.getElementById('input_cursor_push');
const Cursor = {};
// update the cursor
Cursor.update = (app, v3 = null ) => {
    if(v3){
        app.cursor.copy(v3);
    }
    const sprite = app.scene.getObjectByName('cursor');
    sprite.position.copy( app.cursor );
    input_pos.value = app.cursor.toArray();
    draw();
};
// parse a string value and set the value of the cursor
Cursor.setFromString = (app, string = '0,0,0') => {
    const arr_str = string.split(',');
    const arr = [];
    arr[0] = parseFloat(arr_str[0]) || 0;
    arr[1] = parseFloat(arr_str[1]) || 0;
    arr[2] = parseFloat(arr_str[2]) || 0;
    app.cursor.fromArray(arr);
    Cursor.update(app);
};
// push the cursor app to the position attribute of the current object
Cursor.pushToPosition = (app) => {
    if (!app.current_object) {
        return;
    }
    // check app.current_object if it has a geometry
    const geometry = app.current_object.geometry;
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
    const v = app.cursor;
    data.push(v.x, v.y, v.z);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data), 3));
    updateJSON();
    draw();
};
// ---------- ----------
// CURSOR EVENTS
// ---------- ----------
// on input event for pos text input for cursor string
input_pos.addEventListener('input', (e) => {
    Cursor.setFromString(app, e.target.value);
});
// on click event for push function
input_push.addEventListener('click', (e) => {
    Cursor.pushToPosition(app);
});
// ---------- ----------
// MAIN APP LOOP
// ---------- ----------
const sm = {
    app: app,
    current: 'init',
    fps: 20,
    lt: new Date(),
    states: {},
    setup_call: false
};
sm.states.init = () => {
    const app = sm.app;
    const el_view = app.el_view;
    if (el_view.contentWindow.state) {
        app.view = el_view.contentWindow.state;
        if (app.view.ready) {
            app.canvas = app.view.canvas;
            app.ctx = app.view.ctx;
            if(!sm.setup_call){
                sm.setup_call = true;
                setup()
                .then( ()=> {
                    sm.current = 'run';
                    // set value of input element to array of Vector3 cursor
                    input_pos.value = app.cursor.toArray();
                });
            }
        }
    } else {
        console.log('OKAY YEAH NOT READY!');
    }
};
sm.states.run = () => {
    const app = sm.app;
    app.orbit.update();
    app.draw();
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
