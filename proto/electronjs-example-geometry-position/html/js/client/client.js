// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { VertexNormalsHelper } from 'VertexNormalsHelper';
import { Cursor } from 'cursor';
import { json_tools } from 'json_tools';
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
// update the JSON output
const updateJSON = app.updateJSON = () => {
    const scene_export = new THREE.Scene();
    //!!! just exporting the current object only for now
    if(app.current_object){
        scene_export.add( app.current_object.clone() );
    }
   const json = json_tools.format_scene_export(scene_export, 'custom', 2);
   app.el_json.value = json;

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
// crate a cursor object
const createCursorSprite = (app) => {
    return json_tools.loadSceneFromJSON('json/scene_2_cursor.json')
    .then( (sprite) => {
        const s = 0.07;
        sprite.scale.set( s, s, s);
        sprite.position.copy( app.cursor );
        return sprite;
    });
};
// create a scene object
const createScene = () => {
/*
   return json_tools.createScene({
        geoType: 'BoxGeometry',
        geoArgu: [ 2, 2, 2, 4, 4, 4],
        matOpt: { size: 0.5, color: 0xff0000 },
        nonIndexed: true
    });
*/
    return json_tools.loadSceneFromJSON( 'json/scene_3_points.json' );
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
    // set current object to first child if there is one. if no child create points
    app.current_object = app.scene.children[0] || new THREE.Points();
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
        Cursor.update(app, app.cursor);
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

    app.orbit = new OrbitControls(app.camera, app.canvas);

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

        console.log(v_pos);

        //Cursor.update(app, v_pos );

        if (!app.user_input) {
            updateJSON();
        }
    });
    //app.camera.position.set(2.7, 1.5, 5);
    //app.camera.lookAt(0, 0, 0);
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
sm.states.init = (sm) => {
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
                    app.camera.position.set(5, 5, 5);
                    app.camera.lookAt(0, 0, 0);
                    sm.current = 'run';
                });
            }
        }
    }
};
sm.states.run = (sm) => {
    const app = sm.app;
    app.orbit.update();
    app.draw();
};
const loop = function () {
    const now = new Date();
    const secs = (now - sm.lt) / 1000;
    requestAnimationFrame(loop);
    if (secs >= 1 / sm.fps) {
        sm.states[sm.current](sm);
        sm.lt = now;
    }
};
window.addEventListener('load', () => {
    console.log('client.js onload event fired, starting loop');
    loop();
    //!!! I might have to do this to help with the 'iframe load slow' bug
    //setTimeout(loop, 2000)
});
