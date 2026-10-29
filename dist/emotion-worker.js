importScripts('emotion-core.js');
self.onmessage=e=>{try{const data=PulseEmotion.render(e.data);self.postMessage({data},[data.buffer])}catch(err){self.postMessage({error:err.message})}};
