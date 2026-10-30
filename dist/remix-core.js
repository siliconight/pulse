/* Draft an energy arc from distinct, fixed-meter phrases. Scores are suggestions. */
(function(root){
function arrange(candidates,channels,bars,variation=0){
 if(candidates.length<2)throw Error('Use a longer track or a shorter phrase length.');
 const pool=candidates.map(c=>{let e=0,n=0;for(const ch of channels)for(let i=c.start;i<c.end;i+=128){e+=ch[i]*ch[i];n++}return {...c,energy:Math.sqrt(e/Math.max(1,n))}});
 const max=Math.max(...pool.map(c=>c.energy),1e-8),used=[],targets=[.3,.6,1,.4];
 for(const target of targets){const choices=pool.filter(c=>!used.some(u=>Math.max(c.start,u.start)<Math.min(c.end,u.end)));
 if(!choices.length)break;
 choices.sort((a,b)=>Math.abs(a.energy/max-target)-Math.abs(b.energy/max-target)+(a.score-b.score)*.15);
 used.push(choices[Math.min(variation%2,choices.length-1)]);
 }
 if(used.length<2)throw Error('Not enough distinct phrases. Choose a shorter clip length.');
 return used.map((c,i)=>({...c,bars,label:i===used.length-1?'Recover':['Establish','Build','Peak'][i]}));
}
const api={arrange};if(typeof module!=='undefined')module.exports=api;else root.PulseRemix=api;
})(globalThis);
