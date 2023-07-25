const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;

const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const state = {
    x: -1, y: -1
};

const draw = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText(state.x + ',' + state.y, 10, 10)
};

draw();

canvas.addEventListener('pointerdown', (e) => {
    state.x = e.clientX;
    state.y = e.clientY;
    draw();
})
