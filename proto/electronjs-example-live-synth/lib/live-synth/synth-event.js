// write a single sample to the given buffer
const writeSample = (buff, a_sample = 0.5, wave_count = 1, amplitude = 0.3) => {
    const a_waves = a_sample * wave_count % 1;
    const n = Math.round( 127.5 - Math.sin( Math.PI * 2 * a_waves ) * (128 * amplitude) );
    buff.write( n.toString(16), 0, 'hex');
    return buff;
};
//-------- ----------
// WRITE
//-------- ----------
const ap_buffersize = 64000;
const { spawn } = require('node:child_process');

const args = ['--buffer-size', ap_buffersize, '--period-size', 1000, '-F', 0, '-T', 0, '-R', 0, '-B', 0];


const aplay = spawn('aplay', args, { stdio: 'pipe' } );
aplay.stdin._writableState.highWaterMark = 64000;
aplay.stdout._readableState.highWaterMark = 64000;


aplay.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

aplay.stdin.on('drain', (code) => {
  console.log(`drain event `);
});



const buff = Buffer.alloc(1);

const loop = () => {

    setTimeout(loop, 980)

    let i = 0;
    while(i < 8000){

       writeSample(buff, i / 8000, 1, 0.5);

       aplay.stdin.write(buff);

       i += 1;
    }



    console.log( aplay.stdin.writableLength );


};
loop();