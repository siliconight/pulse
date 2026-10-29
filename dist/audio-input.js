/* Browser decoding varies by platform. Signatures identify containers, not codec support. */
(function(root){
const extensions=/\.(wav|mp3|flac|ogg|oga|m4a|aac|aif|aiff)$/i;
function sniff(bytes){const b=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes),ascii=(start,n)=>String.fromCharCode(...b.slice(start,start+n));if(b.length<12)return null;if(ascii(0,4)==='RIFF'&&ascii(8,4)==='WAVE')return 'wav';if(ascii(0,4)==='fLaC')return 'flac';if(ascii(0,4)==='OggS')return 'ogg';if(ascii(0,4)==='FORM'&&['AIFF','AIFC'].includes(ascii(8,4)))return 'aiff';if(ascii(4,4)==='ftyp')return 'm4a';if(ascii(0,3)==='ID3'||b[0]===255&&(b[1]&224)===224)return 'mp3';if(b[0]===255&&(b[1]&246)===240)return 'aac';return null}
function valid(name,bytes){return extensions.test(name)&&!!sniff(bytes)}
const api={sniff,valid};if(typeof module!=='undefined')module.exports=api;else root.PulseInput=api;
})(globalThis);
