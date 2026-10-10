'use strict';
const $=id=>document.getElementById(id),text=(vi,en)=>language==='vi'?vi:en;
let language='vi',lastMetrics=null,controller=null;
try{language=localStorage.getItem('ocop-kpi-language')==='en'?'en':'vi';}catch{}
const colors=['#245941','#b99547','#77a98a','#729bb7','#b97c65','#7b739a'];
const percentage=value=>value==null?'—':(value*100).toFixed(1)+'%';
const number=value=>Number(value||0).toLocaleString(language==='vi'?'vi-VN':'en-GB');
function renderLanguage(){
 document.documentElement.lang=language;document.title=text('OCOP • Bảng KPI','OCOP • KPI Dashboard');
 document.querySelectorAll('[data-vi]').forEach(el=>el.textContent=el.dataset[language]);
 $('lang').textContent=text('English','Tiếng Việt');
 if(lastMetrics)renderMetrics(lastMetrics);
}
function svgElement(tag,attributes={},content){
 const node=document.createElementNS('http://www.w3.org/2000/svg',tag);
 for(const [key,value] of Object.entries(attributes))node.setAttribute(key,value);
 if(content!=null)node.textContent=content;return node;
}
function empty(container){container.replaceChildren();const p=document.createElement('p');p.className='empty';p.textContent=text('Chưa có dữ liệu trong khoảng này','No data in this period');container.append(p);}
function drawHours(data){
 const holder=$('hourChart');holder.replaceChildren();
 if(!data.requests){empty(holder);$('hourSummary').textContent='';return;}
 const rows=data.hourly,maximum=Math.max(1,...rows.map(r=>r.requests)),top=28,bottom=205,left=40,right=565;
 const svg=svgElement('svg',{viewBox:'0 0 590 245',role:'img','aria-label':text('Biểu đồ lượt chat theo giờ','Hourly chat request chart')});
 for(let i=0;i<=4;i++){
  const value=Math.ceil(maximum/4)*i,y=bottom-(value/(Math.ceil(maximum/4)*4))*(bottom-top);
  svg.append(svgElement('line',{x1:left,x2:right,y1:y,y2:y,stroke:'#e4ece3'}),svgElement('text',{x:left-8,y:y+4,'text-anchor':'end',fill:'#758678','font-size':11},value));
 }
 const ceiling=Math.ceil(maximum/4)*4,point=row=>[left+row.hour*(right-left)/23,bottom-row.requests/ceiling*(bottom-top)];
 const points=rows.map(point);
 svg.append(svgElement('path',{d:`M ${left},${bottom} L ${points.map(p=>p.join(',')).join(' L ')} L ${right},${bottom} Z`,fill:'#ebf3e9'}));
 svg.append(svgElement('polyline',{points:points.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#326849','stroke-width':2.5}));
 for(const row of rows){
  const [x,y]=point(row),label=`${String(row.hour).padStart(2,'0')}:00 · ${number(row.requests)} ${text('lượt chat','requests')}`;
  const circle=svgElement('circle',{cx:x,cy:y,r:4,fill:'#326849',tabindex:0,'aria-label':label});circle.append(svgElement('title',{},label));
  const show=()=>{$('hourSummary').textContent=label;};circle.addEventListener('focus',show);circle.addEventListener('pointerenter',show);circle.addEventListener('click',show);svg.append(circle);
  if([0,4,8,12,16,20,23].includes(row.hour))svg.append(svgElement('text',{x,y:230,'text-anchor':'middle',fill:'#758678','font-size':11},`${row.hour}h`));
 }
 holder.append(svg);
 const peak=rows.reduce((a,b)=>b.requests>a.requests?b:a,rows[0]);
 $('hourSummary').textContent=text(`Cao nhất: ${peak.hour}h · ${number(peak.requests)} lượt chat`,`Peak: ${peak.hour}:00 · ${number(peak.requests)} requests`);
}
function drawProducts(data){
 const holder=$('productChart'),legend=$('productLegend');holder.replaceChildren();legend.replaceChildren();
 if(!data.productInterest.length){empty(holder);return;}
 const rows=data.productInterest.slice(0,5).map(p=>({name:language==='en'?p.nameEn:p.name,count:p.count}));
 const other=data.productInterest.slice(5).reduce((sum,p)=>sum+p.count,0);if(other)rows.push({name:text('Sản phẩm khác','Other products'),count:other});
 const total=rows.reduce((sum,p)=>sum+p.count,0),svg=svgElement('svg',{viewBox:'0 0 160 160',role:'img','aria-label':text('Tỷ trọng sản phẩm được tư vấn và tra cứu','Recommended and retrieved product distribution')});let offset=0;
 rows.forEach((row,index)=>{
  const share=row.count/total,label=`${row.name}: ${number(row.count)} (${percentage(share)})`;
  const circle=svgElement('circle',{cx:80,cy:80,r:57,fill:'none',stroke:colors[index],'stroke-width':20,pathLength:100,'stroke-dasharray':`${share*100} ${100-share*100}`,'stroke-dashoffset':-offset,transform:'rotate(-90 80 80)',tabindex:0,'aria-label':label});
  circle.append(svgElement('title',{},label));svg.append(circle);offset+=share*100;
  const li=document.createElement('li'),swatch=document.createElement('span'),name=document.createElement('span'),count=document.createElement('b');
  swatch.className='swatch';swatch.style.backgroundColor=colors[index];name.className='name';name.textContent=row.name;count.textContent=percentage(share);li.title=label;li.append(swatch,name,count);legend.append(li);
 });
 svg.append(svgElement('text',{x:80,y:78,'text-anchor':'middle',fill:'#193b32','font-size':23,'font-weight':700},number(total)),svgElement('text',{x:80,y:96,'text-anchor':'middle',fill:'#758678','font-size':10},text('lượt ghi nhận','observations')));holder.append(svg);
}
function renderMetrics(data){
 $('requests').textContent=number(data.requests);$('sessions').textContent=number(data.trackedSessions);$('drafts').textContent=number(data.draftOrders);
 $('latency').textContent=data.averageResponseMs==null?'—':(data.averageResponseMs/1000).toFixed(2)+' s';
 $('conversion').textContent=percentage(data.conversionRate);$('handoff').textContent=percentage(data.handoffRate);$('automation').textContent=percentage(data.automationRate);$('tools').textContent=percentage(data.toolSuccessRate);
 $('accuracy').textContent=text('Chưa đo','Not measured');$('gemini').textContent=number(data.geminiResponses);$('wiki').textContent=number(data.wikipediaResponses);
 $('paidRevenue').textContent=number(data.paidRevenue)+' ₫';$('chatbotRevenue').textContent=number(data.chatbotPaidRevenue)+' ₫';$('businessOrders').textContent=number(data.confirmedOrders)+' / '+number(data.completedOrders);
 $('paidDetail').textContent=text(`${number(data.paidOrders)} đơn được người bán xác nhận đã thu tiền; gồm phí giao`,`${number(data.paidOrders)} orders with seller-confirmed payment; includes shipping`);
 $('requestDetail').textContent=text(`${number(data.successful)} thành công · ${number(data.failed)} lỗi`,`${number(data.successful)} successful · ${number(data.failed)} errors`);
 $('draftDetail').textContent=text(`${number(data.unlinkedDraftOrders)} đơn chưa gắn với phiên trong khoảng này`,`${number(data.unlinkedDraftOrders)} drafts without a session in this period`);
 $('latencyDetail').textContent=text('Mục tiêu <3 giây · Thời gian backend','Target <3 seconds · Backend time');
 $('conversionDetail').textContent=text(`${number(data.convertedSessions)} / ${number(data.trackedSessions)} phiên có đơn nháp`,`${number(data.convertedSessions)} / ${number(data.trackedSessions)} sessions with drafts`);
 $('handoffDetail').textContent=text(`${number(data.handoffSessions)} / ${number(data.trackedSessions)} phiên cần hỗ trợ`,`${number(data.handoffSessions)} / ${number(data.trackedSessions)} sessions need assistance`);
 $('toolDetail').textContent=text(`${number(data.toolSuccessful)} / ${number(data.toolCalls)} lần gọi · ${number(data.toolFailed)} lỗi`,`${number(data.toolSuccessful)} / ${number(data.toolCalls)} calls · ${number(data.toolFailed)} errors`);
 const locale=language==='vi'?'vi-VN':'en-GB',date=value=>new Date(value).toLocaleString(locale,{timeZone:'Asia/Ho_Chi_Minh'});
 $('status').className='status';$('status').textContent=text(`Dữ liệu: ${date(data.windowStart)} → ${date(data.windowEnd)} (UTC+7)`,`Data: ${date(data.windowStart)} → ${date(data.windowEnd)} (UTC+7)`);
 $('historyDetail').textContent=text(`Bắt đầu ghi nhận: ${date(data.startedAt)}. Tổng đơn nháp trong kho dữ liệu: ${number(data.allTimeDraftOrders)}.`,`Tracking started: ${date(data.startedAt)}. All-time drafts in the order store: ${number(data.allTimeDraftOrders)}.`)+(data.truncated?text(' Đã đạt giới hạn sự kiện: lịch sử cũ có thể không đầy đủ.',' Event cap reached: older history may be incomplete.'):'');
 drawHours(data);drawProducts(data);$('export').disabled=false;
}
async function refresh(){
 controller?.abort();controller=new AbortController();const active=controller;
 $('refresh').disabled=true;
 try{
  const response=await fetch('/api/metrics?period='+encodeURIComponent($('period').value),{cache:'no-store',signal:AbortSignal.any([active.signal,AbortSignal.timeout(7000)])});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();if(active!==controller)return;
  lastMetrics=data;renderMetrics(data);
 }catch(error){if(active!==controller)return;$('status').className='status error';$('status').textContent=text('Mất kết nối backend. Số liệu đang hiển thị chưa được cập nhật.','Backend connection lost. Displayed data has not been updated.');$('export').disabled=true;}
 finally{if(active===controller)$('refresh').disabled=false;}
}
$('lang').onclick=()=>{language=language==='vi'?'en':'vi';try{localStorage.setItem('ocop-kpi-language',language);}catch{}renderLanguage();refresh();};
$('refresh').onclick=refresh;$('period').onchange=refresh;
$('export').onclick=()=>{
 if(!lastMetrics)return;const data=lastMetrics,rows=[['OCOP KPI',data.period],['From',data.windowStart],['To',data.windowEnd],['Metric','Value']];
 for(const key of ['requests','successful','failed','trackedSessions','draftOrders','convertedSessions','conversionRate','averageResponseMs','handoffRate','automationRate','toolCalls','toolSuccessful','toolFailed','toolSuccessRate','geminiResponses','wikipediaResponses','accuracyRate','confirmedOrders','completedOrders','paidOrders','paidRevenue','chatbotPaidRevenue'])rows.push([key,data[key]??'Not measured']);
 rows.push([],['Hour (UTC+7)','Chat requests']);data.hourly.forEach(r=>rows.push([r.hour,r.requests]));rows.push([],['Product ID','Product','Observations']);data.productInterest.forEach(p=>rows.push([p.productId,language==='en'?p.nameEn:p.name,p.count]));
 const csv='\uFEFF'+rows.map(row=>row.map(value=>{let s=String(value);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`ocop-kpi-${data.period}-${data.windowEnd.slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
window.addEventListener('storage',event=>{if(event.key==='ocop-kpi-language'){language=event.newValue==='en'?'en':'vi';renderLanguage();}});
renderLanguage();refresh();setInterval(()=>{if(!document.hidden)refresh();},10000);
