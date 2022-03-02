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
        ctx.fillStyle = style || 'white';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
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
        // eye and mouth color
        ctx.fillStyle = 'black';
        // eyes
        ctx.fillRect(8, 16, 16, 16);
        ctx.fillRect(40, 16, 16, 16);
        // mouth
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
        ctx.fillStyle = 'black';
        // eyes
        ctx.fillRect(8, 16, 16, 16);
        ctx.fillRect(40, 16, 16, 16);
        ctx.fillStyle = 'red';
        ctx.fillRect(8 + 5, 16 + 5, 6, 6);
        ctx.fillRect(40 + 5, 16 + 5, 6, 6);
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
