const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const files=JSON.parse(fs.readFileSync(path.join(__dirname,'dist.sha256.json'),'utf8'));
for(const [file,expected] of Object.entries(files)){
 const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,file))).digest('hex');
 if(actual!==expected)throw Error('Tep khong con trung ban website goc: '+file);
}
console.log('OK: '+Object.keys(files).length+' tep website khop tung byte voi ban da trien khai.');
