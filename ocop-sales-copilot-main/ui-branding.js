(function(root) {
    'use strict';
    function withoutCopilot(value) {
        return String(value || '')
            .replace(/\b[\w.+-]+@[\w.-]*copilot[\w.-]*\b/gi,'Liên hệ CSKH')
            .replace(/https?:\/\/\S*copilot\S*/gi,'OCOP')
            .replace(/\bcopilot\b[ \t]*/gi,'')
            .replace(/코파일럿|コパイロット|コーパイロット/g,'')
            .replace(/[ \t]{2,}/g,' ');
    }
    function cleanTree(node,document) {
        if(!node)return;
        const cleanText=text=>{
            if(text.parentElement?.closest('script,style,textarea,input'))return;
            const next=withoutCopilot(text.nodeValue);
            if(next!==text.nodeValue)text.nodeValue=next;
        };
        if(node.nodeType===3){cleanText(node);return;}
        if(node.nodeType!==1&&node.nodeType!==9)return;
        if(node.matches?.('script,style'))return;
        const walker=document.createTreeWalker(node,4);
        while(walker.nextNode())cleanText(walker.currentNode);
        const elements=[...(node.querySelectorAll?.('[title],[aria-label],[placeholder],[alt]')||[])];
        if(node.getAttribute)elements.push(node);
        for(const element of elements){
            for(const attr of ['title','aria-label','placeholder','alt']){
                const value=element.getAttribute(attr);if(value===null)continue;
                const next=withoutCopilot(value);if(next!==value)element.setAttribute(attr,next);
            }
        }
    }
    if(typeof module==='object'&&module.exports){module.exports={withoutCopilot,cleanTree};return;}
    function init(){
        const document=root.document;
        cleanTree(document.documentElement,document);
        if(!root.MutationObserver)return;
        new root.MutationObserver(records=>{
            for(const record of records){
                if(record.type==='characterData'||record.type==='attributes')cleanTree(record.target,document);
                else for(const node of record.addedNodes)cleanTree(node,document);
            }
        }).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','alt']});
    }
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof window!=='undefined'?window:globalThis);
