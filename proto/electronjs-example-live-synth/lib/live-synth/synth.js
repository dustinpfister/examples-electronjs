//-------- ----------
// TRYING TO WORK OUT SOME CONST VALUES FOR THIS
//-------- ----------

const ap_buffersize = 64000;

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
const { spawn } = require('node:child_process');

const args = ['--buffer-size', ap_buffersize, '--period-size', 1000, '-F', 0, '-T', 0, '-R', 0, '-B', 0];

//const args = [];

const aplay = spawn('aplay', args, { stdio: 'pipe' } );
aplay.stdin._writableState.highWaterMark = 64000;
aplay.stdout._readableState.highWaterMark = 64000;

const write = (data) => {
    return aplay.stdin.write(data);
};

aplay.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

//-------- ----------
// LOOP
//-------- ----------
const buff = Buffer.alloc(1);
const frame_count = 30;
let i_sample = 0;
let i_frame = 0;
const count_sample = 7000;
let to_high = false;
let last_time = new Date();


aplay.stdin.on('drain', () => {
  console.log(`drain done`);
  to_high = false;
});


let bytes = 0;
let start_time = new Date();

const loop = () => {

    const t2 = new Date() - start_time;
    const secs = t2 / 1000;
    const bbs = Math.floor( bytes / secs);

    let ms = 0;
    if(bbs < 8000){
       ms = 200;
    }
    if(bbs >= 7900){
       ms = 600;
    }
    if(bbs >= 8000){
       ms = 700;
    }
    if(bbs >= 8100){
       ms = 800;
    }
    if(bbs >= 16000){
       ms = 1000;
    }

    const t = setTimeout(loop, ms);

    //const t = setTimeout(loop, to_high ? ms_slow: ms_fast);

    const a_framecount = (i_frame / frame_count);

    while( i_sample < count_sample){


        const a_sample = i_sample / count_sample;


        const a3 = a_framecount;
        const a_wavecount = Math.sin( Math.PI * a3 );

        // write sample to buffer
        const wave_count = Math.floor(75 + 25 * a_wavecount);
        writeSample(buff, a_sample, wave_count, 0.6);
        bytes += 1;

        to_high = !write(buff);
        if(to_high){
            console.log('to high ' + bbs + ' Bytes/sec' )
            break;
        }
        i_sample += 1;
    }
    i_sample %= count_sample;
    i_frame += 1;

    //if(i_frame % 10 === 0){
        console.log('tick', 'secs=', secs, 'ms=', ms, 'byes/sec=', bbs);
    //}

    i_frame %= frame_count;
};
// drain event
process.stdout.on('drain', () => {
    const now = new Date();
    const time = (now - last_time) / 1000 / 60;
    last_time = now;
    process.stderr.write('\nNeeded to drain.\n');
    process.stderr.write('Went ' + time.toFixed(2) + ' Minutes.\n\n');
});
process.stderr.write('\nScript started: ' + last_time + ' .\n\n');
loop();
