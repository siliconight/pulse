const assert=require('node:assert/strict');const {suggest}=require('../dist/join-core');
const sr=48000,bpm=120,bar=sr*2,channels=[new Float32Array(bar*4)];
for(let i=0;i<bar*4;i++)channels[0][i]=i<bar*2?.5:.05;
const a={start:0,end:bar*2},b={start:bar*2,end:bar*4};
const result=suggest(channels,a,b,sr,bpm,4);
assert.equal(result.exit,'bar');assert.equal(result.fadeCurve,'equal_power');assert(result.crossfade>0&&result.crossfade<1);assert(result.issues.includes('level difference'));
const even=suggest(channels,a,a,sr,bpm,4);assert(!even.issues.includes('level difference'));
console.log('PASS: join fades bounded and level mismatch flagged');
