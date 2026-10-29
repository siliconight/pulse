const assert=require('node:assert/strict');
const {estimateTempo}=require('../dist/bpm-worker.js');
for(const bpm of [60,90,100,120,137,180]){
 const energy=new Float32Array(6000);
 for(let t=.2;t<60;t+=60/bpm){const i=Math.round(t*100);energy[i]=1;if(i+1<energy.length)energy[i+1]=.3}
 const result=estimateTempo(energy);assert(Math.abs(result.bpm-bpm)<1,`${bpm}: ${JSON.stringify(result)}`);
}
assert(!estimateTempo(new Float32Array(6000)).bpm);
assert(!estimateTempo(new Float32Array(6000).fill(.1)).bpm);
assert(!estimateTempo(new Float32Array(500)).bpm);
console.log('PASS: six steady tempos, silence, sustained energy and short input');
