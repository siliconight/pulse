const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.wav':'audio/wav'};
http.createServer((req,res)=>{
 let file;try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));}catch{res.writeHead(400).end();return;}
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
}).listen(8000,'127.0.0.1',()=>console.log('Pulse: http://localhost:8000 (Ctrl+C to stop)'));
