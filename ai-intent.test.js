const test=require('node:test'),assert=require('node:assert/strict');
const shopping=require('./ai-shopping'),intent=require('./ai-intent');
const {PRODUCTS}=require('./data.js');
const semantic={task:'shopping',isCombo:true,hasExplicitItemCount:false,pricePreference:'none',maxPrice:6000000,minPrice:0,minItems:3,maxItems:3,exactRegion:'',regionKeyword:'',categoryOrKeyword:'',wikipediaQuery:'',needsClarification:false,clarification:''};
const rng=()=>{let n=42;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};};

test('a punctuated combo choice completes the four-million budget even when Gemini misclassifies it', () => {
 for (const answer of ['com,bo', 'com.bo', 'COM-BO', 'combo']) {
  const messages=[{role:'user',text:'4tr'},{role:'assistant',text:'Anh/chị muốn 1 món hay combo tổng ngân sách 4.000.000 ₫?'},{role:'user',text:answer}];
  const local=shopping.resolve(messages,PRODUCTS,query => ({isCombo:false,categoryOrKeyword:/\bcom\b/.test(query) ? 'bánh' : null}));
  const resolved=intent.merge(local,{...semantic,isCombo:false,maxPrice:300000,categoryOrKeyword:'bánh',exactRegion:'Đồng Nai'},messages,PRODUCTS);
  assert.equal(resolved.isCombo,true);
  assert.equal(resolved.purchaseMode,'combo');
  assert.equal(resolved.maxPrice,4000000);
  assert.equal(resolved.categoryOrKeyword,null);
  assert.equal(resolved.exactRegion,undefined);
  const {composeDataReply}=require('./ai-data-reply');
  resolved.comboPlans=shopping.variants(PRODUCTS,resolved,3,rng());
  resolved.hasVerifiedCombo=true;
  const reply=composeDataReply(PRODUCTS,resolved,'vi');
  assert.equal(reply.combos.length,3);
  assert(reply.combos.every(plan=>plan.total===4000000 && plan.items.length>1));
  assert.match(reply.message,/combo/);
 }
});

test('combo corrections keep province and category while rice-and-beef wording is not a combo', () => {
 const messages=[{role:'user',text:'trà Đồng Nai ngân sách 4tr'},{role:'user',text:'com,bo nhé'}];
 const resolved=intent.merge(shopping.resolve(messages,PRODUCTS),{...semantic,isCombo:false,maxPrice:500000,categoryOrKeyword:'bánh',exactRegion:'Hà Nội'},messages,PRODUCTS);
 assert.equal(resolved.maxPrice,4000000);
 assert.equal(resolved.categoryOrKeyword,'trà');
 assert.equal(resolved.exactRegion,'Đồng Nai');
 assert.equal(resolved.isCombo,true);
 assert.equal(shopping.analyze('cơm,bò',PRODUCTS).isCombo,false);
});

test('changing Dong Nai to Southern region retains the six-item five-million request despite stale model fields',()=>{
 const messages=[{role:'user',text:'combo 5tr 6 món khu vực đồng nai'},{role:'assistant',text:'Chưa tìm được combo phù hợp.'},{role:'user',text:'vậy khu vực miền nam,'}];
 const resolved=intent.merge(shopping.resolve(messages,PRODUCTS),{...semantic,isCombo:false,maxPrice:6000000,exactRegion:'Đồng Nai'},messages,PRODUCTS);
 assert.equal(resolved.maxPrice,5000000);assert.equal(resolved.minItems,6);assert.equal(resolved.maxItems,6);
 assert.equal(resolved.isCombo,true);assert.equal(resolved.exactRegion,null);assert.deepEqual(resolved.exactRegions,[]);assert.equal(resolved.regionKeyword,'Miền Nam');
 const eligible=PRODUCTS.filter(p=>shopping.regionMatches(p,resolved));
 const plans=shopping.variants(eligible,resolved,3,rng());assert(plans.length>0);
 assert(plans.every(plan=>plan.items.length===6 && plan.total<=5000000 && plan.items.every(p=>shopping.regionMatches(p,resolved))));
});

test('a money reply cannot lose the purchase mode explicitly selected in the conversation',()=>{
 for(const [question,mode] of [['Hello cho tôi một combo 300',true],['Tôi cần 1 món',false]]){
  const messages=[{role:'user',text:question},{role:'assistant',text:'Ngân sách bao nhiêu?'},{role:'user',text:'300k'}];
  const result=intent.merge(shopping.resolve(messages,PRODUCTS),{...semantic,isCombo:!mode,maxPrice:0},messages,PRODUCTS);
  assert.equal(result.isCombo,mode);assert.equal(result.maxPrice,300000);
 }
});
test('choosing one product after a budget clarification cannot be changed into a combo by stale model intent',()=>{
 const messages=[{role:'user',text:'combo 3 món 1tr'},{role:'user',text:'2tr'},{role:'user',text:'1 món'}];
 const result=intent.merge(shopping.resolve(messages,PRODUCTS),{...semantic,maxPrice:2000000,hasExplicitItemCount:true},messages,PRODUCTS);
 assert.equal(result.isCombo,false);assert.equal(result.isGift,false);assert.equal(result.maxPrice,2000000);
});

test('latest screenshot correction overrides a stale five-item model result and survives budget follow-ups',()=>{
 const messages=[{role:'user',text:'combo 5 món 2tr'},{role:'user',text:'ý là đưa combo 2tr những dưới 5 món'}];
 const local=shopping.resolve(messages,PRODUCTS);
 const resolved=intent.merge(local,{...semantic,maxPrice:2000000,hasExplicitItemCount:true,minItems:5,maxItems:5},messages,PRODUCTS);
 assert.equal(resolved.maxPrice,2000000);assert.equal(resolved.minItems,2);assert.equal(resolved.maxItems,4);
 const plans=shopping.variants(PRODUCTS,resolved,3,rng());assert.equal(plans.length,3);
 assert(plans.every(p=>p.items.length<5 && p.total<=2000000));
 messages.push({role:'user',text:'đổi ngân sách thành 3tr'});
 const followup=intent.merge(shopping.resolve(messages,PRODUCTS),{...semantic,maxPrice:3000000,hasExplicitItemCount:false,minItems:0,maxItems:0},messages,PRODUCTS);
 assert.equal(followup.maxPrice,3000000);assert.equal(followup.maxItems,4);
});
test('combo6tr is a budget, not a default number of items; explicit corrections override model amounts',()=>{
 const messages=[{role:'user',text:'combo6tr'}];const result=intent.merge(shopping.resolve(messages,PRODUCTS),semantic,messages,PRODUCTS);
 assert.equal(result.maxPrice,6000000);assert.equal(result.minItems,null);assert.equal(result.maxItems,null);
 messages.push({role:'user',text:'đổi thành 4 món dưới 5tr'});
 const changed=intent.merge(shopping.resolve(messages,PRODUCTS),{...semantic,hasExplicitItemCount:true,maxPrice:6000000,minItems:3,maxItems:3},messages,PRODUCTS);
 assert.equal(changed.maxPrice,5000000);assert.equal(changed.minItems,4);assert.equal(changed.maxItems,4);
 const regional=intent.merge(shopping.resolve([{role:'user',text:'combo 4 món Tây Nguyên dưới 5tr'}],PRODUCTS),{...semantic,regionKeyword:'Tây Nguyên',categoryOrKeyword:'đặc sản Tây Nguyên',hasExplicitItemCount:true},[{role:'user',text:'combo 4 món Tây Nguyên dưới 5tr'}],PRODUCTS);
 assert.equal(regional.categoryOrKeyword,null);assert.equal(regional.regionKeyword,'Tây Nguyên');
});
test('three random combinations use catalogue prices, preserve restrictions and have no implicit eight-item cap',()=>{
 const plans=shopping.variants(PRODUCTS,{maxPrice:6000000},3,rng());assert.equal(plans.length,3);
 assert.equal(new Set(plans.map(p=>p.items.map(i=>i.id).sort().join(','))).size,3);
 for(const plan of plans){assert(plan.total<=6000000);assert.equal(plan.total,plan.items.reduce((n,p)=>n+p.price,0));assert(plan.averagePrice>=750000);assert(plan.items.every(p=>PRODUCTS.some(original=>original.id===p.id&&original.price===p.price)));}
 const samePrice=Array.from({length:14},(_,i)=>({id:900+i,name:'Medium '+i,region:'Hà Nội',price:600000}));
 const many=shopping.variants(samePrice,{maxPrice:6000000},3,rng());assert.equal(many.length,3);assert(many.every(plan=>plan.items.length===10&&plan.total===6000000));
 const constrained=shopping.variants(PRODUCTS,{maxPrice:5000000,minItems:4,maxItems:4,regionKeyword:'Tây Nguyên',excludedTerms:['ruou']},3,rng());assert(constrained.length);
 for(const plan of constrained){assert.equal(plan.items.length,4);assert(plan.items.every(p=>shopping.regionMatches(p,{regionKeyword:'Tây Nguyên'})&&shopping.allowed(p,{excludedTerms:['ruou']})));}
});
test('intent requests use structured Gemini output and reject malformed provider responses',async()=>{
 let payload;const fake=async(url,options)=>{assert(url.startsWith('https://generativelanguage.googleapis.com/'));payload=JSON.parse(options.body);return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify({...semantic,minItems:0,maxItems:0})}]}}]}),{status:200});};
 const result=await intent.understand({language:'vi',messages:[{role:'user',text:'combo6tr'}],products:PRODUCTS},{model:'test-model',apiKey:'test-key'},fake);
 assert.equal(result.maxPrice,6000000);assert.equal(payload.generationConfig.responseMimeType,'application/json');assert(payload.system_instruction.parts[0].text.includes('never 6 items'));
 await assert.rejects(()=>intent.understand({language:'vi',messages:[],products:PRODUCTS},{model:'test',apiKey:'test'},async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:'{}'}]}}]}))));
});

test('price preference survives semantic parsing without becoming a product category',()=>{
 const messages=[{role:'user',text:'mình muốn tìm kiếm một số món có giá trị cao'}];
 const result=intent.merge(shopping.resolve(messages,PRODUCTS),{...semantic,isCombo:false,maxPrice:0,pricePreference:'high',categoryOrKeyword:'giá trị cao'},messages,PRODUCTS);
 assert.equal(result.pricePreference,'high');assert.equal(result.categoryOrKeyword,null);assert.equal(result.isCombo,false);
 const recommended=shopping.recommendations(PRODUCTS,result);
 assert.equal(recommended[0].price,Math.max(...PRODUCTS.map(p=>p.price)));
 const changed=[...messages,{role:'user',text:'giá rẻ hơn dưới 500k'}];
 const correction=intent.merge(shopping.resolve(changed,PRODUCTS),{...semantic,isCombo:false,maxPrice:6000000,pricePreference:'high'},changed,PRODUCTS);
 assert.equal(correction.pricePreference,'low');assert.equal(correction.maxPrice,500000);
});

test('one Gemini request understands and answers using supplied catalogue and Wikipedia context',async()=>{
 let calls=0,payload;
 const answer={...semantic,isCombo:false,maxPrice:0,minItems:0,maxItems:0,pricePreference:'high',replyMessage:'Dạ, mình gợi ý các món có giá niêm yết cao.',replyProductIds:[492],replyHandoffAdmin:false,replyChips:['Ngân sách?']};
 const validation={language:'vi',messages:[{role:'user',text:'Tìm món có giá trị cao'}],products:PRODUCTS};
 const options={maxAttempts:1,replyContext:{systemInstruction:'Current catalogue: id492 price7000000. Wikipedia: Nhân sâm https://vi.wikipedia.org/wiki/Nhân_sâm'}};
 const fake=async(_url,request)=>{calls++;payload=JSON.parse(request.body);return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(answer)}]}}]}));};
 const parsed=await intent.understand(validation,{model:'gemini-3.1-flash-lite',apiKey:'test'},fake,options);
 assert.equal(calls,1);assert.equal(parsed.pricePreference,'high');assert.equal(parsed.isCombo,false);assert.equal(parsed.provider,'gemini');assert.deepEqual(parsed.reply.productIds,[492]);
 assert(payload.system_instruction.parts[0].text.includes('price7000000'));assert(payload.system_instruction.parts[0].text.includes('Wikipedia: Nhân sâm'));assert.deepEqual(JSON.parse(payload.contents[0].parts[0].text).messages,validation.messages);
 assert(payload.generationConfig.responseSchema.required.includes('replyMessage'));assert.equal(payload.generationConfig.thinkingConfig.thinkingLevel,'minimal');
 await assert.rejects(()=>intent.understand(validation,{model:'test',apiKey:'test'},async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify({...answer,replyProductIds:['492']})}]}}]})),options),/Invalid combined Gemini response/);
});
