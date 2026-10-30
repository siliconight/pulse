const assert=require('node:assert/strict'),{arrange}=require('../dist/remix-core.js');
const signal=new Float32Array(8000);for(let k=0;k<8;k++)signal.fill((k+1)/8,k*1000,(k+1)*1000);
const candidates=Array.from({length:7},(_,i)=>({start:i*1000,end:i*1000+2000,score:0}));
for(let v=0;v<2;v++){
 const out=arrange(candidates,[signal],4,v);assert(out.length>=2&&out.length<=4);
 for(let i=0;i<out.length;i++){assert(out[i].start>=0&&out[i].end<=signal.length);for(let j=0;j<i;j++)assert(Math.max(out[i].start,out[j].start)>=Math.min(out[i].end,out[j].end))}
 assert.deepEqual(out,arrange(candidates,[signal],4,v));
}
assert.throws(()=>arrange(candidates.slice(0,1),[signal],4));
console.log('PASS: remix drafts use distinct bounded phrases and deterministic alternatives');
