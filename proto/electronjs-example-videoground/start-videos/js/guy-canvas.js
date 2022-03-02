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
    var drawMethod = {};
    // face draw methods
    drawMethod.face = {};
    // plain
    drawMethod.face.plain = (ctx, canvas, sm) => {
        drawBackground(ctx, canvas, 'white');
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 8, 8);
    };

    // create and return a canvas texture
    api.createCanvasObject = function (sm, drawFunc) {
        drawFunc = drawFunc || drawMethod.face.plain;
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 32;
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var canvasObj = {
            texture: texture,
            canvas: canvas,
            ctx: ctx,
            sm: sm,
            draw: function(){
                drawFunc.call(sm, ctx, canvas, sm);
                texture.needsUpdate = true;
            }
        };
        canvasObj.draw();
        return canvasObj;
    };

    return api;


}
    ());
