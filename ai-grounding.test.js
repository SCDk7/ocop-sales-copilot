const test=require('node:test'),assert=require('node:assert/strict');const {safeURL,parseGrounding,lookupGoogle}=require('./ai-grounding');
test('OCOP shop knowledge never matches online communities sharing the acronym',()=>{
 const {relevantWikiSource}=require('./ai-grounding');
 assert.equal(relevantWikiSource({title:'Virtual community of practice',extract:'Online community of practice (OCoP)'},'OCOP'),false);
 assert.equal(relevantWikiSource({title:'One village one product',extract:'Local product development'},'One village one product'),true);
 const {planWikipedia}=require('./ai-wikipedia');
 assert.equal(planWikipedia({isOcopKnowledge:true},{wikipediaQuery:'OCOP'},'OCOP là gì?',[],'vi').query,'Mỗi xã một sản phẩm');
});
test('Wikipedia rejects lookalike people and unrelated regions',()=>{const {relevantWikiSource}=require('./ai-grounding');assert(!relevantWikiSource({title:'Trà Giang (diễn viên)'},'trà Hà Giang'));assert(!relevantWikiSource({title:'Hà Nội'},'trà Hà Giang'));assert(relevantWikiSource({title:'Hà Giang'},'trà Hà Giang'));assert(!relevantWikiSource({title:'Tây Ban Nha'},'Tây Nguyên'))});
test('grounding exposes only actual public HTTPS sources',()=>{const r=parseGrounding({candidates:[{content:{parts:[{text:'Facts'}]},groundingMetadata:{webSearchQueries:['tea'],groundingChunks:[{web:{uri:'javascript:alert(1)',title:'Bad'}},{web:{uri:'https://example.com/tea',title:'Tea'}},{web:{uri:'https://127.0.0.1/private',title:'Private'}}],searchEntryPoint:{renderedContent:'<div>Search</div>'}}}]});assert.equal(r.sources.length,1);assert(r.searched);assert.equal(r.text,'Facts');assert.equal(safeURL('https://name:pass@example.com'),null)});
test('no metadata or key cannot be presented as a successful search',async()=>{assert.equal(parseGrounding({candidates:[{content:{parts:[{text:'Unverified'}]}}]}).text,'');assert.equal((await lookupGoogle('tea',{})).sources.length,0)});
test('OCOP background does not cite generic country or political pages', () => {
  const {relevantWikiSource} = require('./ai-grounding');
  const query='Chương trình Mỗi xã một sản phẩm';
  assert.equal(relevantWikiSource({title:'Đảng Cộng sản Việt Nam',extract:'Chính trị Việt Nam'},query),false);
  assert.equal(relevantWikiSource({title:'Việt Nam',extract:'Một quốc gia'},query),false);
  assert.equal(relevantWikiSource({title:'Mỗi xã một sản phẩm',extract:'Chương trình OCOP'},query),true);
});
