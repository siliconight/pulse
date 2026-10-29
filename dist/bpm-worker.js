/* Pulse tempo estimator. Onset autocorrelation, not beat/downbeat detection.
   Input: 100 Hz energy envelope. Results are heuristic, never a certainty. */
function estimateTempo(energy, rate=100) {
  if(energy.length<rate*8)return {reason:'Use at least 8 seconds of rhythmic audio.'};
  const onset=new Float32Array(energy.length);let average=0,total=0,peak=0;
  for(let i=0;i<energy.length;i++){
    const value=Math.sqrt(Math.max(0,energy[i]));
    onset[i]=Math.max(0,value-average);average=.8*average+.2*value;
    total+=onset[i]*onset[i];peak=Math.max(peak,value);
  }
  if(peak<.0001||total<1e-8)return {reason:'No clear rhythm found. Enter the BPM manually.'};
  const onsetPeak=Math.max(...onset),hits=[];
  for(let i=1;i<onset.length-1;i++)if(onset[i]>onsetPeak*.2&&onset[i]>=onset[i-1]&&onset[i]>onset[i+1]&&(!hits.length||i-hits.at(-1)>rate*.12))hits.push(i);
  if(hits.length<8)return {reason:'No repeated beat found. Enter the BPM manually.'};
  const intervals=hits.slice(1).map((h,i)=>h-hits[i]).sort((a,b)=>a-b);
  const interval=intervals[Math.floor(intervals.length/2)],pulseBpm=60*rate/interval;
  const correlation=lag=>{let xy=0,xx=0,yy=0;const l=Math.floor(lag),fraction=lag-l;
    for(let i=l+1;i<onset.length;i++){const x=onset[i],y=onset[i-l]*(1-fraction)+onset[i-l-1]*fraction;xy+=x*y;xx+=x*x;yy+=y*y}
    return xx&&yy?xy/Math.sqrt(xx*yy):0;
  };
  const peaks=[];
  for(let bpm=60;bpm<=200;bpm+=.1)peaks.push({bpm:Math.round(bpm*10)/10,score:correlation(60*rate/bpm)});
  peaks.sort((a,b)=>b.score-a.score);
  let best=peaks[0];
  // Prefer the observed pulse when a longer multiple correlates more strongly.
  const pulse=peaks.filter(p=>Math.abs(p.bpm-pulseBpm)<4).sort((a,b)=>b.score-a.score)[0];
  if(pulse&&pulse.score>=best.score*.72)best=pulse;
  if(best.score<.22)return {reason:'No stable beat found. Try a rhythmic track or enter BPM manually.'};
  const competitors=peaks.filter(p=>Math.abs(p.bpm-best.bpm)>3&&Math.abs(p.bpm-best.bpm*2)>3&&Math.abs(p.bpm-best.bpm/2)>3);
  const margin=best.score-(competitors[0]?.score||0);
  return {bpm:best.bpm,confidence:best.score>.65&&margin>.08?'Stronger':'Tentative',score:best.score};
}
if(typeof module!=='undefined')module.exports={estimateTempo};
else self.onmessage=e=>{try{self.postMessage(estimateTempo(e.data.energy))}catch{self.postMessage({reason:'Tempo analysis failed. You can still enter BPM manually.'})}};
