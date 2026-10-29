'use strict';
// Historical entry point retained for compatibility. Never invent URLs to satisfy a quota.
const {buildProductImageKnowledge,writeSummary}=require('./build-chatbot-image-references.cjs');
function generate10000Knowledge(){
 const knowledge=buildProductImageKnowledge();
 const summary=writeSummary(knowledge);
 return {totalImages:summary.referenceImages,summary};
}
if(require.main===module)console.log(JSON.stringify(generate10000Knowledge().summary,null,2));
module.exports={generate10000Knowledge};
