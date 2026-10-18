const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'dist'),port=Number(process.env.PORT||8080);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
http.createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const uri=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+uri+(uri.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(file,(err,stat)=>{
   if(err||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
   res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache'});
   if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
  });
 }catch{res.writeHead(400);res.end('Bad request');}
}).on('error',err=>{console.error(err.code==='EADDRINUSE'?'Cong 8080 da duoc dung. Dong cua so may chu cu hoac doi PORT.':err.message);process.exitCode=1}).listen(port,'127.0.0.1',()=>console.log('Mo http://localhost:'+port+' - Ctrl+C de dung.'));
