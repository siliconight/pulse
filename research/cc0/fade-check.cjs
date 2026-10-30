// Deterministic signal check: fade behavior depends on correlation.
const fs=require('fs');let state=42;const noise=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296*2-1};
const a=Float64Array.from({length:96000},noise),b=Float64Array.from({length:a.length},noise);
const rms=x=>Math.sqrt(x.reduce((s,v)=>s+v*v,0)/x.length);
const result={};
for(const [name,y] of [['identical',a],['independent',b],['opposite',a.map(x=>-x)]]){
 result[name]={};for(const [curve,g] of [['linear',.5],['equal_power',Math.SQRT1_2]]){
 const mix=a.map((v,i)=>g*v+g*y[i]);result[name][curve+'MidpointDb']=rms(mix)===0?'complete cancellation':+(20*Math.log10(rms(mix)/rms(a))).toFixed(3);
 }
}
fs.writeFileSync(__dirname+'/fade-results.json',JSON.stringify(result,null,2)+'\n');console.log(result);
