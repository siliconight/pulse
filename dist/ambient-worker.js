importScripts('ambient-core.js');
self.onmessage=e=>{try{const channels=PulseAmbient.wash(e.data.channels,e.data.sampleRate,e.data.duration,e.data.start);self.postMessage({channels},channels.map(c=>c.buffer))}catch(e){self.postMessage({error:e.message})}};
