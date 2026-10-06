// Shared shorthand expansion; keep original messages for Gemini context.
(function (root) {
    function expandChatShorthand(value) {
        const aliases = { ko: 'không', khum: 'không', k0: 'không', dc: 'được', đc: 'được', sp: 'sản phẩm', ib: 'liên hệ', inbox: 'liên hệ', rep: 'trả lời', pls: 'please', plz: 'please' };
        return String(value || '').replace(/(^|\s)(ko|khum|k0|dc|đc|sp|ib|inbox|rep|pls|plz)(?=\s|[?!,.]|$)/gi,
            (_, space, word) => space + aliases[word.toLowerCase()]);
    }
    if (typeof module !== 'undefined' && module.exports) module.exports = { expandChatShorthand };
    root.expandChatShorthand = expandChatShorthand;
})(globalThis);
