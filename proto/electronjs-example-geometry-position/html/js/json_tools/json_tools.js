// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
// ---------- ----------
// CUSTOM REPLACER FUNCTION
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
        if (key === 'index') {
            item_size = 3;
            int = true;
        }
        if (key === "itemSize") {
            item_size = parseInt(value);
        }
        if (key === 'type') {
            int = false;
            if (value === 'Uint16Array' || value === 'Uint8Array') {
                int = true;
            }
        }
        // format array
        if (key === "array") {
            let i = 0;
            let str_arr = '';
            const len = value.length;
            while (i < len) {
                let d = 0;
                if (i % 4 === 0) {
                    str_arr += 'REPLACE_EOL';
                }
                while (d < item_size) {
                    const i2 = i + d;
                    const n = value[i + d];
                    const left = n < 0 ? '' : ' ';
                    const right = i2 >= len - 1 ? '' : ',';
                    let val = n.toFixed(2);
                    if (int) {
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

const json_tools = {};

// format an scene_export object
json_tools.format_scene_export = ( scene_export = new THREE.Scene(), format = 'custom', spacing = 4 ) => {
    // 'custom' formating
    if(format === 'custom'){
        const str_raw = JSON.stringify(scene_export.toJSON(), createReplacer(), spacing);
        return str_raw
            .replace(/REPLACE_EOL/g, '\n')
            .replace(/"REPLACE_ARR_OPEN/g, '[')
            .replace(/REPLACE_ARR_CLOSE"/g, ']');
    }
    // 'spacing' format and then 'default'
    if(format === 'spacing'){
        return JSON.stringify( app.scene.toJSON(), null, spacing );
    }
    return JSON.stringify( app.scene.toJSON() );
};

json_tools.loadJSON = ( url = 'json/scene_0_blank.json' ) => {
    return new Promise( (resolve, reject) => {
        const loader = new THREE.ObjectLoader();
        loader.load(url, (obj) => {
            resolve(obj);
        });
    });
};

export { json_tools }
