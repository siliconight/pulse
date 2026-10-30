// Reproduce current Pulse heuristic output on a small CC0 pilot. Not a listening verdict.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto');
const bpm=require('../../dist/bpm-worker.js'),phrase=require('../../dist/phrase-core.js'),cut=require('../../dist/cut-core.js'),join=require('../../dist/join-core.js');
const sources=[
 ['Game BOI 1','HoliznaCC0','https://freemusicarchive.org/music/holiznacc0/gamer-soundtrack-game-boi/game-boi-1/','game-boi-1'],
 ['Something In the Air','HoliznaCC0','https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/something-in-the-air/','something-in-the-air'],
 ['Dark Ambient Cave Experience','techtheist','https://freemusicarchive.org/music/techtheist/fma2021-part-2/dark-ambient-cave-experience/','dark-ambient-cave'],
 ['Classic','HoliznaCC0','https://freemusicarchive.org/music/holiznacc0/rock-montage/classic/','classic']
];
const sr=11025,results=[];
for(const [title,artist,url,stem] of sources){
 const path=__dirname+'/audio/'+stem+'.mp3',input=fs.readFileSync(path);
 const raw=cp.execFileSync('ffmpeg',['-v','error','-i',path,'-ac','1','-ar',String(sr),'-f','f32le','pipe:1'],{maxBuffer:100*1024*1024});
 const y=new Float32Array(raw.buffer,raw.byteOffset,raw.length/4),duration=y.length/sr;
 const hop=Math.round(sr/100),n=Math.min(Math.floor(y.length/hop),9000),energy=new Float32Array(n);
 for(let i=0;i<n;i++){let sum=0;for(let j=i*hop;j<(i+1)*hop;j+=4)sum+=y[j]*y[j];energy[i]=sum/Math.ceil(hop/4)}
 const tempo=bpm.estimateTempo(energy),row={title,artist,url,license:'CC0 1.0 (track page)',sha256:crypto.createHash('sha256').update(input).digest('hex'),durationSeconds:+duration.toFixed(2),tempo};
 if(tempo.bpm){const bar=sr*60/tempo.bpm*4,barCount=Math.floor(y.length/bar),options=[];
  for(const bars of [4,8]){const candidates=phrase.find([y],sr,tempo.bpm,4,0,bars,5);options.push({bars,count:Math.max(0,barCount-bars+1),top:candidates.slice(0,3).map(c=>({start:+(c.start/sr).toFixed(2),end:+(c.end/sr).toFixed(2),score:+c.score.toFixed(3),reason:c.reason,cut:cut.suggest([y],c.start,c.end,sr)}))})}
  row.candidates=options.map(o=>({...o,top:o.top.map(c=>({...c,cut:{shiftMs:c.cut.shiftMs,score:+c.cut.score.toFixed(4),original:+c.cut.original.toFixed(4)}}))}));
  const top=options[0].top;if(top.length>1){const a=top[0],b=top[1];row.join=join.suggest([y],{start:Math.round(a.start*sr),end:Math.round(a.end*sr)},{start:Math.round(b.start*sr),end:Math.round(b.end*sr)},sr,tempo.bpm,4)}
 }
 results.push(row);console.log(title,tempo.bpm||tempo.reason,tempo.confidence||'',duration.toFixed(1)+'s');
}
fs.writeFileSync(__dirname+'/pilot-results.json',JSON.stringify({method:'Pulse 0.12 heuristics; assumed 4/4, downbeat at zero; mono 11025 Hz decode; no human listening labels',results},null,2)+'\n');
