const test=require('node:test'),assert=require('node:assert/strict');
const shopping=require('./ai-shopping'),intent=require('./ai-intent');
const {PRODUCTS}=require('./data.js');
const semantic={task:'shopping',isCombo:true,hasExplicitItemCount:false,pricePreference:'none',maxPrice:6000000,minPrice:0,minItems:3,maxItems:3,exactRegion:'',regionKeyword:'',categoryOrKeyword:'',wikipediaQuery:'',needsClarification:false,clarification:''};
const rng=()=>{let n=42;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};};
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
