// write a single sample to the given buffer
const writeSample = (buff, a_sample = 0.5, wave_count = 1, amplitude = 0.3) => {
    const a_waves = a_sample * wave_count % 1;
    const n = Math.round( 127.5 - Math.sin( Math.PI * 2 * a_waves ) * (128 * amplitude) );
    buff.write( n.toString(16), 0, 'hex');
    return buff;
};
//-------- ----------
// LOOP
//-------- ----------
const buff = Buffer.alloc(1);
const frame_count = 60;
let i_sample = 0;
let i_frame = 0;
const count_sample = 8000;
let to_high = false;
let last_time = new Date();
const ms_fast = 990;
const ms_slow = 5000;
const loop = () => {

    const t = setTimeout(loop, to_high ? ms_slow: ms_fast);

    const a_framecount = (i_frame / frame_count);

    let i_sample = 0;
    while( i_sample < count_sample){


        const a_sample = i_sample / count_sample;


        const a3 = a_framecount;
        const a_wavecount = Math.sin( Math.PI * a3 );

        // write sample to buffer
        const wave_count = Math.floor(75 + 25 * a_wavecount);
        writeSample(buff, a_sample, wave_count, 0.6);
        to_high = !process.stdout.write(buff);
        if(to_high){
            break;
        }
        i_sample += 1;
    }

    i_frame += 1;
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
