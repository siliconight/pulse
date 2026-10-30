/* Scene templates describe tempo/intensity, not synthesized heartbeat audio. */
const sceneTemplates=[
 {name:'Slow heartbeat',low:60,high:90,ramp:8,fall:12,duration:24,seq:'settle',description:'A slow, steady pulse with a gentle settling motion. Changes your track’s tempo; does not add heartbeat sounds.',cues:[{t:0,name:'Slow pulse',v:25},{t:12,name:'Breathe out',v:10},{t:24,name:'Rest',v:0}]},
 {name:'Build up',low:80,high:120,ramp:8,fall:10,duration:30,seq:'build',description:'Start restrained, gather momentum, and arrive at full energy.',cues:[{t:0,name:'Quiet beginning',v:0},{t:12,name:'Gather momentum',v:30},{t:24,name:'Push forward',v:75},{t:30,name:'Arrival',v:100}]},
 {name:'Speed up',low:100,high:135,ramp:3,fall:8,duration:12,seq:'build',description:'A clear acceleration from the recorded tempo into a faster pace.',cues:[{t:0,name:'Original pace',v:0},{t:8,name:'Accelerate',v:100},{t:12,name:'Hold the pace',v:100}]},
 {name:'Tension',low:85,high:115,ramp:10,fall:15,duration:30,seq:'build',description:'A slow, unresolved rise that holds its pressure.',cues:[{t:0,name:'Unease',v:10},{t:15,name:'Something is wrong',v:45},{t:26,name:'Threat approaches',v:85},{t:30,name:'Hold tension',v:85}]},
 {name:'Release / recover',low:70,high:120,ramp:3,fall:12,duration:24,seq:'settle',description:'Leave the peak behind and gradually return to calm.',cues:[{t:0,name:'Peak intensity',v:100},{t:8,name:'Danger passes',v:60},{t:24,name:'Return to calm',v:0}]},
 {name:'Ambient',category:'game',tone:'natural',low:100,high:100,ramp:8,fall:8,duration:30,seq:'settle',description:'Prepare a soft stereo wash from your recording. Choose Play layer only to hear the ambience, or download its WAV. Uses the source position in Layer details; no BPM required.',cues:[{t:0,name:'Drift',v:0},{t:30,name:'Hold space',v:0}]},
 {name:'Downed / Bleeding Out',category:'game',tone:'downed',low:70,high:100,ramp:10,fall:10,duration:10,seq:'settle',description:'Gradually slow the music and heartbeat to 70% over 10 seconds, then hold. Muffle the highs and pulse the music in double heartbeats locked to its recorded BPM. Loops the loaded track until Revive or Stop. Set the recorded BPM accurately.',cues:[{t:0,name:'Hit',v:100},{t:10,name:'Bleeding out',v:0}]},
 {name:'Menu',category:'game',tone:'natural',low:95,high:95,ramp:6,fall:8,duration:30,seq:'build',description:'A steady, unobtrusive pace for browsing menus. Holds at 95% of the recorded tempo.',cues:[{t:0,name:'Welcome',v:0},{t:30,name:'Stay present',v:0}]},
 {name:'Level',category:'game',tone:'natural',low:90,high:105,ramp:6,fall:10,duration:40,seq:'surge',description:'Gentle movement for exploration, with a small lift and return. The timeline holds its final pace until you stop.',cues:[{t:0,name:'Enter the level',v:25},{t:16,name:'Discover',v:60},{t:28,name:'Keep moving',v:40},{t:40,name:'Settle into exploration',v:25}]},
 {name:'Prep',category:'game',tone:'natural',low:80,high:100,ramp:8,fall:10,duration:30,seq:'build',description:'Measured anticipation for planning, choosing gear and approaching an objective.',cues:[{t:0,name:'Make the plan',v:10},{t:18,name:'Get equipped',v:35},{t:30,name:'Ready to move',v:60}]},
 {name:'Going Hot',category:'game',tone:'natural',low:100,high:130,ramp:2,fall:10,duration:16,seq:'build',description:'A quick escalation into action, then a sustained urgent pace. A suggested rise layer is optional.',cues:[{t:0,name:'Spotted',v:0},{t:3,name:'Going hot',v:75},{t:8,name:'Full commitment',v:100},{t:16,name:'Hold the action',v:100}]},
 {name:'Credits',category:'game',tone:'natural',low:90,high:110,ramp:8,fall:14,duration:45,seq:'settle',description:'A reflective finish that gradually relaxes after an opening lift. Does not automatically fade volume.',cues:[{t:0,name:'After the journey',v:80},{t:15,name:'Reflect',v:55},{t:32,name:'Let go',v:25},{t:45,name:'Closing pace',v:10}]},
 {name:'Cinematic Lo-fi',category:'game',tone:'lofi',low:75,high:90,ramp:10,fall:12,duration:32,seq:'surge',description:'A slower cinematic drift with muted high frequencies. Preserves pitch; no vinyl noise or tape emulation is added.',cues:[{t:0,name:'Distant memory',v:20},{t:16,name:'Drift closer',v:55},{t:32,name:'Fade into the moment',v:20}]}
].map(p=>({...p,pitch:true,shape:'smooth',align:'now',intensity:p.cues[0].v}));
if(typeof module!=='undefined')module.exports=sceneTemplates;
else {
 const panel=document.getElementById('sceneTemplates');
 for(const template of sceneTemplates){
  presets.push(template);const index=presets.length-1,button=document.createElement('button');button.textContent=template.name;
  button.onclick=()=>{audio.pause();$('preset').value=index;apply();sceneTab(false);$('name').value=template.name+' custom';$('sceneTemplateStatus').textContent=template.description+' Edit the cue times and intensities below, then choose Play cue timeline.';$('status').textContent=audio.src?'Preset ready. Choose Play cue timeline to hear it.':'Preset ready. Load a WAV or try the demo, then choose Play cue timeline.'};(template.category==='game'?document.getElementById('gameTemplates'):panel).append(button);
 }
 options();
 $('previewScene').onclick=()=>{if(!audio.src||audio.readyState<1){$('sceneTemplateStatus').textContent='Load a WAV or try the demo first.';return}$('runCues').click()};
 $('sceneStop').onclick=()=>$('stop').click();
}
