// ---------- ----------
// STATE OBJECT
// ---------- ----------
const state = window.state = {
   canvas: null,
   ctx: null,
   ready: false
};
// ---------- ----------
// 2D CANVAS ELEMENT
// ---------- ----------
const canvas = state.canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
canvas.style.display = 'inline-block';
const ctx = state.ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
// ---------- ----------
// LOAD EVENT
// ---------- ----------
window.addEventListener("load", (event) => {
    console.log('view is loaded');
    state.ready = true;
});

