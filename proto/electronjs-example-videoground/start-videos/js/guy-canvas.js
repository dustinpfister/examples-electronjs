var GuyCanvas = (function () {

    var createCanvasTexture = (draw, size) => {
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = size || 64;
        canvas.height = size || 64;
        draw(ctx, canvas);
        return new THREE.CanvasTexture(canvas);
    };

    // just draw a solid color background
    var drawBackground = (ctx, canvas, style) => {
        ctx.fillStyle = style || 'white';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
    };

    // draw methods
    var drawMethod = {};

    drawMethod.face1 = (ctx, canvas) => {
        drawBackground(ctx, canvas, 'white');
        ctx.fillStyle = 'black';
        ctx.fillRect(16, 16, 8, 8);
    };


    var api = {};

    api.createTexture = () => {

    };

    return api;


}
    ());
