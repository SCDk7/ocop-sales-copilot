// Share the catalogue with data.js so both module formats always match.
import * as catalogModule from './data.js';

const catalog = catalogModule.default || globalThis;
export const PRODUCTS = catalog.PRODUCTS;
export const products = PRODUCTS;
export const CONFIG = catalog.CONFIG;
export default { PRODUCTS, products, CONFIG };
