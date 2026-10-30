const assert=require('node:assert/strict'),{wash}=require('../dist/ambient-core.js');
const sr=8000,x=Float32Array.from({length:sr*2},(_,i)=>Math.sin(i*.1)*.5),out=wash([x],sr,2);
assert.equal(out.length,2);assert.equal(out[0].length,sr*2);assert.equal(out[0][0],0);assert(Math.abs(out[0].at(-1))===0);
for(const ch of out)for(const v of ch)assert(Number.isFinite(v)&&Math.abs(v)<=.600001);
assert.deepEqual(out,wash([x],sr,2));assert.throws(()=>wash([new Float32Array(sr)],sr,2));assert.throws(()=>wash([x],sr,2,3));
console.log('PASS: ambient wash deterministic, stereo, bounded and faded; silent/invalid source rejected');
