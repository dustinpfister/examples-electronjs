var CanvasMod = (function () {

    var api = {};

    // just draw a solid color background
    var drawBackground = (ctx, canvas, style) => {
        ctx.fillStyle = style || 'gray';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
    };

    // draw methods
    var DRAW_METHODS = {};
    // hat draw methods
    DRAW_METHODS.def = {};
    // scripts default draw method
    DRAW_METHODS.def.stripes = (ctx, canvas, sm, opt) => {
        drawBackground(ctx, canvas, 'white');
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 6;
        var i = 0,
        len = 6, y;
        while(i < len){
            y = canvas.height / len * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            i += 1;
        }
    };
    DRAW_METHODS.def.randomGrid = (ctx, canvas, sm, opt) => {
        var w = 60,
        h = 60,
        pxW = canvas.width / w,
        pxH = canvas.height / h, 
        i = w * h, x, y;
        while(i--){
            x = i % w;
            y = Math.floor(i / w);
            ctx.fillStyle = 'rgb(0,' + Math.floor( 100 + Math.random() * 150 ) + ',0)';
            ctx.fillRect(x * pxW, y * pxH, pxW, pxH);
        }
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
                opt.drawClass = opt.drawClass || 'def';
                opt.drawMethod = opt.drawMethod || 'stripes';
                var drawFunc = drawMethods[opt.drawClass][opt.drawMethod];
                drawFunc.call(sm, ctx, canvas, sm, opt);
                texture.needsUpdate = true;
            }
        };
        return canvasObj;
    };
    // return public api
    return api;
}
    ());
