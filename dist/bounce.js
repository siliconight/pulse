/* Offline effects-only bounce. Tempo remains original; performance capture is separate. */
(()=>{'use strict';
const el=id=>document.getElementById(id);let busy=false,url=null;
el('bounceWav').onclick=async()=>{
 if(busy)return;busy=true;el('bounceWav').disabled=true;el('bounceDownload').classList.add('hidden');
 const report=t=>el('bounceStatus').textContent=t;
 try{
 report('Reading source audio…');const buffer=await PulseFX.getSource(),sr=buffer.sampleRate;
 const start=Number(el('bounceStart').value),end=el('bounceEnd').value===''?buffer.duration:Number(el('bounceEnd').value);
 if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||end>buffer.duration+.000001)throw Error('Choose a start and end within the loaded track.');
 const first=Math.round(start*sr),last=Math.min(buffer.length,Math.round(end*sr)),frames=last-first;if(frames<1)throw Error('Choose a longer region.');
 if(frames*2*4>220*1024*1024)throw Error('Choose a shorter region for this bounce (up to about 10 minutes).');
 const settings=PulseFX.settings(),layer=el('bounceLayer').checked?PulseFX.offlineLayer():null;
 if(el('bounceLayer').checked&&!layer)throw Error('Prepare the selected layer first, or uncheck Include prepared layer.');
 const bpm=Number(el('base').value),volume=Number(el('volume').value);
 const ctx=new OfflineAudioContext(2,frames,sr),source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),output=ctx.createGain();
 source.buffer=buffer;filter.type='lowpass';filter.Q.value=.707;
 filter.frequency.value=settings.musicTone==='lofi'?2400:sr*.49;output.gain.value=volume;source.connect(filter).connect(gain).connect(output).connect(ctx.destination);
 if(settings.musicTone==='downed'){
 const n=Math.max(2,Math.ceil(frames/sr*200)),g=new Float32Array(n),f=new Float32Array(n);
 for(let i=0;i<n;i++){const v=PulseHeartbeat.values(first/sr+i/(n-1)*frames/sr,bpm,Number(settings.downedMuffle)/100,Number(settings.downedStrength)/100);g[i]=v.gain;f[i]=Math.min(v.hz,sr*.49)}
 gain.gain.setValueCurveAtTime(g,0,frames/sr);filter.frequency.setValueCurveAtTime(f,0,frames/sr);
 }
 if(layer){
 const b=ctx.createBuffer(layer.channels.length,layer.channels[0].length,48000),s=ctx.createBufferSource(),mix=ctx.createGain();layer.channels.forEach((ch,c)=>b.copyToChannel(ch,c));s.buffer=b;mix.gain.value=layer.mix;s.connect(mix).connect(output);s.start(0);
 if(settings.musicTone!=='downed'&&settings.emotionFilter!=='none'){
 const duration=Math.min(layer.duration,frames/sr),reveal=settings.emotionFilter==='reveal';filter.frequency.setValueAtTime(reveal?500:Math.min(18000,sr*.49),0);filter.frequency.exponentialRampToValueAtTime(reveal?Math.min(18000,sr*.49):500,duration);
 if(settings.emotionEnding==='release'&&layer.duration<frames/sr)filter.frequency.setTargetAtTime(settings.musicTone==='lofi'?2400:sr*.49,layer.duration,.03);
 }
 }
 source.start(0,first/sr,frames/sr);report('Rendering effects offline…');const result=await ctx.startRendering();
 const channels=Array.from({length:2},(_,c)=>result.getChannelData(c));let peak=0;for(const ch of channels)for(let i=0;i<ch.length;i++)peak=Math.max(peak,Math.abs(ch[i]));
 // Avoid clipped PCM on a summed music/layer bounce by lowering the whole file equally.
 if(peak>1)for(const ch of channels)for(let i=0;i<ch.length;i++)ch[i]*=.999/peak;
 const blob=new Blob([PulseAssets.wav(channels,sr)],{type:'audio/wav'});if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);
 const name=el('bounceName').value.trim().replace(/[^a-zA-Z0-9_-]+/g,'-')||'pulse-processed';el('bounceDownload').href=url;el('bounceDownload').download=name+'.wav';el('bounceDownload').textContent='Download '+name+'.wav';el('bounceDownload').classList.remove('hidden');
 report(`Ready: ${(frames/sr).toFixed(2)} seconds · ${sr} Hz stereo WAV · original tempo.${peak>1?' Overall gain reduced to prevent clipping.':''} Region edges and layer tails are trimmed at your chosen end; audition before looping.`);
 }catch(e){report(e.message||'Bounce failed. Try a shorter region.')}finally{busy=false;el('bounceWav').disabled=false}
};
})();
