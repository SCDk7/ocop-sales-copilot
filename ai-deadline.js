'use strict';
function waitForSignal(promise, signal) {
    if (!signal) return promise;
    return new Promise((resolve, reject) => {
        const onAbort = () => { cleanup(); reject(signal.reason || new Error('AI deadline exceeded')); };
        const cleanup = () => signal.removeEventListener('abort', onAbort);
        // Always handle completion, including late rejection after cancellation.
        Promise.resolve(promise).then(value => { cleanup(); resolve(value); }, error => { cleanup(); reject(error); });
        if (signal.aborted) onAbort();
        else signal.addEventListener('abort', onAbort, { once:true });
    });
}
module.exports={waitForSignal};
