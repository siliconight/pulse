/* Deterministic layer rendering. No dependencies or audio-device state. */
(function(root){
function render({kind,duration=12,intensity=.5,bpm=70,cycle=8,sampleRate=48000}){
 if(!['pulse','rise'].includes(kind)||duration<2||duration>60||bpm<30||bpm>200||cycle<2||cycle>30||intensity<0||intensity>1)throw Error('Invalid layer settings');
 const out=new Float32Array(Math.round(duration*sampleRate)),phases=new Float64Array(8);
 for(let i=0;i<out.length;i++){const t=i/sampleRate;let value=0;
  if(kind==='pulse'){const period=60/bpm,beat=t%period;for(const [offset,level,f]of [[0,1,55],[Math.min(.16,period*.28),.65,70]]){const age=beat-offset;if(age>=0&&age<.3)value+=level*Math.sin(2*Math.PI*f*age)*Math.exp(-age*24)*Math.min(1,age/.005)}value*=.45;}
  else {let weight=0;for(let k=0;k<8;k++){const pos=((k+t/cycle)%8)/8,f=32*Math.pow(2,pos*8),gain=Math.sin(Math.PI*pos)**4;phases[k]=(phases[k]+2*Math.PI*f/sampleRate)%(2*Math.PI);value+=Math.sin(phases[k])*gain;weight+=gain}value=value/Math.max(1,weight)*.6;}
  const edge=Math.min(1,t/.04,(duration-t)/.15);out[i]=value*edge*(.25+.75*intensity);
 }
 return out;
}
root.PulseEmotion={render};if(typeof module!=='undefined')module.exports=root.PulseEmotion;
})(typeof self!=='undefined'?self:globalThis);
