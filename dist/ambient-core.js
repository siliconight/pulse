/* Source-derived wash: overlapping Hann-windowed grains, deterministic stereo offsets. */
(function(root){
function wash(channels,sr,seconds,start=0){
 if(!channels.length||channels.some(c=>c.length!==channels[0].length)||!Number.isFinite(sr)||sr<8000||!Number.isFinite(seconds)||seconds<2||seconds>60||!Number.isFinite(start)||start<0)throw Error('Invalid ambient source or duration.');
 const available=channels[0].length-Math.floor(start*sr);if(available<sr*.1)throw Error('Choose an earlier source position.');
 const n=Math.round(sr*seconds),grain=Math.min(Math.round(sr*.8),available),hop=Math.max(1,Math.floor(grain/4)),region=Math.min(available,Math.round(sr*12));
 const out=Array.from({length:2},()=>new Float32Array(n));let peak=0;
 for(let c=0;c<2;c++){const src=channels[c%channels.length],dst=out[c];let seed=42+c*71;
 for(let at=-grain;at<n;at+=hop){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const pos=Math.floor(start*sr)+Math.floor(seed/4294967296*Math.max(1,region-grain));
 for(let j=0;j<grain;j++){const k=at+j;if(k>=0&&k<n)dst[k]+=src[pos+j]*(.5-.5*Math.cos(2*Math.PI*j/(grain-1)))/2;}}
 // Smooth highs, fade edges; keep the generated layer bounded.
 let low=0;const alpha=1-Math.exp(-2*Math.PI*1800/sr);
 for(let i=0;i<n;i++){low+=alpha*(dst[i]-low);dst[i]=low*Math.min(1,i/(sr*.5),(n-1-i)/(sr*.75));peak=Math.max(peak,Math.abs(dst[i]));}}
 if(peak<1e-7)throw Error('That source region is silent. Choose another position.');
 const gain=Math.min(4,.6/peak);for(const ch of out)for(let i=0;i<n;i++)ch[i]*=gain;return out;
}
const api={wash};if(typeof module!=='undefined')module.exports=api;else root.PulseAmbient=api;
})(globalThis);
