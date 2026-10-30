// Download only explicitly CC0-marked pilot tracks from their current FMA pages.
// Run: node research/cc0/fetch.cjs. Review each license page before reuse.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const tracks=[
 ['game-boi-1','https://freemusicarchive.org/music/holiznacc0/gamer-soundtrack-game-boi/game-boi-1/'],
 ['something-in-the-air','https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/something-in-the-air/'],
 ['dark-ambient-cave','https://freemusicarchive.org/music/techtheist/fma2021-part-2/dark-ambient-cave-experience/'],
 ['classic','https://freemusicarchive.org/music/holiznacc0/rock-montage/classic/']
];
const folder=path.join(__dirname,'audio');fs.mkdirSync(folder,{recursive:true});
for(const [name,page] of tracks){
 const html=cp.execFileSync('curl',['-fsSL','--max-time','40',page],{encoding:'utf8',maxBuffer:2e6});
 if(!/licensed under a CC0 1\.0 Universal License/i.test(html.replace(/<[^>]*>/g,'').replace(/\s+/g,' ')))throw Error(`${name}: page does not explicitly identify CC0; stop and review`);
 const match=html.match(/fileUrl":"([^"]+)/);if(!match)throw Error(`${name}: source URL unavailable`);
 const url=JSON.parse('"'+match[1]+'"');if(!url.startsWith('https://files.freemusicarchive.org/'))throw Error(`${name}: unexpected file host`);
 cp.execFileSync('curl',['-fLsS','--max-time','120','-o',path.join(folder,name+'.mp3'),url]);
 console.log(name,'downloaded from',page);
}
