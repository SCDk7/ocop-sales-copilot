const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function createReviewStore(file, productIds) {
  const allowed = new Set(productIds);
  let entries = [];
  try { entries = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!Array.isArray(entries)) throw new Error('Invalid product review database');
  const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
  function checkId(id) { if (!Number.isInteger(id) || !allowed.has(id)) fail('Không tìm thấy sản phẩm.', 404); }
  function summary(id) {
    const rows = entries.filter(r => r.productId === id);
    return { productId: id, reviews: rows.length, rating: rows.length ? rows.reduce((sum, r) => sum + r.rating, 0) / rows.length : null };
  }
  function list(id) { checkId(id); return { ...summary(id), items: entries.filter(r => r.productId === id).slice(-50).reverse() }; }
  function parseImages(images = []) {
    if (!Array.isArray(images) || images.length > 3) fail('Mỗi đánh giá tối đa 3 ảnh.');
    return images.map(data => {
      if (typeof data !== 'string' || data.length > 700000) fail('Ảnh quá lớn.');
      const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(data);
      if (!match) fail('Chỉ nhận ảnh JPEG, PNG hoặc WebP.');
      const buffer = Buffer.from(match[2], 'base64'), mimeType = match[1];
      const valid = mimeType === 'image/jpeg' ? buffer.subarray(0,3).equals(Buffer.from([255,216,255]))
        : mimeType === 'image/png' ? buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
        : buffer.toString('ascii',0,4) === 'RIFF' && buffer.toString('ascii',8,12) === 'WEBP';
      if (!valid || buffer.length > 500000 || buffer.length < 12) fail('Ảnh không hợp lệ hoặc vượt 500 KB.');
      const imageId = crypto.createHash('sha256').update(buffer).digest('hex');
      return { buffer, metadata: { id: imageId, mimeType, bytes: buffer.length, url: '/api/review-images/' + imageId } };
    });
  }
  function image(id) {
    if (!/^[a-f0-9]{64}$/.test(id)) fail('Không tìm thấy ảnh.',404);
    const metadata = entries.flatMap(r=>r.images || []).find(img=>img.id === id);
    if (!metadata) fail('Không tìm thấy ảnh.',404);
    return { ...metadata, buffer: fs.readFileSync(path.join(file + '.images',id)) };
  }
  function add(id, body) {
    checkId(id);
    if (!body || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5 ||
        typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 60 ||
        typeof body.comment !== 'string' || body.comment.trim().length < 5 || body.comment.trim().length > 1000 ||
        typeof body.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId)) {
      fail('Nhập tên 2–60 ký tự, nội dung 5–1000 ký tự và chọn 1–5 sao.');
    }
    const parsedImages = parseImages(body.images);
    const images = parsedImages.map(img=>img.metadata);
    const existing = entries.find(r => r.requestId === body.requestId);
    if (existing) {
      if (existing.productId !== id || existing.rating !== body.rating || existing.name !== body.name.trim() || existing.comment !== body.comment.trim() || JSON.stringify(existing.images || []) !== JSON.stringify(images)) fail('Yêu cầu đánh giá đã được sử dụng.', 409);
      return { review: existing, ...summary(id), duplicate: true };
    }
    const review = { id: crypto.randomUUID(), requestId: body.requestId, productId: id, name: body.name.trim(), rating: body.rating, comment: body.comment.trim(), images, createdAt: new Date().toISOString(), verifiedPurchase: false };
    const next = [...entries, review];
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (images.length) fs.mkdirSync(file + '.images', { recursive: true });
    for (const img of parsedImages) {
      try { fs.writeFileSync(path.join(file + '.images',img.metadata.id), img.buffer, { flag:'wx', mode:0o600 }); }
      catch (error) { if (error.code !== 'EEXIST') throw error; }
    }
    const temporary = file + '.tmp';
    fs.writeFileSync(temporary, JSON.stringify(next, null, 2) + '\n', { mode: 0o600 });
    fs.renameSync(temporary, file);
    entries = next;
    return { review, ...summary(id), duplicate: false };
  }
  return { list, add, image, summary, summaries: () => [...allowed].map(summary), enrich: products => products.map(p => ({ ...p, ...summary(p.id) })) };
}
module.exports = { createReviewStore };
