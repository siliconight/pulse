const assert=require('node:assert/strict');const {values}=require('../dist/heartbeat-core');
for(const bpm of [30,100,200])for(let t=0;t<10;t+=.017){const v=values(t,bpm,.75,.7);assert(v.gain>0&&v.gain<=1);assert(v.hz>=20&&v.hz<=18000);const next=values(t+60/bpm,bpm,.75,.7);assert(Math.abs(v.gain-next.gain)<1e-10);}
assert(values(.1,60,.75,.7).pulse>values(.32,60,.75,.7).pulse);assert(values(.32,60,.75,.7).pulse>values(.8,60,.75,.7).pulse);assert.equal(values(.8,60,.75,0).gain,1);console.log('PASS: repeating double heartbeat, bounded gain/filter, zero-strength unity');
