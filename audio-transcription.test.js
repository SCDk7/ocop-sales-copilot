const test=require('node:test'),assert=require('node:assert/strict');
const {transcribeAudio}=require('./audio-transcription');
const audio=Buffer.concat([Buffer.from([0x1a,0x45,0xdf,0xa3]),Buffer.from('test audio')]);
test('recorded WebM uses one Gemini request and only returns a transcript',async()=>{
 const text=await transcribeAudio(audio,'audio/webm;codecs=opus','vi',{},async(_config,payload,options)=>{
  assert.equal(options.maxAttempts,1);assert.equal(payload.contents[0].parts[1].inline_data.mime_type,'audio/webm');
  return {response:{ok:true},data:{candidates:[{content:{parts:[{text:JSON.stringify({transcription:' tìm trà Hà Nội '})}]}}]}};
 });
 assert.equal(text,'tìm trà Hà Nội');
});
test('invalid audio is rejected before provider use and provider failure is not fabricated speech',async()=>{
 await assert.rejects(transcribeAudio(Buffer.from('not audio'),'audio/webm','vi',{},()=>{throw Error('Must not call');}),error=>error.status===400);
 await assert.rejects(transcribeAudio(audio,'audio/webm','vi',{},async()=>({response:{ok:false,status:503}})),error=>error.status===503);
});
test('silence stays empty and MP4 audio from mobile recorders is accepted',async()=>{
 const mp4=Buffer.concat([Buffer.alloc(4),Buffer.from('ftypisom')]);
 assert.equal(await transcribeAudio(mp4,'audio/mp4','en',{},async()=>({response:{ok:true},data:{candidates:[{content:{parts:[{text:'{"transcription":""}'}]}}]}})),'');
});
