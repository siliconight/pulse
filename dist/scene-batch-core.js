/* Deterministic scene bakes. All samples processed locally; output stereo PCM. */
(function(root){
const scenes=[['Ambient','Soft stereo wash; no BPM needed'],['Menu','Muted, steady background'],['Exploration','Gentle filtered background'],['Prep','Gradually opens the highs'],['GoingHot','Bright, forward music'],['Downed','Slows to 70% over 10 seconds; pitch falls with speed; heartbeat muffle'],['Recovery','Gradually softens and settles'],['Credits','Reflective tone with a closing fade']].map(([id,description])=>({id,description}));
function safeName(value){const s=String(value).replace(/\.[^.]+$/,'').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,60)||'Track';return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(s)?'Track_'+s:s}
function folder(name,date=new Date()){const p=n=>String(n).padStart(2,'0');return `${safeName(name)}_Scenes_${date.getFullYear()}-${p(date.getMonth()+1)}-${p(date.getDate())}_${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`}
function render(channels,sr,id,{seconds=24,full=false,bpm=100}={}){
 if(!scenes.some(s=>s.id===id)||!channels.length||channels.length>2||!Number.isFinite(sr)||sr<8000||!Number.isFinite(seconds)||seconds<2||seconds>60||!Number.isFinite(bpm)||bpm<30||bpm>300||channels.some(c=>c.length!==channels[0].length)||channels[0].length<sr*.1)throw Error('Invalid source or scene settings.');
 const length=channels[0].length,duration=length/sr;
 if(id==='Ambient'){const d=full?Math.min(duration,60):Math.min(seconds,60);if(d<2)throw Error('Ambient needs at least two seconds.');return {channels:PulseAmbient.wash(channels,sr,d),start:0,seconds:d,rate:'original pitch; granular wash'}}
 const count=Math.min(length,Math.round((full?duration:seconds)*sr));let start=0;
 if(!full&&length>count){let best=id==='GoingHot'?-Infinity:Infinity;for(let pos=0;pos+count<=length;pos+=Math.max(1,Math.round(sr*2))){let e=0,n=0;for(let i=pos;i<pos+count;i+=128){e+=channels[0][i]**2;n++}e/=Math.max(1,n);if((id==='GoingHot'&&e>best)||(id!=='GoingHot'&&e<best&&e>1e-7)){best=e;start=pos}}}
 const out=[new Float32Array(count),new Float32Array(count)];let position=start;
 for(let i=0;i<count;i++){
 const t=i/sr,progress=i/Math.max(1,count-1),rate=id==='Downed'?1-.3*Math.min(1,t/10):1;
 const pulse=id==='Downed'?PulseHeartbeat.values(position/sr,bpm,.75,.7):{gain:1,hz:18000};
 let hz=({Menu:3000,Exploration:6000,Prep:1000+14000*progress,GoingHot:18000,Recovery:12000-10000*progress,Credits:5000,Downed:pulse.hz})[id];
 const alpha=1-Math.exp(-2*Math.PI*Math.min(hz,sr*.49)/sr),a=Math.min(length-1,Math.floor(position)),b=Math.min(length-1,a+1),frac=position-a;
 for(let c=0;c<2;c++){const ch=channels[c%channels.length],x=ch[a]*(1-frac)+ch[b]*frac,prev=i?out[c][i-1]:0;out[c][i]=prev+alpha*(x-prev)}
 // Store filter state before applying gain below.
 position+=rate;
 }
 let peak=0;for(let c=0;c<2;c++){let pos=start;for(let i=0;i<count;i++){const t=i/sr,p=i/Math.max(1,count-1),rate=id==='Downed'?1-.3*Math.min(1,t/10):1,pulse=id==='Downed'?PulseHeartbeat.values(pos/sr,bpm,.75,.7).gain:1;const fade=Math.min(1,i/(sr*.03),(count-1-i)/(sr*(id==='Credits'?Math.min(4,count/sr/3):.05)));out[c][i]*=.65*pulse*Math.max(0,fade);peak=Math.max(peak,Math.abs(out[c][i]));pos+=rate}}
 if(peak> .98)for(const ch of out)for(let i=0;i<count;i++)ch[i]*=.98/peak;
 return {channels:out,start:start/sr,seconds:count/sr,rate:id==='Downed'?'tape speed 100% to 70%; pitch follows speed':'original tempo'};
}
const api={scenes,safeName,folder,render};if(typeof module!=='undefined')module.exports=api;else root.PulseSceneBatch=api;
})(globalThis);
