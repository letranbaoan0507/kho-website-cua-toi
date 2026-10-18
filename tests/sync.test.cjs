'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const crypto=require('node:crypto').webcrypto;if(!globalThis.crypto)Object.defineProperty(globalThis,'crypto',{value:crypto});
const C=require('../dist/core.js'),{createHandler}=require('../api/vault.js');
let shared=null;
const store={async read(){return structuredClone(shared)},async save(expected,writerHash,row){if(shared&&shared.writerHash!==writerHash)return -1;if((shared?.revision||0)!==expected)return 0;shared=structuredClone(row);return 1}};
const handler=createHandler(()=>store);
async function request(method,body){let status=200,data;const res={setHeader(){},status(n){status=n;return this},json(value){data=value;return this}};await handler({method,body,headers:{}},res);return{ok:status>=200&&status<300,status,json:async()=>structuredClone(data)}}
const app=fs.readFileSync('dist/app.js','utf8'),html=fs.readFileSync('dist/index.html','utf8');
function client(initial){const elements={},persisted=new Map(initial?[['main',structuredClone(initial)]]:[]);
 class Element{constructor(){this.value='';this.checked=false;this.disabled=false;this.hidden=false;this.children=[];this.style={};this.dataset={};this.parts={};this.parentElement={hidden:false};this.classList={add(){},remove(){},toggle(){}}}set innerHTML(s){this.html=s;if(String(s).includes('id="viewCount"'))elements.viewCount=new Element()}get innerHTML(){return this.html||''}querySelector(tag){return this.parts[tag]||(this.parts[tag]=new Element())}querySelectorAll(){return[]}addEventListener(n,fn){this[n]=fn}focus(){}reset(){}close(){this.open=false}showModal(){this.open=true}appendChild(){}remove(){}click(){}}
 for(const m of html.matchAll(/id="([^"]+)"/g))elements[m[1]]=new Element();elements.statusFilter.value='all';elements.sort.value='new';elements.gateSecurity.value='password';
 const db={close(){},createObjectStore(){},transaction(){const tx={aborted:false};tx.objectStore=()=>({get(key){const req={};queueMicrotask(()=>{req.result=structuredClone(persisted.get(key));req.onsuccess?.()});return req},put(value,key){queueMicrotask(()=>{if(tx.aborted)return;persisted.set(key,structuredClone(value));tx.oncomplete?.()})}});tx.abort=()=>{tx.aborted=true;queueMicrotask(()=>tx.onabort?.())};return tx}};
 const document={hidden:false,getElementById:id=>{assert(elements[id],id);return elements[id]},querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>new Element(),body:new Element()};
 const context=vm.createContext({console,document,window:{crypto},crypto,navigator:{},VaultCore:C,indexedDB:{open(){const req={result:db};queueMicrotask(()=>req.onsuccess?.());return req}},fetch:async(url,options)=>{assert.equal(url,'/api/vault');return request(options.method,options.body?JSON.parse(options.body):undefined)},AbortSignal,BroadcastChannel:undefined,structuredClone,queueMicrotask,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,URL,Blob});vm.runInContext(app,context);return {elements,persisted,run:s=>vm.runInContext(s,context)};
}
const settle=async c=>{for(let i=0;i<300;i++){await new Promise(r=>setTimeout(r,10));if(!c.run('busy')&&!c.elements.gateSubmit.disabled)return}throw Error('Client did not settle')};
const submit=async(c,pass)=>{c.elements.gatePass.value=pass;c.elements.gateConfirm.value=pass;c.elements.gateForm.onsubmit({preventDefault(){}});await settle(c)};
(async()=>{
 const old=C.fresh();C.add(old,{url:'https://old.example',title:'Website đã lưu từ trước'});const encrypted=await C.create(old,'old-password-2026'),original={revision:7,envelope:encrypted.envelope};
 const a=client(original);await settle(a);await submit(a,'old-password-2026');assert.equal(shared.revision,1);assert.equal(a.run('session.data.entries.length'),1);assert.deepEqual(a.persisted.get('legacy'),original);assert(!JSON.stringify(shared).includes('old.example'));
 const response=await request('GET');const read=await response.json();assert(!('writerHash' in read.record));
 const b=client();await settle(b);await submit(b,'wrong-password');assert.equal(b.run('session'),null);await submit(b,'old-password-2026');assert.equal(b.run('session.data.entries.length'),1);
 await a.run("task(()=>mutate(d=>C.add(d,{url:'https://second.example',title:'Website thứ hai'})))");await b.run('refreshCloud()');assert.equal(b.run('session.data.entries.length'),2);
 await a.run("task(()=>mutate(d=>C.add(d,{url:'https://third.example'})))");await b.run("task(()=>mutate(d=>C.add(d,{url:'https://stale.example'})))");assert.equal(b.run('session'),null);assert.equal((await C.unlock(shared.envelope,'old-password-2026')).data.entries.length,3);
 a.elements.passwordSecurity.value='none';a.elements.oldPass.value='old-password-2026';a.elements.passwordForm.onsubmit({preventDefault(){}});await settle(a);assert.equal(shared.envelope.format,'an-web-vault-open');assert.equal(a.run('session.key'),null);
 const c=client();await settle(c);assert.equal(c.run('session.data.entries.length'),3);assert.equal(c.elements.app.hidden,false);
 c.elements.passwordSecurity.value='password';c.elements.newPass.value=c.elements.newConfirm.value='new-password-2026';c.elements.passwordForm.onsubmit({preventDefault(){}});await settle(c);assert.equal(shared.envelope.format,'an-web-vault');assert(!JSON.stringify(shared).includes('second.example'));
 await a.run("task(()=>mutate(d=>C.add(d,{url:'https://revoked.example'})))");assert.equal(a.run('session'),null);await assert.rejects(()=>C.unlock(shared.envelope,'old-password-2026'));assert.equal((await C.unlock(shared.envelope,'new-password-2026')).data.entries.length,3);
 const unavailable=createHandler(()=>null);let result;await unavailable({method:'GET'},{setHeader(){},status(s){assert.equal(s,503);return this},json(d){result=d}});assert.equal(result.code,'SYNC_NOT_CONFIGURED');
 console.log('PASS: migrate legacy encrypted vault without loss; separate devices read/write same vault; encryption; stale-write protection; no-password auto-open; password restoration and revoked writer; explicit missing-storage response.');
})().catch(e=>{console.error(e);process.exitCode=1});
