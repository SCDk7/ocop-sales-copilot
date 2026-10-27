'use strict';
const path = require('node:path');

function createSpaFallback(indexFile) {
    return (req, res, next) => {
        if (!['GET', 'HEAD'].includes(req.method)) return next();
        // Missing APIs and assets must keep their own 404 response.
        if (/^\/(?:api|admin|kpi-site|images|scripts|assets|node_modules|scratch)(?:\/|$)/i.test(req.path) ||
            req.path.split('/').some(part => part.startsWith('.')) ||
            path.posix.extname(req.path) || !req.accepts('html')) return next();
        res.setHeader('Cache-Control', 'no-cache');
        res.sendFile(indexFile, error => { if (error) next(error); });
    };
}
module.exports = {createSpaFallback};
