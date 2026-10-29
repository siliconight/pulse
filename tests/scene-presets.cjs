const assert=require('node:assert/strict'),templates=require('../dist/scene-presets');
assert.deepEqual(templates.slice(0,5).map(p=>p.name),['Slow heartbeat','Build up','Speed up','Tension','Release / recover']);
for(const p of templates){assert(p.low>=50&&p.high<=200&&p.low<=p.high);assert.equal(p.cues[0].t,0);assert.equal(p.cues.at(-1).t,p.duration);for(let i=0;i<p.cues.length;i++){assert(p.cues[i].v>=0&&p.cues[i].v<=100);if(i)assert(p.cues[i].t>p.cues[i-1].t)}assert.deepEqual(JSON.parse(JSON.stringify(p)).cues,p.cues)}
assert(templates[0].cues.at(-1).v<templates[0].cues[0].v);assert(templates[1].cues.at(-1).v>templates[1].cues[0].v);console.log('PASS: scene templates, ordered cue timelines and serialization');

assert.deepEqual(templates.filter(p=>p.category==='game').map(p=>p.name),['Downed / Bleeding Out','Menu','Level','Prep','Going Hot','Credits','Cinematic Lo-fi']);assert.equal(templates.at(-1).tone,'lofi');

const downed=templates.find(p=>p.tone==='downed');assert.equal(downed.duration,10);assert.equal(downed.cues.at(-1).t,10);assert.equal(downed.low,70);
