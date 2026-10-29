const assert=require('node:assert/strict'),A=require('../dist/loop-core');
for(const [signature,beats,seconds]of [['6/8',3,6],['7/8',3.5,7],['5/4',5,10]]){
 const m=A.meter(signature);assert.equal(m.beats,beats);
 const clip=A.candidates(48000*60,48000,120,m.beats,4,0)[0];assert.equal(clip.end,seconds*48000);
 assert.equal(A.boundary(.1,120,m.beats,seconds,'bar'),seconds/4);
 assert.equal(A.meter(JSON.parse(JSON.stringify(m)).signature).signature,signature);
}
assert.equal(A.meter(3).signature,'3/4');assert.equal(A.meter('6/8').signature,'6/8');assert.throws(()=>A.meter('5/8'));
console.log('PASS: 6/8, 7/8 and 5/4 lengths, next-bar boundaries, meter persistence and legacy meters');
