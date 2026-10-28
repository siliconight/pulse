const assert=require('node:assert/strict'),fs=require('node:fs'),A=require('../dist/loop-core.js');
(async()=>{
const r=A.candidates(1843200,48000,100,4,4,0);assert.equal(r.length,4);assert.deepEqual(r[0],{start:0,end:460800});assert.equal(r.at(-1).end,1843200);
const odd=A.candidates(48000*600,48000,137,3,4,.125);assert.equal(odd[0].start,6000);for(let i=1;i<odd.length;i++)assert.equal(odd[i].start,odd[i-1].end);assert(odd.at(-1).end<=48000*600);
assert.equal(A.boundary(.1,100,4,9.6,'beat'),.6);assert.equal(A.boundary(.1,100,4,9.6,'bar'),2.4);assert.equal(A.boundary(2.4,100,4,9.6,'bar'),4.8);assert.equal(A.boundary(4,100,4,9.6,'end'),9.6);
const channels=[Float32Array.from([0,.5,-1,1]),Float32Array.from([1,0,-.5,0])],bytes=A.wav(channels,48000),v=new DataView(bytes.buffer);assert.equal(v.getUint16(22,true),2);assert.equal(v.getUint32(24,true),48000);assert.equal(v.getUint32(40,true),16);assert.equal(v.getInt16(44,true),0);assert.equal(v.getInt16(46,true),32767);assert.equal(v.getInt16(52,true),-32768);
assert.equal(A.crc32(new TextEncoder().encode('123456789')),0xcbf43926);
const archive=A.zip([{name:'check.wav',data:bytes},{name:'manifest.json',data:JSON.stringify({frames:4})}]);fs.writeFileSync(require('node:path').join(require('node:os').tmpdir(),'pulse-zip-test.zip'),Buffer.from(await archive.arrayBuffer()));console.log('PASS: sample-accurate cuts, cumulative rounding, musical boundaries, PCM stereo encoding and CRC32');
})();
