const fs=require('fs'),cp=require('child_process'),crypto=require('crypto');
const {estimateTempo}=require('../../dist/bpm-worker.js');
const entries=[
 ['jazz-1','HoliznaCC0','1 (jazz)','https://freemusicarchive.org/music/holiznacc0/busted-guitar-jazz/1-jazz/'],
 ['sonata-1','Aaron Dunn','Sonata No. 1 – Movement 1','https://freemusicarchive.org/music/Aaron_Dunn/Sonata_No_1/Sonata_No_1_-_Movement_1/'],
 ['cris','Art Flower','Cris','https://freemusicarchive.org/music/art-flower/all-that-jazz/art-flower-cris/'],
 ['coldness','The Wanderer','Coldness','https://freemusicarchive.org/music/stranger/seven-elements/coldness/'],
 ['helice','Monplaisir','Hélice','https://freemusicarchive.org/music/Monplaisir/Bonjour_from_Paris_Nantes_and_Montreal/Monplaisir_-_Bonjour_from_Paris_Nantes_and_Montreal_-_01_Hlice/'],
 ['4-mei','Maarten Schellekens','4 mei','https://freemusicarchive.org/music/maarten-schellekens/public-domain-1/4-mei/'],
 ['lay-down-law','Stumble Bee','Lay down the law','https://freemusicarchive.org/music/stumble-bee/single/lay-down-the-law/'],
 ['ua-like','Rita Braga','Ua Like No A Like','https://freemusicarchive.org/music/Revitalize_Music_Contest/Revitalize_Music_Contest/11_Ua_Like_No_A_Like_3']
];
const results=[];
for(const [id,artist,title,page] of entries){
 try{
 const html=cp.execFileSync('curl',['-fsSL','--max-time','35',page],{encoding:'utf8',maxBuffer:2e6});
 if(!/licensed under a CC0 1\.0 Universal License/i.test(html.replace(/<[^>]*>/g,'').replace(/\s+/g,' ')))throw Error('CC0 track notice missing');
 const m=html.match(/fileUrl":"([^"]+)/);if(!m)throw Error('Audio URL missing');
 const url=JSON.parse('"'+m[1]+'"');if(!url.startsWith('https://files.freemusicarchive.org/'))throw Error('Unexpected audio host');
 const file=__dirname+'/audio/'+id+'.mp3';
 if(!fs.existsSync(file))cp.execFileSync('curl',['-fLsS','--max-time','90','-o',file,url]);
 const decoded=cp.spawnSync('ffmpeg',['-v','error','-i',file,'-ac','1','-ar','11025','-f','f32le','pipe:1'],{maxBuffer:120e6});
 if(decoded.error||decoded.status!==0)throw Error('Audio decode failed');
 const raw=decoded.stdout,decodeWarnings=decoded.stderr.toString().trim();
 const y=new Float32Array(raw.buffer,raw.byteOffset,raw.length/4),duration=y.length/11025;
 const windows=[0,Math.max(0,duration/2-15),Math.max(0,duration-30)].map(start=>{
 const e=new Float32Array(Math.min(3000,Math.floor((y.length-start*11025)/110)));
 for(let i=0;i<e.length;i++){let sum=0,a=Math.floor(start*11025)+i*110;for(let j=a;j<a+110;j+=4)sum+=y[j]*y[j];e[i]=sum/28}
 return {startSeconds:+start.toFixed(2),...estimateTempo(e,11025/110)};
 });
 const bpms=windows.filter(x=>x.bpm).map(x=>x.bpm),spread=bpms.length===3?100*(Math.max(...bpms)/Math.min(...bpms)-1):null;
 results.push({id,artist,title,page,license:'CC0 1.0; page checked',sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),durationSeconds:+duration.toFixed(2),withinImportLimit:duration<=600,decodeWarnings,eligibleForBenchmark:!decodeWarnings&&duration<=600,windows,rawTempoSpreadPercent:spread===null?null:+spread.toFixed(1)});
 console.log(title,windows.map(x=>x.bpm||'no estimate').join('/'));
 }catch(e){results.push({id,title,page,error:e.message});console.log(title,'FAILED',e.message.slice(0,120))}
 fs.writeFileSync(__dirname+'/expanded-results.json',JSON.stringify({method:'Independent 30-second first/middle/last windows. No downbeat or tempo truth labels. Raw spread is estimator disagreement, not measured tempo drift.',results},null,2)+'\n');
}
