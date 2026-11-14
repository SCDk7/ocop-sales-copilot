(function(root){
  'use strict';
  let loading, decoded;
  function loadFingerprints(){
    if(root.OCOPImageFingerprints)return Promise.resolve(root.OCOPImageFingerprints);
    if(loading)return loading;
    loading=new Promise((resolve,reject)=>{
      const script=root.document.createElement('script');
      script.src=new URL('image-fingerprints.js',root.document.baseURI).href;
      script.onload=()=>resolve(root.OCOPImageFingerprints||[]);
      script.onerror=()=>reject(new Error('Local image index unavailable'));
      root.document.head.append(script);
    });
    return loading;
  }
  function pixelIndex(){
    if(decoded)return decoded;
    decoded=(root.OCOPImageFingerprints||[]).map(([id,encoded])=>{
      const raw=root.atob(encoded),values=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++)values[i]=raw.charCodeAt(i);
      return {id,values};
    });
    return decoded;
  }
  async function pixels(file){
    const bitmap=await root.createImageBitmap(file);
    try{
      const canvas=root.document.createElement('canvas');canvas.width=24;canvas.height=24;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.fillStyle='#fff';ctx.fillRect(0,0,24,24);ctx.drawImage(bitmap,0,0,24,24);
      const rgba=ctx.getImageData(0,0,24,24).data,values=new Uint8Array(24*24*3);
      for(let i=0,j=0;i<rgba.length;i+=4){values[j++]=rgba[i];values[j++]=rgba[i+1];values[j++]=rgba[i+2];}
      return values;
    }finally{bitmap.close?.();}
  }
  function distance(a,b){let total=0;for(let i=0;i<a.length;i++){const delta=(a[i]-b[i])/255;total+=delta*delta;}return Math.sqrt(total/a.length);}
  function varied(values){const mean=[0,0,0];for(let i=0;i<values.length;i++)mean[i%3]+=values[i]/(values.length/3);let variance=0;for(let i=0;i<values.length;i++)variance+=(values[i]-mean[i%3])**2/(255*255*values.length);return variance>0.006;}
  function reply(product,language){
    const name=root.OCOPLanguage?.productName(product,language)||product.name;
    const unit=root.OCOPLanguage?.unit(product.packaging||product.unit||'',language)||product.packaging||product.unit||'';
    const amount=Number(product.price).toLocaleString('vi-VN')+' đ / '+unit;
    const labels={vi:`Dạ, ảnh gần với **${name}** trong danh mục. Giá niêm yết: ${amount}. Đây là sản phẩm tương tự, chưa xác minh được nhãn và chưa có điểm khớp %. Anh/chị muốn xem chi tiết sản phẩm này không ạ?`,en:`Dạ, this image is close to **${name}** in the catalogue. Listed price: ${amount}. This is a similar product; its label is unverified and no match percentage is available. Would you like to see the product details?`,zh:`Dạ，图片与目录中的 **${name}** 较相似。标价：${amount}。尚未核实标签，也没有相似度百分比。需要查看商品详情吗？`,ko:`Dạ, 사진은 목록의 **${name}** 상품과 비슷합니다. 표시 가격: ${amount}. 라벨은 확인되지 않았으며 일치율 수치는 없습니다. 상품 정보를 보시겠어요?`,ja:`Dạ、画像は掲載中の **${name}** に似ています。表示価格：${amount}。ラベルは未確認で、一致率の数値はありません。商品の詳細をご覧になりますか？`};
    const message=labels[language]||labels.vi;
    return {message,text_response:message,productIds:[product.id],suggested_products:[product.id],imageMatchStatus:'similar',responseMode:'local_reference_image_match',localFallback:true,dynamic_chips:[],combos:[]};
  }
  async function match(files,products,language='vi'){
    if(!files?.length||!Array.isArray(products))return null;
    await loadFingerprints();
    const index=pixelIndex();if(!index.length)return null;
    const productById=new Map(products.map(product=>[product.id,product]));
    for(const file of files){
      let query;try{query=await pixels(file);}catch{continue;}
      if(!varied(query))continue;
      const bestByProduct=new Map();
      for(const row of index){if(!productById.has(row.id))continue;const score=distance(query,row.values);if(score<(bestByProduct.get(row.id)??Infinity))bestByProduct.set(row.id,score);}
      const ranks=[...bestByProduct].sort((a,b)=>a[1]-b[1]);
      if(ranks.length&&ranks[0][1]<=0.12&&(ranks.length===1||ranks[1][1]-ranks[0][1]>=0.025))return reply(productById.get(ranks[0][0]),language);
    }
    return null;
  }
  root.OCOPClientImageMatch={match};
})(typeof window!=='undefined'?window:globalThis);
