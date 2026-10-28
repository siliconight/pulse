const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const elements={};function el(){return {value:'',checked:true,style:{},classList:{toggle(){}},setAttribute(){},replaceChildren(){},append(){},addEventListener(){},click(){}}}
for(const [k,v]of Object.entries({base:100,low:85,high:130,ramp:2,fall:8,align:'now',shape:'smooth',preset:0,intensity:35,duration:20,minHold:1}))elements[k]={...el(),value:v};
const doc={getElementById:id=>elements[id]||(elements[id]=el()),createElement:el,querySelectorAll:()=>[],addEventListener(){}};
const ctx=vm.createContext({document:doc,window:{},localStorage:{getItem:()=>null},Option:function(){},performance:{now:()=>0},requestAnimationFrame(){},setTimeout(){},console,Blob,URL,Float32Array,ArrayBuffer,DataView});
vm.runInContext(fs.readFileSync('dist/app.js','utf8')+'\n'+fs.readFileSync('dist/scene.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('sceneValue(0)'),15);assert.equal(run('sceneValue(8)'),45);assert.equal(run('sceneValue(20)'),100);assert.equal(run('sceneValue(40)'),0);assert.equal(run('sceneValue(4)'),30);
run("$('ramp').value=2;rate=1;aim(1.3)");assert.equal(run('ramp.d'),2);run('aim(.85)');assert.equal(run('ramp.d'),8);
run("$('align').value='bar';audio.currentTime=.6;$('ramp').value=2;rate=1;aim(1.3)");assert.ok(Math.abs(run('ramp.t')+1.8)<1e-9);
run('rate=1.1;hold()');assert.equal(run('ramp'),null);assert.equal(run('target'),1.1);
let packets=[],Processor;vm.runInNewContext(fs.readFileSync('dist/capture.js','utf8'),{AudioWorkletProcessor:class{constructor(){this.port={postMessage:p=>packets.push(p)}}},registerProcessor:(n,p)=>Processor=p,Float32Array});const p=new Processor();p.port.onmessage({data:{active:true}});const signal=new Float32Array(128).fill(.25),out=[new Float32Array(128),new Float32Array(128)];p.process([[signal]],[out]);p.port.onmessage({data:{finish:true}});assert.equal(packets[0][0].length,128);assert.equal(packets[0][1][0],.25);assert.equal(packets[1].done,true);assert.equal(out[0][0],.25);console.log('PASS: cue arrivals/interpolation, rise/recovery, bar alignment, interruption and stereo capture');
