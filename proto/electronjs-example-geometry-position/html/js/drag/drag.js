// ---------- ----------
// DRAG AND DROP
// ---------- ----------
const slots = document.querySelectorAll('.slot');
let el_drag = null;
// document wide handlers
document.addEventListener('drag', (e) => {});
document.addEventListener('dragstart', (e) => {
    el_drag = e.target;
});
document.addEventListener('dragend', (e) => {
    el_drag = null;
});
document.addEventListener('dragover', (e) => {
    event.preventDefault();
});
document.addEventListener('dragenter', (e) => {});
document.addEventListener('dragleave', (e) => {});
// handler for drag start
app.el_json.addEventListener('dragstart', (e) => {
    e.preventDefault();
});
// attach handlers for each slot div
Array.prototype.forEach.call(slots, (slot) => {
    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const slot = e.currentTarget;
        slot.style.opacity = 1;
        console.log(slot.children);
        console.log(el_drag);
    });
    slot.addEventListener('dragenter', (e) => {
        const slot = e.currentTarget;
        slot.style.opacity = 0.25;
    });
    slot.addEventListener('dragleave', (e) => {
        const slot = e.currentTarget;
        slot.style.opacity = 1;
    });
});
