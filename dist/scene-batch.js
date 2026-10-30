(()=>{'use strict';const el=id=>document.getElementById(id),core=PulseSceneBatch;let worker=null,ticket=0,url=null;
for(const scene of core.scenes){const label=document.createElement('label');label.className='include-label';const box=document.createElement('input');box.type='checkbox';box.value=scene.id;box.checked=['Ambient','Menu','GoingHot'].includes(scene.id);label.append(box,document.createTextNode(scene.id==='GoingHot'?'Going Hot':scene.id));label.title=scene.description;el('batchScenes').append(label)}
el('batchBrowse').onclick=()=>el('file').click();
function busy(on){el('batchFields').disabled=on;el('cancelSceneFiles').disabled=!on;el('batchBrowse').disabled=on}
function cancel(){ticket++;worker?.terminate();worker=null;busy(false)}
el('cancelSceneFiles').onclick=()=>{cancel();el('batchProgress').value=0;el('batchStatus').textContent='Cancelled. No package was downloaded.'};
el('createSceneFiles').onclick=async()=>{
 if(worker)return;const ids=[...el('batchScenes').querySelectorAll('input:checked')].map(b=>b.value);if(!ids.length){el('batchStatus').textContent='Choose at least one scene.';return}
 const revision=PulseFX.sourceRevision(),id=++ticket;busy(true);el('batchDownload').classList.add('hidden');el('batchProgress').value=0;
 try{
 el('batchStatus').textContent='Reading your track…';const buffer=await PulseFX.getSource();if(id!==ticket)return;if(revision!==PulseFX.sourceRevision())throw Error('Source changed. Create scenes again.');
 const seconds=Number(el('batchSeconds').value),bpm=Number(el('base').value),full=el('batchScope').value==='full';if(!Number.isFinite(seconds)||seconds<2||seconds>60)throw Error('Choose an excerpt length from 2 to 60 seconds.');
 if(ids.reduce((n,s)=>n+(s==='Ambient'?Math.min(full?buffer.duration:seconds,60):Math.min(full?buffer.duration:seconds,buffer.duration)),0)*buffer.sampleRate*4>220*1024*1024)throw Error('This package is too large. Choose fewer scenes or shorter excerpts.');
 const name=el('filename').textContent,folder=core.folder(name);el('batchSource').textContent=name;worker=new Worker('scene-batch-worker.js');
 worker.onerror=()=>{if(id!==ticket)return;cancel();el('batchStatus').textContent='Scene renderer failed. Try shorter excerpts.'};
 worker.onmessage=e=>{if(id!==ticket)return;if(revision!==PulseFX.sourceRevision()){cancel();el('batchStatus').textContent='Source changed. Create scenes again.';return}const r=e.data;if(r.error){cancel();el('batchStatus').textContent=r.error;return}if(r.done){worker.terminate();worker=null;busy(false);if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(r.blob);el('batchDownload').href=url;el('batchDownload').download=folder+'.zip';el('batchDownload').textContent='Download '+folder+'.zip';el('batchDownload').classList.remove('hidden');el('batchProgress').value=100;el('batchStatus').textContent=`Ready: ${r.manifest.scenes.length} processed scene WAVs. ZIP and folder: ${folder}. Your browser chooses the download location.`}else{el('batchProgress').value=r.progress;el('batchStatus').textContent=r.status}};
 const channels=Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c).slice());worker.postMessage({channels,sampleRate:buffer.sampleRate,ids,options:{seconds,full,bpm},name,folder},channels.map(c=>c.buffer));
 }catch(e){if(id===ticket){cancel();el('batchStatus').textContent=e.message}}
};
})();
