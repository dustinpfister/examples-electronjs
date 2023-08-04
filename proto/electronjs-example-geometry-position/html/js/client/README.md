# Client

This is the main javaScript code used in the root index.html file of a Main browser window. What this file is used for might change or be replaced completely at some point so for now I do not think I should write that much about it.



### Create Cursor with javaScript code?

At the time of this writing I created a json file for the cursor using the below code for it. I want to remove the code from client.js but I would still like to keep it parked here for now as I might want to go back to a code centered way of creating a cursor at some point.

```
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = 32, h = 32;
    canvas.width = w; canvas.height = h;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo( 0, 0);
    ctx.lineTo( w, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo( w, 0);
    ctx.lineTo( 0, h);
    ctx.stroke();
    const texture = new THREE.CanvasTexture( canvas );
    // the material for the sprite
    const material = new THREE.SpriteMaterial({
        map: texture,
        sizeAttenuation: false,
        depthTest: false,
        transparent: true,
        opacity: 1
    });
    const sprite = new THREE.Sprite(  material );
```