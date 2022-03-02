var GuyCanvas = (function () {

    var api = {};

    // a default draw method for a canvas object
    var DRAW_DEFAULT = function (ctx, canvas, state) {
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.fillRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
        ctx.strokeStyle = '#00ff00';
        ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
    };
    // just draw a solid color background
    var drawBackground = (ctx, canvas, style) => {
        ctx.fillStyle = style || 'gray';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
    };

    var drawEye = function(ctx, x, y){
        ctx.fillStyle = 'black';
        // base eye area
        ctx.fillRect(x, y, 16, 16);
        // pupils
        ctx.fillStyle = '#884400';
        ctx.fillRect(x + 5, y + 5, 8, 8);
        ctx.fillStyle = 'black';
        ctx.fillRect(x + 7, y + 7, 4, 4);
    };

    var drawGuyEyes = function(ctx, canvas, sm, opt){
        drawEye(ctx, 8, 16);
        drawEye(ctx, 40, 16);
    };

    // draw methods
    var DRAW_METHODS = {};
    // face draw methods
    DRAW_METHODS.face = {};

    DRAW_METHODS.face.plain = (ctx, canvas, sm, opt) => {
        // mouth percent option
        opt.mouthPer = opt.mouthPer === undefined ? 0 : opt.mouthPer;
        // solid color background
        drawBackground(ctx, canvas, 'white');
        // eyes
        drawGuyEyes(ctx, canvas, sm, opt);
        // mouth
        ctx.fillStyle = 'black';
        var mw = 25,
        mh = 8;
        ctx.fillRect(32 - mw / 2, 40, mw, mh);
    };

    // talk face
    DRAW_METHODS.face.talk = (ctx, canvas, sm, opt) => {
        // mouth percent option
        opt.mouthPer = opt.mouthPer === undefined ? 0 : opt.mouthPer;
        // solid color background
        drawBackground(ctx, canvas, 'white');
        // eye and mouth color
        drawGuyEyes(ctx, canvas, sm, opt); 
        // mouth
        ctx.fillStyle = 'black';
        var mw = 25 - 8 * opt.mouthPer,
        mh = 8 + 8 * opt.mouthPer;
        ctx.fillRect(32 - mw / 2, 40, mw, mh);
    };

    // create and return a canvas texture
    api.createCanvasObject = function (sm, drawMethods) {
        drawMethods = drawMethods || DRAW_METHODS;
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var canvasObj = {
            texture: texture,
            canvas: canvas,
            ctx: ctx,
            sm: sm,
            draw: function(opt){
                opt = opt || {};
                opt.drawClass = opt.drawClass || 'face';
                opt.drawMethod = opt.drawMethod || 'plain';
                var drawFunc = drawMethods[opt.drawClass][opt.drawMethod];
                drawFunc.call(sm, ctx, canvas, sm, opt);
                texture.needsUpdate = true;
            }
        };
        canvasObj.draw();
        return canvasObj;
    };

    // return public api
    return api;

}
    ());
