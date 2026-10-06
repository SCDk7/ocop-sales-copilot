// Share the exact engine implementation with the CommonJS/browser entry point.
import './data.mjs';
import * as engineModule from './AI tot hon.js';

export const AIEngine = engineModule.default?.AIEngine || globalThis.AIEngine;
export default AIEngine;
