// canvas.mjs - a canvas module
// based on r2 of my canvas module from my blog post on canvas textures from threejs-canvas-texture
import { LZString }  from "../lz-string/1.4.4/lz-string.mjs"
const canvasMod = {};
//-------- ----------
// HELEPRS
//-------- ----------
// parse draw option helper
const parseDrawOption = (opt) => {
    // if opt.draw is false for any reason return DRAW.square
    if(!opt.draw){
        return DRAW.rnd;
    }
    // if a string is given assume it is a key for a built in draw method
    if(typeof opt.draw === 'string'){
        return DRAW[opt.draw];
    }
    // assume we where given a custom function
    return opt.draw;
};
// parse state data objects
const parseStateData = (canObj, opt) => {
    const data = canObj.state.data
    // all of this only applys to data strings
    if(typeof data != 'string'){
        return;
    }
    // plain data string ex '0,0,0,0,0,0,0,0'
    if(opt.dataParse === 'string'){
        canObj.state.data = data.split(',');
        return;
    }
    // try to use LZString if it is there
    if(opt.dataParse === 'lzstring'){
        try{
           const str = LZString.decompress(data);
           canObj.state.data = str.split(',');
           return;
        }catch(e){
           console.log('some error with lz-string.js');
           console.log(e);
        }
    }
    // try to use LZString if it is there base64 style
    if(opt.dataParse === 'lzstring64'){
       try{
           const str = LZString.decompressFromBase64(data);
           canObj.state.data = str.split(',');
           return;
       }catch(e){
           console.log('some error with lz-string.js');
           console.log(e);
       }
    }
};
// draw grid helper for built in draw methods 'grid_palette' and 'rnd'
const draw_grid_fill = (ctx, canvas, iw, ih, getColor) => {
    getColor = getColor || function(color){ return color };
    const len = iw * ih;
    const pxW = canvas.width / iw;
    const pxH = canvas.height / ih;
    let i = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while(i < len){
        const x = i % iw;
        const y = Math.floor(i / iw);
        ctx.fillStyle = getColor(x, y, i);
        const px = x * pxW;
        const py = y * pxH;
        ctx.fillRect(px, py, pxW, pxH);
        i += 1;
    }
};
//-------- ----------
// built in draw methods
//-------- ----------
const DRAW = {};
// draw a grid with palette data
DRAW.grid_palette = (canObj, ctx, canvas, state) => {
    const w =  state.w === undefined ? 16 : state.w;
    const h =  state.h === undefined ? 16 : state.h;
    const data = state.data || [];
    const len = w * h;
    const pxW = canObj.size / w;
    const pxH = canObj.size / h;
    draw_grid_fill(ctx, canvas, w, h, function(x, y, i){
        const ci = data[i];
        return canObj.palette[ci];
    });
};
// random using palette colors
DRAW.rnd = (canObj, ctx, canvas, state) => {
    let i = 0;
    const gSize =  state.gSize === undefined ? 5 : state.gSize;
    const len = gSize * gSize;
    const pxSize = canObj.size / gSize;
    draw_grid_fill(ctx, canvas, gSize, gSize, function(x, y, i){
        const ci = Math.floor( canObj.palette.length * Math.random() );
        return canObj.palette[ci];
    });
};
//-------- ----------
// PUBLIC API
//-------- ----------
// create and return a canvas texture
canvasMod.create = function (opt) {
    opt = opt || {};
    // create canvas, get context, set size
    const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d', { willReadFrequently: true } );
    opt.size = opt.size === undefined ? 16 : opt.size;
    opt.dataParse = opt.dataParse || 'string'; // parse data strings into arrays 
    canvas.width = opt.size;
    canvas.height = opt.size;
    // create canvas object
    const canObj = {
        texture: null,
        texture_data: null,
        update_mode: opt.update_mode || 'canvas',
        size: opt.size,
        canvas: canvas, 
        ctx: ctx,
        palette: opt.palette || ['black', 'white'],
        state: opt.state || {},
        draw: parseDrawOption(opt)
    };
    // parse data strings into arrays
    parseStateData(canObj, opt);
    // update for first time
    canvasMod.update(canObj);
    return canObj;
};
// update
const UPDATE = {};
// update canvas only update mode
UPDATE.canvas = (canObj) => {
    // update canvas texture
    canObj.draw.call(canObj, canObj, canObj.ctx, canObj.canvas, canObj.state);
};
canvasMod.update = (canObj) => {
    UPDATE[canObj.update_mode](canObj);
};
export { canvasMod };