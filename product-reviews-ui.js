(function () {
    const cache = new Map();
    let displayedProductId = null;
    const text = (vi, en) => currentLanguage === 'en' ? en : vi;
    function applySummary(summary) {
        const product = products.find(p => p.id === summary.productId);
        if (!product) return;
        if ((product.reviews || 0) > summary.reviews) return;
        product.rating = summary.rating;
        product.reviews = summary.reviews;
        document.querySelectorAll('[data-review-product-id="' + product.id + '"]').forEach(el => {
            el.textContent = getProductReviewLabel(product);
            const row=el.closest('[data-review-summary]');
            if(row) row.hidden=!el.textContent;
        });
    }
    async function refreshSummaries() {
        try {
            const response = await fetch(getAIEndpoint('/api/reviews/summary'), { cache: 'no-store' });
            if (!response.ok) return;
            const result = await response.json();
            result.products.forEach(applySummary);
        } catch (_) { /* Keep the last known real review statistics. */ }
    }
    function renderList(section, data) {
        const summary = section.querySelector('[data-real-review-summary]');
        summary.textContent = data.reviews
            ? data.rating.toFixed(1) + '/5 · ' + data.reviews + ' ' + text('đánh giá thật', 'customer reviews')
            : text('Chưa có đánh giá. Hãy chia sẻ nhận xét đầu tiên của bạn.', 'No reviews yet. Be the first to share your experience.');
        const list = section.querySelector('[data-review-list]');
        list.replaceChildren();
        for (const review of data.items || []) {
            const item = document.createElement('article');
            item.className = 'rounded-xl border border-amber-100 bg-white p-3 space-y-1';
            const heading = document.createElement('p');
            heading.className = 'text-xs font-bold text-amber-800';
            heading.textContent = review.name + ' · ' + review.rating + '/5 · ' + new Date(review.createdAt).toLocaleDateString(currentLanguage === 'en' ? 'en-GB' : 'vi-VN');
            const comment = document.createElement('p');
            comment.className = 'text-sm text-gray-700 whitespace-pre-wrap break-words';
            comment.textContent = review.comment;
            item.append(heading, comment);
            const gallery = document.createElement('div');
            gallery.className = 'flex flex-wrap gap-2';
            for (const image of review.images || []) {
                if (!/^\/api\/review-images\/[a-f0-9]{64}$/.test(image.url)) continue;
                const link = document.createElement('a');
                link.href = getAIEndpoint(image.url);
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                const photo = document.createElement('img');
                photo.src = link.href;
                photo.alt = text('Ảnh nhận xét của ', 'Review photo by ') + review.name;
                photo.loading = 'lazy';
                photo.className = 'h-24 w-24 rounded-xl border border-amber-100 object-cover';
                link.append(photo);
                gallery.append(link);
            }
            item.append(gallery);
            list.append(item);
        }
    }
    async function preparePhoto(file) {
        if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10*1024*1024) throw new Error(text('Chọn ảnh JPG, PNG hoặc WebP dưới 10 MB.', 'Choose a JPG, PNG or WebP photo under 10 MB.'));
        const source = URL.createObjectURL(file);
        try {
            const image = new Image();
            image.src = source;
            await image.decode();
            const scale = Math.min(1,1280/Math.max(image.naturalWidth,image.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1,Math.round(image.naturalWidth*scale));
            canvas.height = Math.max(1,Math.round(image.naturalHeight*scale));
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            context.fillRect(0,0,canvas.width,canvas.height);
            context.drawImage(image,0,0,canvas.width,canvas.height);
            for (const quality of [0.85,0.7,0.55,0.4]) {
                const data = canvas.toDataURL('image/jpeg',quality);
                if (data.length < 660000) return data;
            }
            throw new Error(text('Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn.', 'This photo is too large. Please choose a smaller one.'));
        } finally { URL.revokeObjectURL(source); }
    }
    window.mountProductReviews = function (productId) {
        displayedProductId = productId;
        const container = document.getElementById('quickview-content');
        container.querySelector('#product-review-section')?.remove();
        const section = document.createElement('section');
        section.id = 'product-review-section';
        section.className = 'col-span-full p-5 sm:p-6 border-t border-amber-200 bg-amber-50/60 space-y-4';
        section.innerHTML = `
            <button type="button" data-review-toggle aria-expanded="false" aria-controls="product-review-panel" class="w-full flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3 font-bold text-ocopGreen"><span>${text('Đánh giá và nhận xét', 'Ratings and reviews')}</span><span data-review-toggle-icon aria-hidden="true">＋</span></button>
            <div id="product-review-panel" hidden class="space-y-4">
            <p data-real-review-summary class="text-xs text-gray-600" aria-live="polite">${text('Đang tải đánh giá…', 'Loading reviews…')}</p>
            <div data-review-list class="space-y-2 max-h-64 overflow-y-auto"></div>
            <form class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label class="text-xs font-bold block">${text('Tên hiển thị', 'Display name')}<input name="name" required minlength="2" maxlength="60" autocomplete="nickname" class="block w-full mt-1 rounded-xl border border-amber-200 bg-white p-3 text-sm" /></label>
                    <label class="text-xs font-bold block">${text('Số sao', 'Your rating')}<select name="rating" required class="block w-full mt-1 rounded-xl border border-amber-200 bg-white p-3 text-sm">${[5,4,3,2,1].map(n => '<option value="'+n+'">'+n+' ★</option>').join('')}</select></label>
                </div>
                <label class="text-xs font-bold block">${text('Nhận xét của bạn', 'Your review')}<textarea name="comment" required minlength="5" maxlength="1000" rows="3" class="block w-full mt-1 rounded-xl border border-amber-200 bg-white p-3 text-sm" placeholder="${text('Chia sẻ trải nghiệm với sản phẩm…', 'Share your experience…')}"></textarea></label>
                <label class="text-xs font-bold block">${text('Thêm ảnh nhận xét (tối đa 3 ảnh)', 'Add review photos (up to 3)')}<input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" /></label>
                <button type="button" data-review-photo-choose class="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-ocopGreen">${text('Chọn ảnh', 'Choose photos')}</button>
                <p class="text-[11px] text-gray-500">${text('JPG, PNG, WebP · tối đa 10 MB/ảnh. Ảnh được thu nhỏ trước khi gửi.', 'JPG, PNG, WebP · up to 10 MB/photo. Photos are resized before upload.')}</p>
                <div data-review-photo-previews class="flex flex-wrap gap-3"></div>
                <p class="text-[11px] text-gray-500">${text('Đánh giá do người dùng gửi; chưa xác minh mua hàng.', 'User-submitted reviews; purchases are not verified.')}</p>
                <button type="submit" class="rounded-xl bg-ocopGreen text-white px-5 py-3 text-sm font-bold disabled:opacity-50">${text('Gửi đánh giá', 'Submit review')}</button>
                <p data-review-status role="status" class="text-xs text-ocopGreen"></p>
            </form></div>`;
        container.append(section);
        const form = section.querySelector('form');
        if (typeof currentUser !== 'undefined' && currentUser?.name) form.elements.name.value = currentUser.name;
        let pendingSubmission = null, photos = [], busy = false;
        const fileInput = form.querySelector('[type="file"]');
        const submitButton = form.querySelector('[type="submit"]');
        const status = section.querySelector('[data-review-status]');
        const panel = section.querySelector('#product-review-panel');
        section.querySelector('[data-review-photo-choose]').onclick = () => fileInput.click();
        section.querySelector('[data-review-toggle]').addEventListener('click', event => {
            panel.hidden = !panel.hidden;
            event.currentTarget.setAttribute('aria-expanded', String(!panel.hidden));
            section.querySelector('[data-review-toggle-icon]').textContent = panel.hidden ? '＋' : '−';
            if (!panel.hidden) loadReviews();
        });
        function renderPreviews() {
            const previews = section.querySelector('[data-review-photo-previews]');
            previews.replaceChildren();
            photos.forEach((data,index) => {
                const item = document.createElement('div');
                const image = document.createElement('img');
                image.src = data;
                image.alt = text('Ảnh nhận xét ', 'Review photo ') + (index+1);
                image.className = 'h-24 w-24 rounded-xl object-cover border border-amber-200';
                const remove = document.createElement('button');
                remove.type = 'button';
                remove.className = 'block text-xs text-red-600 p-2';
                remove.textContent = text('Xóa ảnh', 'Remove photo');
                remove.onclick = () => { if (!busy) { photos.splice(index,1); renderPreviews(); } };
                item.append(image,remove);
                previews.append(item);
            });
        }
        fileInput.addEventListener('change', async () => {
            if (busy) return;
            const files = [...fileInput.files];
            fileInput.value = '';
            if (files.length + photos.length > 3) { status.textContent = text('Mỗi đánh giá tối đa 3 ảnh.', 'Up to 3 photos per review.'); return; }
            busy = true;
            submitButton.disabled = fileInput.disabled = true;
            status.textContent = text('Đang xử lý ảnh…', 'Preparing photos…');
            try {
                const additions = await Promise.all(files.map(preparePhoto));
                photos.push(...additions);
                renderPreviews();
                status.textContent = text('Ảnh đã sẵn sàng. Bấm Gửi đánh giá để lưu.', 'Photos are ready. Submit your review to save them.');
            } catch(error) { status.textContent = error.message; }
            finally { busy = false; submitButton.disabled = fileInput.disabled = false; }
        });
        form.addEventListener('submit', async event => {
            event.preventDefault();
            if (busy || !form.reportValidity()) return;
            const button = submitButton;
            const status = section.querySelector('[data-review-status]');
            const values = { name: form.elements.name.value.trim(), rating: Number(form.elements.rating.value), comment: form.elements.comment.value.trim(), images:[...photos] };
            const signature = JSON.stringify(values);
            if (!pendingSubmission || pendingSubmission.signature !== signature) pendingSubmission = { signature, requestId: crypto.randomUUID() };
            button.disabled = true;
            busy = true;
            const fields = [...form.querySelectorAll('input,select,textarea,button')];
            fields.forEach(field=>field.disabled = true);
            status.textContent = text('Đang lưu…', 'Saving…');
            try {
                const response = await fetch(getAIEndpoint('/api/products/'+productId+'/reviews'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, requestId: pendingSubmission.requestId }) });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || text('Không lưu được đánh giá.', 'Could not save review.'));
                applySummary({ ...result, productId });
                const previous = cache.get(productId) || { items: [] };
                const updated = { ...result, productId, items: [result.review, ...previous.items.filter(r => r.id !== result.review.id)].slice(0,50) };
                cache.set(productId, updated);
                renderList(section, updated);
                form.elements.comment.value = '';
                photos = [];
                renderPreviews();
                pendingSubmission = null;
                status.textContent = text('Đã lưu đánh giá. Cảm ơn bạn!', 'Your review has been saved. Thank you!');
            } catch (error) { status.textContent = error.message; }
            finally { busy = false; fields.forEach(field=>field.disabled = false); }
        });
        async function loadReviews() {
            if (cache.has(productId)) renderList(section, cache.get(productId));
            try {
                const response = await fetch(getAIEndpoint('/api/products/'+productId+'/reviews'), { cache: 'no-store' });
                if (!response.ok) throw new Error('Unavailable');
                const data = await response.json();
                if ((cache.get(productId)?.reviews || 0) > data.reviews) return;
                cache.set(productId, data);
                applySummary(data);
                if (displayedProductId === productId && section.isConnected) renderList(section, data);
            } catch (_) {
                if (!cache.has(productId)) section.querySelector('[data-real-review-summary]').textContent = text('Chưa tải được đánh giá. Đóng rồi mở phần này để thử lại.', 'Could not load reviews. Close and reopen this section to retry.');
            }
        }
    };
    window.addEventListener('DOMContentLoaded', refreshSummaries);
    window.refreshProductReviewLanguage = function () {
        if (displayedProductId && !document.getElementById('quickview-modal').classList.contains('hidden')) openQuickView(displayedProductId);
    };
    window.addEventListener('focus', refreshSummaries);
    window.addEventListener('storage', event => { if (event.key === 'ocop-language' && displayedProductId && !document.getElementById('quickview-modal').classList.contains('hidden')) window.mountProductReviews(displayedProductId); });
})();
