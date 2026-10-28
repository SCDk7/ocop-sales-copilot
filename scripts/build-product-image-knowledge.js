const {generate10000Knowledge} = require('./generate-10000-image-knowledge.js');
if (require.main === module) {
  const result = generate10000Knowledge();
  console.log(JSON.stringify(result.summary, null, 2));
}
module.exports = {generate10000Knowledge};
