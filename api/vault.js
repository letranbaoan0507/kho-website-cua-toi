'use strict';
const {createHash}=require('node:crypto');
const KEY='webkho:shared-vault:v1';
const hash=token=>createHash('sha256').update(token).digest('hex');
const tokenOK=t=>typeof t==='string'&&/^[a-f0-9]{64}$/.test(t);
const CAS=`local old=redis.call('GET',KEYS[1]); local revision=0; if old then local row=cjson.decode(old); revision=row.revision; if row.writerHash~=ARGV[2] then return -1 end end; if revision~=tonumber(ARGV[1]) then return 0 end; redis.call('SET',KEYS[1],ARGV[3]); return 1`;
function cloudStore(env=process.env,fetcher=fetch){
 const endpoint=env.UPSTASH_REDIS_REST_URL||env.KV_REST_API_URL;
 const token=env.UPSTASH_REDIS_REST_TOKEN||env.KV_REST_API_TOKEN;
 if(!endpoint||!token)return null;
 async function command(args){const r=await fetcher(endpoint,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('STORE_UNAVAILABLE');const data=await r.json();if(data.error)throw Error('STORE_UNAVAILABLE');return data.result}
 return {async ping(){return command(['PING'])},async read(){const value=await command(['GET',KEY]);return value?JSON.parse(value):null},async save(expected,writerHash,row){return command(['EVAL',CAS,1,KEY,String(expected),writerHash,JSON.stringify(row)])}};
}
function validEnvelope(e){
 if(!e||e.version!==1)return false;
 if(e.format==='an-web-vault-open'){try{require('../dist/core.js').validData(e.data);return true}catch{return false}}
 return e.format==='an-web-vault'&&e.kdf==='PBKDF2-SHA256'&&Number.isInteger(e.iterations)&&e.iterations>=100000&&e.iterations<=1200000&&typeof e.salt==='string'&&Buffer.from(e.salt,'base64').length===16&&typeof e.iv==='string'&&Buffer.from(e.iv,'base64').length===12&&typeof e.ciphertext==='string'&&Buffer.from(e.ciphertext,'base64').length>=16;
}
function createHandler(getStore=()=>cloudStore()){
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff');
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Phương thức không hỗ trợ.'})}
  const store=getStore();if(!store)return res.status(503).json({code:'SYNC_NOT_CONFIGURED',error:'Chưa kết nối lưu trữ đồng bộ. Dữ liệu trên thiết bị vẫn được giữ nguyên.'});
  try{
   if(req.method==='GET'){const row=await store.read();return res.status(200).json({record:row?{revision:row.revision,envelope:row.envelope}:null})}
   const origin=req.headers?.origin;if(origin&&new URL(origin).host!==req.headers.host)return res.status(403).json({error:'Nguồn yêu cầu không hợp lệ.'});
   const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
   if(!body||JSON.stringify(body).length>3*1024*1024)return res.status(413).json({error:'Kho vượt dung lượng cho một lần đồng bộ. Hãy giữ bản sao JSON.'});
   const {expectedRevision,writeToken,newWriteToken,envelope}=body;
   if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0||!tokenOK(writeToken)||!tokenOK(newWriteToken)||!validEnvelope(envelope))return res.status(400).json({error:'Dữ liệu đồng bộ không hợp lệ.'});
   if(envelope.format==='an-web-vault-open'&&envelope.data._syncToken!==newWriteToken)return res.status(400).json({error:'Khóa đồng bộ không khớp.'});
   const row={revision:expectedRevision+1,envelope,writerHash:hash(newWriteToken)};
   const result=await store.save(expectedRevision,hash(writeToken),row);
   if(result===-1)return res.status(403).json({code:'ACCESS_CHANGED',error:'Quyền truy cập kho đã đổi. Hãy mở lại kho.'});
   if(result!==1)return res.status(409).json({code:'CONFLICT',error:'Kho vừa thay đổi trên thiết bị khác. Hãy tải bản mới trước khi lưu.'});
   return res.status(200).json({revision:row.revision});
  }catch{return res.status(503).json({error:'Chưa kết nối được kho đồng bộ. Dữ liệu đang mở chưa bị thay đổi; hãy thử lại.'})}
 };
}
module.exports=createHandler();module.exports.createHandler=createHandler;module.exports.cloudStore=cloudStore;
