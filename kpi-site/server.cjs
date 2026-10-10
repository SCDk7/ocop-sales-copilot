'use strict';
const express=require('express');
const path=require('node:path');
const app=express();
const port=Number(process.env.KPI_PORT)||3002;
const backend=process.env.OCOP_METRICS_URL||'http://localhost:3000/api/ai/metrics';
app.get('/api/metrics',async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 try{
  const url=new URL(backend);url.searchParams.set('period',['day','week','month','all'].includes(req.query.period)?req.query.period:'day');
  const response=await fetch(url,{signal:AbortSignal.timeout(5000),headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error('Metrics backend unavailable');
  const data=await response.json();
  if(!data || typeof data.requests!=='number' || typeof data.startedAt!=='string')throw new Error('Invalid metrics data');
  res.json(data);
 }catch{res.status(503).json({error:'METRICS_BACKEND_UNAVAILABLE'});}
});
app.use(express.static(path.join(__dirname,'public'),{setHeaders:res=>res.setHeader('Cache-Control','no-cache')}));
app.listen(port,()=>console.log(`OCOP KPI website: http://localhost:${port}`));
