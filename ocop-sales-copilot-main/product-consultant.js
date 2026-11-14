(function(root) {
    'use strict';

    const node = typeof module === 'object' && module.exports;
    const shopping = node ? require('./ai-shopping') : root.AIShopping;
    const ocopStores = node ? require('./ocop-stores') : root.OcopStores;
    const normalize = shopping?.normalize || (value => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/\s+/g, ' ').trim());

    function findTargetProduct(query, history = [], products = []) {
        const q = normalize(query);

        // Không match nếu là tra cứu mạng lưới showroom toàn quốc
        if (/mang luoi showroom|cac showroom|he thong showroom|cac diem ban|tra cuu.*showroom|ban do so/.test(q) && !/san pham nay|mon nay|hang nay|co j|co gi/.test(q)) {
            return null;
        }

        // Nếu người dùng chỉ hỏi tỉnh thành chung chung
        if (/(?:tinh|dac san)\s+[a-z ]+/.test(q) && /(?:dong nai|ha noi|da nang|tp hcm|quang binh)/.test(q)) {
            const withoutProvince = q.replace(/tinh|dac san|dong nai|ha noi|da nang|tp hcm|quang binh|tieu bieu|noi bat|va|cho|toi|showroom|chinh hang|chi duong|den|o2o/g, ' ').replace(/\s+/g, ' ').trim();
            if (withoutProvince.length < 6) return null;
        }

        const sorted = [...products].sort((a, b) => (b.name || '').length - (a.name || '').length);

        // 1. Khớp từ query hiện tại
        for (const p of sorted) {
            const pNorm = normalize(p.name);
            const pStem = normalize(p.name.replace(/\([^)]*\)/g, '').trim());
            if (pStem.length >= 6 && (q.includes(pStem) || q.includes(pNorm) || (pStem.length >= 10 && q.length >= 8 && pStem.includes(q)))) {
                return p;
            }
        }

        // 2. Nhận diện đại từ thay thế theo ngữ cảnh lịch sử
        const isReference = /(?:san pham nay|mon nay|hang nay|cai nay|em nay|nay|no|mon do|san pham do|co j|co gi)/.test(q);
        if (isReference && Array.isArray(history) && history.length > 0) {
            for (let i = history.length - 1; i >= 0; i--) {
                const hText = normalize(history[i].text || history[i].content || '');
                for (const p of sorted) {
                    const pNorm = normalize(p.name);
                    const pStem = normalize(p.name.replace(/\([^)]*\)/g, '').trim());
                    if (pStem.length >= 6) {
                        if (hText.includes(pStem) || hText.includes(pNorm)) return p;
                        const cleanH = hText.replace(/tu van|dac san|xuat xu|nguon goc|cho toi|ve|tai/g, ' ').trim();
                        if (cleanH.length >= 8 && pStem.includes(cleanH)) return p;
                    }
                }
            }
        }

        return null;
    }

    function formatProductConsultation(p, store, query, language = 'vi') {
        const en = language === 'en';
        const starText = p.stars ? `⭐ OCOP ${p.stars} Sao Quốc Gia` : (en ? 'National OCOP Certified' : '⭐ OCOP Đạt Chuẩn Quốc Gia');
        const priceText = Number.isFinite(p.price) ? `${p.price.toLocaleString('vi-VN')} ₫/${p.packaging || (en ? 'unit' : 'đơn vị')}` : (en ? 'Contact store' : 'Liên hệ cửa hàng');

        let storyContent = '';
        if (p.id === 448 || /quang thuy/i.test(p.name)) {
            storyContent = en
                ? `🌿 **Origin & Cultural Craft Heritage:**\n• **Centuries-old craft village:** Quang Thuy export wooden chopsticks originate from the traditional carpentry village in Quang Thuy commune, Ba Don town, Quang Binh province. The craft has been proudly preserved across generations.\n• **Natural craftsmanship:** Meticulously hand-turned from aged native natural woods, with smooth natural luster, absolutely free of toxic chemical lacquers, guaranteeing daily food safety.\n• **Export quality:** Heat-resistant, mold-resistant, warp-free, fulfilling stringent export standards and awarded ${starText}.`
                : `🌿 **Nguồn gốc & Câu chuyện văn hóa làng nghề:**\n• **Làng nghề trăm năm:** Đũa gỗ Quảng Thủy xuất xứ từ làng nghề mộc truyền thống lâu đời tại xã Quảng Thủy, thị xã Ba Đồn, tỉnh Quảng Bình. Nghề làm đũa nơi đây được gìn giữ qua nhiều thế hệ với niềm tự hào của những nghệ nhân xứ Quảng.\n• **Nghệ thuật thủ công mộc mòn:** Từng chiếc đũa được tuyển chọn từ các loại gỗ tự nhiên già đanh, vân gỗ đẹp đều. Thợ thủ công vót và chuốt nhẵn bóng tự nhiên hoàn toàn mộc, tuyệt đối **KHÔNG** sử dụng phẩm màu, sơn bóng hay hóa chất bảo quản độc hại, đảm bảo an toàn tuyệt đối cho bữa cơm gia đình.\n• **Chất lượng xuất khẩu:** Sản phẩm chịu nhiệt tốt, không cong vênh, chống nấm mốc tự nhiên, đạt tiêu chuẩn khắt khe để xuất khẩu quốc tế và tự hào đạt chứng nhận ${starText}.`;
        } else if (/mat ong/i.test(p.name) && /le thuy/i.test(p.name)) {
            storyContent = en
                ? `🌿 **Origin & Cultural Heritage:**\n• **Pristine Forest Honey from Le Thuy:** Harvested sustainably from virgin forests in Le Thuy, Quang Binh — a historic land along the Kien Giang river.\n• **Pure Authentic Flavor:** Dense, amber-gold wildflower honey, naturally aromatic and rich in bio-active enzymes, preserving pristine forest biodiversity.`
                : `🌿 **Nguồn gốc & Câu chuyện văn hóa:**\n• **Mật ong rừng tự nhiên Lệ Thủy:** Thu hoạch từ các cánh rừng nguyên sinh bạt ngàn tại huyện Lệ Thủy, Quảng Bình — vùng đất giàu truyền thống lịch sử bên dòng sông Kiến Giang.\n• **Hương vị nguyên bản:** Mật ong hoa rừng tự nhiên sánh đậm, màu cánh gián óng ả, vị ngọt thanh dịu và giàu enzyme tự nhiên, được khai thác thủ công bền vững, bảo tồn hệ sinh thái rừng.`;
        } else if (/khoai deo/i.test(p.name)) {
            storyContent = en
                ? `🌿 **Origin & Cultural Heritage:**\n• **Soul of Quang Binh's Sandy Soil:** Sun-dried sweet potato slices (Khoai gieo) represent the industrious spirit of Central Vietnam coastal villagers.\n• **Artisan Processing:** Red sweet potatoes cultivated on white sandbars are naturally honeyed, boiled, sliced, and sun-cured over dry coastal winds and dewy nights, yielding a chewy, rich, caramelly sweetness.`
                : `🌿 **Nguồn gốc & Câu chuyện văn hóa:**\n• **Hồn quê đất cát Quảng Bình:** Khoai gieo (khoai dẻo) là đặc sản nức tiếng sinh ra từ sự tảo tần, chắt chiu của người dân xứ cát Quảng Bình.\n• **Kỳ công chế biến:** Khoai lang đỏ trồng trên cát trắng sau thu hoạch được ủ kỹ cho tươm mật rồi luộc chín, thái lát phơi qua nhiều con nắng giòn và sương đêm. Từng lát khoai dẻo quánh, ngọt bùi đậm đà, càng nhai càng thơm ngậy.`;
        } else if (/yen sao/i.test(p.name)) {
            storyContent = en
                ? `🌿 **Origin & Cultural Heritage:**\n• **Premium Natural Bird's Nest:** Sourced from coastal island cliffs in ${p.region}, renowned for pure air and mineral-rich marine biodiversity.\n• **Nutritional Excellence:** Strictly hand-cleaned, rich in essential amino acids and micronutrients for optimal health and vitality.`
                : `🌿 **Nguồn gốc & Câu chuyện văn hóa:**\n• **Yến sào thiên nhiên trứ danh:** Khai thác từ các hang đảo ven biển vùng ${p.region}, nổi tiếng với khí hậu trong lành và nguồn khoáng chất biển phong phú.\n• **Giá trị thượng hạng:** Sơ chế thủ công tỉ mỉ, giữ nguyên sợi yến dài giòn dai, giàu vi chất protein và acid amin quý giá giúp bồi bổ sức khỏe toàn diện.`;
        } else if (/nuoc mam/i.test(p.name)) {
            storyContent = en
                ? `🌿 **Origin & Cultural Heritage:**\n• **Centuries-old Fish Sauce Tradition:** Naturally brewed from fresh anchovies and sea salt aged in wooden vats for over 12 months in ${p.region}.\n• **Deep Authentic Umami:** Rich reddish-amber clarity, completely natural protein with a lingering sweet savory finish.`
                : `🌿 **Nguồn gốc & Câu chuyện văn hóa:**\n• **Làng nghề nước mắm truyền thống:** Ủ chượp thủ công từ cá cơm than tươi rói và muối biển tinh khiết trong thùng gỗ bời lời ròng rã suốt hơn 12 tháng tại ${p.region}.\n• **Hậu vị ngọt sâu:** Sắc nước mắm màu cánh gián hổ phách trong vắt, độ đạm tự nhiên cao, thơm đượm nồng nàn và hậu vị ngọt thanh chuẩn vị Việt.`;
        } else {
            storyContent = en
                ? `🌿 **Origin & Cultural Heritage:**\n• Representative specialty reflecting the rich cultural heritage and pristine terroir of **${p.region}**.\n• Produced in strict adherence to National OCOP guidelines, preserving authentic local heritage and achieving ${starText}.`
                : `🌿 **Nguồn gốc & Câu chuyện văn hóa:**\n• Đặc sản tiêu biểu được kết tinh từ tinh hoa văn hóa và thổ nhưỡng đặc trưng của vùng đất **${p.region}**.\n• Sản phẩm được sản xuất theo quy trình kiểm soát nghiêm ngặt của chương trình Mỗi Xã Một Sản Phẩm (OCOP), lưu giữ trọn vẹn bản sắc truyền thống và đạt chuẩn ${starText}.`;
        }

        const featureContent = en
            ? `✨ **Distinctive Features & Highlights (What this product offers):**\n• **Product Name:** ${p.nameEn || p.name}\n• **OCOP Rating:** ${starText} (${store?.certDecision || 'National OCOP Certification'})\n• **Official Listed Price:** ${priceText}\n• **Packaging:** Premium 1 ${p.packagingEn || p.packaging || 'unit'}, ideal for gifting and daily dining.\n• **Key Advantages:** 100% natural authentic ingredients, clean and non-toxic, safe for health with full traceability.`
            : `✨ **Đặc điểm & Giá trị nổi bật (Sản phẩm này có gì?):**\n• **Tên đặc sản:** ${p.name}\n• **Mức xếp hạng:** ${starText} (${store?.certDecision || 'Chứng nhận OCOP Quốc Gia'})\n• **Giá niêm yết chính hãng:** ${priceText}\n• **Quy cách đóng gói:** 1 ${p.packaging || 'đơn vị'} cao cấp, chuẩn quà biếu tặng hoặc dùng trong gia đình.\n• **Ưu điểm vượt trội:** 100% nguyên liệu tự nhiên bản địa, không chất độc hại, thân thiện với sức khỏe và có nguồn gốc truy xuất rõ ràng.`;

        let storeContent = '';
        if (store && store.primaryStore) {
            storeContent = en
                ? `📍 **Official O2O Showroom & Direct Experience:**\n• **Regional Showroom in ${p.region}:** ${store.primaryStore.name} — ${store.primaryStore.address}\n• **Hotline & Orders:** ${store.primaryStore.phone} (Hours: ${store.primaryStore.hours || '07:30 - 21:00'})\n• **Producer / Cooperative:** ${store.producerName} (${store.producerAddress})\n• **National Distribution Hub:** National OCOP Trade Promotion Center — 489 Hoang Quoc Viet, Cau Giay, Hanoi\n• [👉 Click here to open Google Maps directions](${store.mapUrl})`
                : `📍 **Địa chỉ Showroom O2O & Nơi trải nghiệm chính hãng:**\n• **Showroom chính hãng tại ${p.region}:** ${store.primaryStore.name} — ${store.primaryStore.address}\n• **Hotline hỗ trợ & Đặt hàng:** ${store.primaryStore.phone} (Mở cửa: ${store.primaryStore.hours || '07:30 - 21:00'})\n• **Cơ sở / HTX sản xuất:** ${store.producerName} (${store.producerAddress})\n• **Điểm kết nối toàn quốc:** Trung tâm XTTM OCOP Quốc Gia — 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội\n• [👉 Bấm vào đây để mở Google Maps chỉ đường tới Showroom](${store.mapUrl})`;
        }

        const message = [
            en ? `Here is the detailed consultation for **${p.nameEn || p.name}** (${p.region}):\n` : `Dạ, em xin tư vấn chi tiết về đặc sản **${p.name}** của tỉnh **${p.region}** ạ:\n`,
            storyContent,
            featureContent,
            storeContent,
            en ? `💡 You can click **"Add to Cart"** or **"Buy Now"** on the product card below!` : `💡 Anh/chị có thể bấm **"Thêm vào giỏ"** hoặc **"Mua ngay"** ngay tại thẻ sản phẩm bên dưới, hoặc nhắn số lượng để em hỗ trợ lên đơn giao tận nơi nhé!`
        ].filter(Boolean).join('\n\n');

        return {
            message,
            text_response: message,
            productIds: [p.id],
            suggested_products: [p.id],
            combos: [],
            dynamic_chips: [],
            catalogChecked: true,
            catalogSource: 'data.js',
            responseMode: 'product_consultation',
            integrations: { gemini: false, openai: false, claude: false, wikipedia: false }
        };
    }

    function resolveProductConsultation(query, products, language = 'vi', history = []) {
        const q = normalize(query);

        // Không can thiệp nếu là khiếu nại, hướng dẫn đặt hàng, hoặc tìm combo theo ngân sách
        if (/doi tra|hang loi|hoan tien|khieu nai|bi moc|bi hong/.test(q)) return null;
        if (/huong dan dat hang|cach dat hang|huong dan mua hang/.test(q)) return null;
        if (/combo|bo qua|gio qua|set qua|gift set/.test(q) && /trieu|tram|nghin|k\b|\d{3,}/.test(q)) return null;

        const isConsultation = /tu van|gioi thieu|cau chuyen|van hoa|nguon goc|xuat xu|lang nghe|showroom|dia chi|diem ban|o2o|mua o dau|co gi|co j|dac diem|thanh phan|chat luong|quy cach|san pham nay|mon nay|the nao|nhu the nao|chi tiet/.test(q);
        if (!isConsultation) return null;

        const p = findTargetProduct(query, history, products);
        if (!p) return null;

        const store = ocopStores?.getOcopStoreInfo ? ocopStores.getOcopStoreInfo(p.id) : null;
        return formatProductConsultation(p, store, query, language);
    }

    const api = {
        findTargetProduct,
        formatProductConsultation,
        resolveProductConsultation
    };

    if (node) module.exports = api;
    else root.OCOPProductConsultant = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

