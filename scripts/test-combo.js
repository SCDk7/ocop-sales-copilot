const fs = require('fs');
const AIShopping = require('../ai-shopping.js');

let products = [];
try {
    const dataContent = fs.readFileSync('./data.js', 'utf8');
    const sandbox = { window: {} };
    require('vm').runInNewContext(dataContent, sandbox);
    products = sandbox.window.PRODUCTS || [];
} catch(e) {
    console.error('Error loading data.js:', e);
}

console.log('Total products:', products.length);
const intent = AIShopping.analyze('combo 3tr 3 món', products);
console.log('Parsed intent:', intent);

const plan = AIShopping.closest(products, intent);
console.log('Single closest plan:', plan ? {
    total: plan.total,
    remaining: plan.remaining,
    items: plan.items.map(p => ({ name: p.name, price: p.price }))
} : null);

const variants = AIShopping.variants(products, intent, 5);
console.log('Variants plans:');
variants.forEach((v, idx) => {
    console.log(`Option ${idx + 1}: Total = ${v.total}, Remaining = ${v.remaining}, Items:`, v.items.map(p => `${p.name} (${p.price})`));
});
