// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { VertexNormalsHelper } from 'VertexNormalsHelper';
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
    app.draw();
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
    app.updateJSON();
    app.draw();
};
// ---------- ----------
// CURSOR EVENTS
// ---------- ----------
// on input event for pos text input for cursor string
input_pos.addEventListener('input', (e) => {
});
input_pos.addEventListener('change', (e) => {
    Cursor.setFromString(app, e.target.value);
});
// on click event for push function
input_push.addEventListener('click', (e) => {
    Cursor.pushToPosition(app);
});

export { Cursor }