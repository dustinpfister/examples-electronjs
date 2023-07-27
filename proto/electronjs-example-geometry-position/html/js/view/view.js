// ---------- ----------
// 2D CANVAS ELEMENT
// ---------- ----------
const canvas = window.canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

