class PulseCapture extends AudioWorkletProcessor{
 constructor(){super();this.active=false;this.buff=[new Float32Array(4096),new Float32Array(4096)];this.n=0;this.port.onmessage=e=>{if(e.data.finish){this.active=false;this.flush();this.port.postMessage({done:true})}else this.active=e.data.active}}
 flush(){if(!this.n)return;this.port.postMessage(this.buff.map(c=>c.slice(0,this.n)));this.n=0}
 process(inputs,outputs){const input=inputs[0],out=outputs[0];if(!input.length)return true;for(let c=0;c<out.length;c++)out[c].set(input[c]||input[0]);if(this.active)for(let i=0;i<input[0].length;i++){this.buff[0][this.n]=input[0][i];this.buff[1][this.n]=(input[1]||input[0])[i];if(++this.n===4096)this.flush()}return true}
}registerProcessor('pulse-capture',PulseCapture);
