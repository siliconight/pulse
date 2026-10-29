/* Scene templates describe tempo/intensity, not synthesized heartbeat audio. */
const sceneTemplates=[
 {name:'Slow heartbeat',low:60,high:90,ramp:8,fall:12,duration:24,seq:'settle',description:'A slow, steady pulse with a gentle settling motion. Changes your track’s tempo; does not add heartbeat sounds.',cues:[{t:0,name:'Slow pulse',v:25},{t:12,name:'Breathe out',v:10},{t:24,name:'Rest',v:0}]},
 {name:'Build up',low:80,high:120,ramp:8,fall:10,duration:30,seq:'build',description:'Start restrained, gather momentum, and arrive at full energy.',cues:[{t:0,name:'Quiet beginning',v:0},{t:12,name:'Gather momentum',v:30},{t:24,name:'Push forward',v:75},{t:30,name:'Arrival',v:100}]},
 {name:'Speed up',low:100,high:135,ramp:3,fall:8,duration:12,seq:'build',description:'A clear acceleration from the recorded tempo into a faster pace.',cues:[{t:0,name:'Original pace',v:0},{t:8,name:'Accelerate',v:100},{t:12,name:'Hold the pace',v:100}]},
 {name:'Tension',low:85,high:115,ramp:10,fall:15,duration:30,seq:'build',description:'A slow, unresolved rise that holds its pressure.',cues:[{t:0,name:'Unease',v:10},{t:15,name:'Something is wrong',v:45},{t:26,name:'Threat approaches',v:85},{t:30,name:'Hold tension',v:85}]},
 {name:'Release / recover',low:70,high:120,ramp:3,fall:12,duration:24,seq:'settle',description:'Leave the peak behind and gradually return to calm.',cues:[{t:0,name:'Peak intensity',v:100},{t:8,name:'Danger passes',v:60},{t:24,name:'Return to calm',v:0}]}
].map(p=>({...p,pitch:true,shape:'smooth',align:'now',intensity:p.cues[0].v}));
if(typeof module!=='undefined')module.exports=sceneTemplates;
else {
 const panel=document.getElementById('sceneTemplates');
 for(const template of sceneTemplates){
  presets.push(template);const index=presets.length-1,button=document.createElement('button');button.textContent=template.name;
  button.onclick=()=>{audio.pause();$('preset').value=index;apply();sceneTab(false);$('name').value=template.name+' custom';$('sceneTemplateStatus').textContent=template.description+' Edit the cue times and intensities below, then choose Play cue timeline.';$('status').textContent=audio.src?'Preset ready. Choose Play cue timeline to hear it.':'Preset ready. Load a WAV or try the demo, then choose Play cue timeline.'};panel.append(button);
 }
 options();
 $('previewScene').onclick=()=>{if(!audio.src||audio.readyState<1){$('sceneTemplateStatus').textContent='Load a WAV or try the demo first.';return}$('runCues').click()};
 $('sceneStop').onclick=()=>$('stop').click();
}
