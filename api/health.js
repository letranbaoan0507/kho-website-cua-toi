'use strict';
const {cloudStore}=require('./vault.js');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'})}
 const store=cloudStore();
 if(!store)return res.status(200).json({configured:false,connected:false});
 try{await store.ping();return res.status(200).json({configured:true,connected:true})}
 catch{return res.status(503).json({configured:true,connected:false})}
};
