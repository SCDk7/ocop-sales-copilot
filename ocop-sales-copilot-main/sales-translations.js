(function(root){'use strict';const rows=[
 [
  "Vui lòng nhập mã voucher!",
  "Please enter voucher code!",
  "请输入优惠码！",
  "쿠폰 코드를 입력하세요!",
  "クーポンコードを入力してください。"
 ],
 [
  "Mã voucher không hợp lệ hoặc đã hết lượt!",
  "Invalid voucher code!",
  "优惠码无效或已用完！",
  "유효하지 않거나 사용이 끝난 쿠폰입니다.",
  "無効または利用上限に達したクーポンです。"
 ],
 [
  "Chọn sản phẩm…",
  "Choose a product…",
  "选择商品…",
  "상품 선택…",
  "商品を選択…"
 ],
 [
  "Đang cập nhật trạng thái đơn…",
  "Refreshing order status…",
  "正在更新订单状态…",
  "주문 상태 갱신 중…",
  "注文状態を更新中…"
 ],
 [
  "Không tải được đơn hàng.",
  "Could not load this order.",
  "无法加载此订单。",
  "주문을 불러올 수 없습니다.",
  "注文を読み込めません。"
 ],
 [
  "Đã cập nhật trạng thái đơn hàng.",
  "Order status updated.",
  "订单状态已更新。",
  "주문 상태가 갱신되었습니다.",
  "注文状態を更新しました。"
 ],
 [
  "Cập nhật trạng thái",
  "Refresh status",
  "刷新状态",
  "상태 새로고침",
  "状態を更新"
 ],
 [
  "Tôi đã nhận hàng",
  "I have received my order",
  "我已收到商品",
  "상품을 받았습니다",
  "商品を受け取りました"
 ],
 [
  "Bạn xác nhận đã nhận đủ hàng? Chỉ xác nhận khi hàng đã được giao đến bạn.",
  "Have you received your items? Confirm only after they have been delivered to you.",
  "您已收齐商品吗？请在商品实际送达后确认。",
  "상품을 모두 받으셨나요? 실제 배송받은 뒤에만 확인하세요.",
  "商品をすべて受け取りましたか？実際に届いてから確認してください。"
 ],
 [
  "Chưa xác nhận được nhận hàng.",
  "Could not confirm receipt.",
  "无法确认收货。",
  "수령을 확인할 수 없습니다.",
  "受取りを確認できません。"
 ],
 [
  "Đã xác nhận nhận hàng. Đơn hàng hoàn thành!",
  "Receipt confirmed. Your order is complete!",
  "已确认收货，订单完成！",
  "수령이 확인되어 주문이 완료되었습니다!",
  "受取りを確認し、注文が完了しました。"
 ],
 [
  "Liên kết theo dõi đơn hàng (giữ riêng)",
  "Private order tracking link",
  "订单跟踪链接（请保密）",
  "주문 추적 링크(비공개 보관)",
  "注文追跡リンク（非公開で保管）"
 ],
 [
  "Tổng tiền theo đơn: ",
  "Order total: ",
  "订单总额： ",
  "주문 합계: ",
  "注文合計： "
 ],
 [
  "Hình thức thanh toán: ",
  "Payment method: ",
  "付款方式： ",
  "결제 수단: ",
  "支払い方法： "
 ],
 [
  "Thông tin giao hàng: ",
  "Shipping reference: ",
  "配送信息： ",
  "배송 정보: ",
  "配送情報： "
 ],
 [
  "Đã tiếp nhận đơn hàng — chờ người bán xác nhận",
  "Order received — awaiting seller confirmation",
  "订单已受理，等待卖家确认",
  "주문 접수 — 판매자 확인 대기",
  "注文受付済み — 販売者確認待ち"
 ],
 [
  "Mã ưu đãi áp dụng: ",
  "Applied voucher: ",
  "已使用优惠码： ",
  "적용된 쿠폰: ",
  "適用クーポン： "
 ],
 [
  " (Đã áp dụng trực tiếp)",
  " (Applied directly)",
  " （已直接应用）",
  " (즉시 적용됨)",
  " （直接適用済み）"
 ],
 [
  "Tiền hàng tạm tính: ",
  "Product subtotal: ",
  "商品小计： ",
  "상품 소계: ",
  "商品小計： "
 ],
 [
  "Giảm giá ưu đãi: -",
  "Voucher discount: -",
  "优惠减免：-",
  "쿠폰 할인: -",
  "クーポン割引：-"
 ],
 [
  "Tổng thanh toán: ",
  "Total payment: ",
  "支付总额： ",
  "총 결제액: ",
  "支払合計： "
 ],
 [
  "Hệ thống đã lưu yêu cầu đặt hàng. Người bán cần xác nhận tồn kho, phí giao hàng và xử lý đơn. Đơn chỉ hoàn thành sau khi bạn nhận hàng và bấm “Tôi đã nhận hàng”.",
  "Your order request is saved. The seller still needs to confirm stock, shipping and process the order. It is completed only after you receive the items and click “I have received my order”.",
  "订购请求已保存。卖家仍须确认库存、运费并处理订单。收到商品并点击“我已收到商品”后，订单才会完成。",
  "주문 요청을 저장했습니다. 판매자가 재고와 배송비를 확인하고 처리해야 합니다. 상품을 받은 뒤 ‘상품을 받았습니다’를 눌러야 주문이 완료됩니다.",
  "注文依頼を保存しました。販売者が在庫と送料を確認して処理します。商品を受け取り「商品を受け取りました」を押すと注文が完了します。"
 ],
 [
  "Đang xác nhận và gửi đơn hàng…",
  "Submitting your order…",
  "正在确认并提交订单…",
  "주문 확인 및 전송 중…",
  "注文を確認して送信中…"
 ],
 [
  "Vui lòng chọn ít nhất một sản phẩm!",
  "Please choose at least one product!",
  "请至少选择一件商品！",
  "상품을 하나 이상 선택하세요!",
  "商品を1点以上選択してください。"
 ],
 [
  "Đã tiếp nhận đơn hàng. Đang chờ người bán xác nhận.",
  "Order received. Awaiting seller confirmation.",
  "订单已受理，等待卖家确认。",
  "주문이 접수되어 판매자 확인을 기다립니다.",
  "注文を受け付けました。販売者の確認待ちです。"
 ],
 [
  "Chưa nhận được xác nhận đơn hàng. Giỏ hàng vẫn được giữ; hãy thử lại để kiểm tra cùng yêu cầu. ",
  "Order confirmation was not received. Your cart is preserved; retry to check the same request. ",
  "尚未收到订单确认。购物车已保留，请重试以查询同一请求。 ",
  "주문 확인을 받지 못했습니다. 장바구니는 유지되므로 같은 요청을 다시 확인해 주세요. ",
  "注文確認を受信できませんでした。カートは保持されています。同じ依頼を再確認してください。 "
 ],
 [
  "Chưa tải được danh mục từ backend.",
  "Could not load the backend catalogue.",
  "无法加载服务器商品目录。",
  "서버의 상품 목록을 불러올 수 없습니다.",
  "サーバーの商品一覧を読み込めません。"
 ],
 [
  "← Quay lại cửa hàng",
  "← Back to shop",
  "← 返回商店",
  "← 상점으로 돌아가기",
  "← 店舗へ戻る"
 ],
 [
  "🚚 Đặt Hàng Trực Tuyến OCOP",
  "🚚 Place Your OCOP Order",
  "🚚 在线订购 OCOP 商品",
  "🚚 OCOP 온라인 주문",
  "🚚 OCOP オンライン注文"
 ],
 [
  "Kiểm tra thông tin sản phẩm và điền địa chỉ nhận hàng bên dưới. Nhà bán hàng chính hãng OCOP sẽ liên hệ xác nhận và giao hàng tận nơi cho quý khách.",
  "Review your products and enter your delivery details below. The official OCOP merchant will confirm and deliver to your doorstep.",
  "请核对商品并填写下方收货地址，商家将联系确认订单并安排送货。",
  "상품을 확인하고 아래에 배송지 정보를 입력하세요. 판매자가 주문을 확인하고 배송을 안내합니다.",
  "商品を確認し、下に配送先を入力してください。販売者が注文を確認して配送を手配します。"
 ],
 [
  "🚚 Giao hàng dự kiến",
  "🚚 Estimated delivery",
  "🚚 预计配送时间",
  "🚚 예상 배송",
  "🚚 配送目安"
 ],
 [
  "Nội thành: 1–2 ngày làm việc · Ngoại thành: 2–5 ngày làm việc.",
  "City centre: 1–2 business days · Outlying areas: 2–5 business days.",
  "市区：1–2个工作日 · 外围地区：2–5个工作日。",
  "도심: 영업일 기준 1–2일 · 외곽: 2–5일.",
  "市街地：1～2営業日 · 郊外：2～5営業日。"
 ],
 [
  "Tính từ khi người bán bàn giao cho đơn vị vận chuyển, theo khu vực của điểm gửi. Đơn liên tỉnh, vùng xa hoặc lễ Tết có thể lâu hơn. Người bán sẽ xác nhận thời gian theo địa chỉ nhận hàng.",
  "Estimates start at carrier handover and are relative to the dispatch location. Interprovincial, remote-area and holiday deliveries may take longer. The seller will confirm timing for your delivery address.",
  "从卖家交给承运商起计算，以发货地为准。跨省、偏远地区或节假日可能更久，卖家会根据收货地址确认时效。",
  "배송업체 인계일부터 발송지 기준으로 계산합니다. 다른 지역, 도서 산간과 공휴일에는 더 걸릴 수 있으며 판매자가 배송지별 일정을 확인합니다.",
  "配送業者への引渡しから発送地を基準に計算します。他地域、遠隔地、祝日は時間がかかる場合があり、販売者が宛先に応じて確認します。"
 ],
 [
  "+ Thêm sản phẩm",
  "+ Add product",
  "+ 添加商品",
  "+ 상품 추가",
  "+ 商品を追加"
 ],
 [
  "🎟️ Mã Voucher Giảm Giá:",
  "🎟️ Voucher Code:",
  "🎟️ 优惠码：",
  "🎟️ 쿠폰 코드:",
  "🎟️ クーポンコード："
 ],
 [
  "Tiền hàng tạm tính:",
  "Product subtotal:",
  "商品小计：",
  "상품 소계:",
  "商品小計："
 ],
 [
  "TỔNG THANH TOÁN:",
  "TOTAL PAYMENT:",
  "支付总额：",
  "총 결제액:",
  "支払合計："
 ],
 [
  "Họ và tên người nhận *",
  "Recipient name *",
  "收件人姓名 *",
  "수령인 이름 *",
  "受取人氏名 *"
 ],
 [
  "Số điện thoại nhận hàng *",
  "Phone number *",
  "收件人电话 *",
  "수령인 전화번호 *",
  "受取人電話番号 *"
 ],
 [
  "Địa chỉ nhận hàng chi tiết *",
  "Delivery address *",
  "详细收货地址 *",
  "상세 배송지 *",
  "配送先住所の詳細 *"
 ],
 [
  "Hình thức thanh toán (mô phỏng dự án)",
  "Payment method",
  "付款方式",
  "결제 수단",
  "支払い方法"
 ],
 [
  "🏦 BIDV / VietQR",
  "🏦 BIDV / VietQR",
  "🏦 BIDV / VietQR",
  "🏦 BIDV / VietQR",
  "🏦 BIDV / VietQR"
 ],
 [
  "📱 Ví MoMo",
  "📱 MoMo wallet",
  "📱 MoMo 钱包",
  "📱 MoMo 지갑",
  "📱 MoMo ウォレット"
 ],
 [
  "🚚 Thanh toán khi nhận hàng",
  "🚚 Cash on delivery",
  "🚚 货到付款",
  "🚚 착불 결제",
  "🚚 代金引換"
 ],
 [
  "Tôi xác nhận thông tin nhận hàng chính xác và đồng ý đặt đơn hàng này.",
  "I confirm these delivery details and agree to place this order.",
  "我确认收货信息正确，并同意提交此订单。",
  "배송지 정보가 정확함을 확인하고 이 주문에 동의합니다.",
  "配送先情報が正しいことを確認し、この注文に同意します。"
 ],
 [
  "🚚 Xác nhận đặt hàng ngay",
  "🚚 Confirm order now",
  "🚚 确认下单",
  "🚚 주문 확정",
  "🚚 注文を確定"
 ],
 [
  "Đóng khung thanh toán",
  "Close payment panel",
  "关闭付款窗口",
  "결제 창 닫기",
  "支払い画面を閉じる"
 ],
 [
  "Hiện mã thanh toán",
  "Show payment QR",
  "显示付款二维码",
  "결제 QR 표시",
  "支払いQRを表示"
 ],
 [
  "Chọn sản phẩm để tạo mã thanh toán.",
  "Select products to generate a payment QR.",
  "请选择商品以生成付款二维码。",
  "상품을 선택하면 결제 QR을 생성합니다.",
  "商品を選択すると支払いQRを生成します。"
 ],
 [
  "Mở ứng dụng ngân hàng và quét mã",
  "Open your banking app and scan the code",
  "打开银行应用并扫描二维码",
  "은행 앱에서 QR 코드를 스캔하세요",
  "銀行アプリを開き、コードを読み取ってください"
 ],
 [
  "QR chuyển khoản BIDV",
  "BIDV bank transfer QR",
  "BIDV 转账二维码",
  "BIDV 송금 QR",
  "BIDV 銀行振込QR"
 ],
 [
  "Nội dung",
  "Reference",
  "转账附言",
  "송금 메모",
  "振込メモ"
 ],
 [
  "Ngân hàng",
  "Bank",
  "银行",
  "은행",
  "銀行"
 ],
 [
  "Chủ tài khoản",
  "Beneficiary",
  "收款人",
  "수취인",
  "受取人"
 ],
 [
  "Số tài khoản",
  "Account number",
  "账号",
  "계좌번호",
  "口座番号"
 ],
 [
  "Tải mã QR",
  "Download QR",
  "下载二维码",
  "QR 다운로드",
  "QRをダウンロード"
 ],
 [
  "Chia sẻ",
  "Share",
  "分享",
  "공유",
  "共有"
 ],
 [
  "Thời gian làm mới mã hiển thị; trạng thái nhận tiền chờ xác nhận.",
  "Display refresh timer; receipt of funds requires confirmation.",
  "倒计时仅用于刷新显示的二维码，到账情况仍需确认。",
  "타이머는 QR 표시를 갱신하며 입금은 별도로 확인해야 합니다.",
  "タイマーはQR表示の更新用です。入金は別途確認が必要です。"
 ],
 [
  "Làm mới mã sau: ",
  "Refresh in: ",
  "刷新倒计时： ",
  "새로고침까지: ",
  "更新まで： "
 ],
 [
  "Chưa tải được QR. Bạn có thể chuyển khoản bằng thông tin tài khoản bên dưới.",
  "QR could not load. You can use the account details below.",
  "二维码无法加载，请使用下方账户信息转账。",
  "QR을 불러올 수 없습니다. 아래 계좌 정보를 이용해 주세요.",
  "QRを読み込めません。下の口座情報をご利用ください。"
 ],
 [
  "Không tải được ảnh QR. Vui lòng thử lại hoặc lưu ảnh QR đang hiển thị.",
  "Could not download QR. Please retry or save the displayed image.",
  "无法下载二维码，请重试或保存当前图片。",
  "QR을 다운로드하지 못했습니다. 재시도하거나 표시된 이미지를 저장하세요.",
  "QRをダウンロードできません。再試行するか表示画像を保存してください。"
 ],
 [
  "Thanh toán OCOP",
  "OCOP payment",
  "OCOP 付款",
  "OCOP 결제",
  "OCOP の支払い"
 ],
 [
  "Đã sao chép thông tin và liên kết QR.",
  "Payment details and QR link copied.",
  "付款信息和二维码链接已复制。",
  "결제 정보와 QR 링크를 복사했습니다.",
  "支払い情報とQRリンクをコピーしました。"
 ],
 [
  "Trình duyệt chưa hỗ trợ chia sẻ. Bạn có thể dùng nút Tải mã QR.",
  "Sharing is unavailable. Please use Download QR.",
  "浏览器暂不支持分享，请下载二维码。",
  "공유를 지원하지 않습니다. QR 다운로드를 이용하세요.",
  "共有できません。QRのダウンロードをご利用ください。"
 ],
 [
  "Chưa chia sẻ được. Vui lòng dùng nút Tải mã QR.",
  "Could not share. Please use Download QR.",
  "分享失败，请下载二维码。",
  "공유하지 못했습니다. QR 다운로드를 이용하세요.",
  "共有できませんでした。QRのダウンロードをご利用ください。"
 ],
 [
  "Thanh toán khi nhận hàng",
  "Cash on delivery",
  "货到付款",
  "착불 결제",
  "代金引換"
 ],
 [
  "QR MoMo — mô phỏng dự án",
  "MoMo QR — project demo",
  "MoMo 二维码 — 项目演示",
  "MoMo QR — 프로젝트 데모",
  "MoMo QR — プロジェクトデモ"
 ],
 [
  "QR BIDV / VietQR — mô phỏng dự án",
  "BIDV / VietQR QR — project demo",
  "BIDV / VietQR 二维码 — 项目演示",
  "BIDV / VietQR QR — 프로젝트 데모",
  "BIDV / VietQR QR — プロジェクトデモ"
 ],
 [
  "Bạn thanh toán khi nhận hàng. Phương thức này không cần mã QR.",
  "Pay when your order arrives. This method does not require a QR code.",
  "您将在收货时付款，此方式无需二维码。",
  "상품 수령 시 결제합니다. QR 코드가 필요하지 않습니다.",
  "商品到着時にお支払いください。QRコードは不要です。"
 ],
 [
  "Mã QR mô phỏng ",
  "Demo QR code: ",
  "演示二维码： ",
  "데모 QR 코드: ",
  "デモQRコード： "
 ],
 [
  "Chưa tải được thư viện QR. Vui lòng tải lại trang.",
  "The QR library could not load. Please reload this page.",
  "无法加载二维码组件，请刷新页面。",
  "QR 구성요소를 불러오지 못했습니다. 페이지를 새로고침하세요.",
  "QRライブラリーを読み込めません。ページを再読み込みしてください。"
 ],
 [
  "Số tiền tạm tính",
  "Estimated amount",
  "预估金额",
  "예상 금액",
  "概算金額"
 ],
 [
  "Số tiền của đơn hàng",
  "Order amount",
  "订单金额",
  "주문 금액",
  "注文金額"
 ],
 [
  "Mã sẽ đổi theo phương thức và số tiền bạn chọn.",
  "The code updates with your selected method and amount.",
  "二维码会根据选择的付款方式和金额更新。",
  "선택한 결제 수단과 금액에 따라 코드가 갱신됩니다.",
  "選択した支払い方法と金額に応じてコードが更新されます。"
 ],
 [
  "Mã đơn: ",
  "Order: ",
  "订单： ",
  "주문: ",
  "注文： "
 ],
 [
  "Không có sản phẩm phù hợp.",
  "No matching products.",
  "没有匹配的商品。",
  "일치하는 상품이 없습니다.",
  "一致する商品がありません。"
 ],
 [
  "Đã thống nhất phí giao với khách",
  "Shipping fee agreed with customer",
  "已与客户确认运费",
  "고객과 배송비 합의 완료",
  "お客様と送料合意済み"
 ],
 [
  "Đã cập nhật trạng thái đơn.",
  "Order status updated.",
  "订单状态已更新。",
  "주문 상태가 갱신되었습니다.",
  "注文状態を更新しました。"
 ],
 [
  "Chưa có đơn trong nhóm này.",
  "No orders in this group.",
  "此分组暂无订单。",
  "이 그룹에 주문이 없습니다.",
  "この分類に注文はありません。"
 ],
 [
  "Tạm tính: ",
  "Subtotal: ",
  "小计： ",
  "소계: ",
  "小計： "
 ],
 [
  "Phí giao: ",
  "Shipping: ",
  "运费： ",
  "배송비: ",
  "送料： "
 ],
 [
  "Chưa thống nhất",
  "Not agreed",
  "尚未协商",
  "미합의",
  "未合意"
 ],
 [
  "Tổng: ",
  "Total: ",
  "合计： ",
  "합계: ",
  "合計： "
 ],
 [
  "Thanh toán: ",
  "Payment: ",
  "付款： ",
  "결제: ",
  "支払い： "
 ],
 [
  "Người bán đã xác nhận thu tiền",
  "Receipt confirmed by seller",
  "卖家已确认收款",
  "판매자 입금 확인 완료",
  "販売者が入金確認済み"
 ],
 [
  "Chưa xác nhận thu tiền",
  "Receipt not confirmed",
  "尚未确认收款",
  "입금 미확인",
  "入金未確認"
 ],
 [
  "Thông tin vận chuyển: ",
  "Shipping reference: ",
  "配送信息： ",
  "배송 정보: ",
  "配送情報： "
 ],
 [
  "Xác nhận & giữ hàng",
  "Confirm & reserve",
  "确认并预留库存",
  "확인 및 재고 예약",
  "確認して在庫を確保"
 ],
 [
  "Phí giao hàng (đồng)",
  "Shipping fee (VND)",
  "运费（越南盾）",
  "배송비(VND)",
  "送料（VND）"
 ],
 [
  "Xác nhận đã gửi hàng",
  "Mark as shipped",
  "确认已发货",
  "발송 처리",
  "発送済みにする"
 ],
 [
  "Mã vận đơn / thông tin giao hàng",
  "Tracking / delivery reference",
  "运单号或配送信息",
  "운송장 번호 / 배송 정보",
  "追跡番号・配送情報"
 ],
 [
  "Đang giao — chờ khách hàng xác nhận đã nhận hàng để hoàn thành đơn.",
  "In transit — the customer must confirm receipt before the order is completed.",
  "正在配送，客户确认收货后订单才会完成。",
  "배송 중이며 고객이 수령을 확인해야 주문이 완료됩니다.",
  "配送中です。お客様の受取確認で注文が完了します。"
 ],
 [
  "Xác nhận đã thu tiền",
  "Confirm payment received",
  "确认收款",
  "입금 확인",
  "入金を確認"
 ],
 [
  "Mã giao dịch / ghi chú thu tiền",
  "Transaction / receipt reference",
  "交易编号或收款备注",
  "거래 번호 / 입금 메모",
  "取引番号・入金メモ"
 ],
 [
  "Hủy đơn",
  "Cancel order",
  "取消订单",
  "주문 취소",
  "注文をキャンセル"
 ],
 [
  "Hủy đơn này và hoàn lại hàng đã giữ?",
  "Cancel this order and release reserved stock?",
  "取消此订单并释放预留库存吗？",
  "주문을 취소하고 예약 재고를 해제할까요?",
  "注文をキャンセルし確保在庫を戻しますか？"
 ],
 [
  "Đã hủy đơn.",
  "Order cancelled.",
  "订单已取消。",
  "주문이 취소되었습니다.",
  "注文をキャンセルしました。"
 ],
 [
  "Lịch sử xử lý",
  "Action history",
  "处理记录",
  "처리 이력",
  "処理履歴"
 ],
 [
  "Chưa có hội thoại trong nhóm này.",
  "No conversations in this group.",
  "此分组暂无对话。",
  "이 그룹에 대화가 없습니다.",
  "この分類に会話はありません。"
 ],
 [
  "Đã xử lý",
  "Resolved",
  "已处理",
  "처리 완료",
  "対応済み"
 ],
 [
  "Cần hỗ trợ",
  "Needs support",
  "需要支持",
  "지원 필요",
  "サポートが必要"
 ],
 [
  "Tư vấn AI",
  "AI consultation",
  "AI 咨询",
  "AI 상담",
  "AI相談"
 ],
 [
  "Khách hàng",
  "Customer",
  "客户",
  "고객",
  "お客様"
 ],
 [
  "Đánh dấu đã hỗ trợ khách",
  "Mark support resolved",
  "标记客户问题已处理",
  "고객 지원 완료 표시",
  "対応済みにする"
 ],
 [
  "Đã ghi nhận xử lý hỗ trợ.",
  "Support resolution recorded.",
  "已记录支持处理结果。",
  "지원 처리 결과를 기록했습니다.",
  "対応結果を記録しました。"
 ],
 [
  "Đã lưu giá và tồn kho.",
  "Price and inventory saved.",
  "价格和库存已保存。",
  "가격과 재고를 저장했습니다.",
  "価格と在庫を保存しました。"
 ],
 [
  "OCOP • Quản trị người bán",
  "OCOP • Seller workspace",
  "OCOP • 卖家工作台",
  "OCOP • 판매자 작업 공간",
  "OCOP • 販売者管理画面"
 ],
 [
  "← Cửa hàng",
  "← Shop",
  "← 商店",
  "← 상점",
  "← 店舗"
 ],
 [
  "Điều hành cửa hàng",
  "Manage your shop",
  "店铺管理",
  "상점 관리",
  "店舗管理"
 ],
 [
  "Mật khẩu quản trị hiện có",
  "Existing administrator password",
  "当前管理员密码",
  "기존 관리자 비밀번호",
  "現在の管理者パスワード"
 ],
 [
  "Làm mới dữ liệu",
  "Refresh data",
  "刷新数据",
  "데이터 새로고침",
  "データを更新"
 ],
 [
  "Đơn chờ xác nhận",
  "Pending drafts",
  "待确认订单",
  "확인 대기 주문",
  "確認待ち注文"
 ],
 [
  "Đơn đang xử lý",
  "Active orders",
  "处理中订单",
  "처리 중 주문",
  "処理中の注文"
 ],
 [
  "Hội thoại cần hỗ trợ",
  "Pending support",
  "待支持对话",
  "지원 대기 대화",
  "対応待ちの会話"
 ],
 [
  "Giá & tồn kho",
  "Prices & inventory",
  "价格与库存",
  "가격 및 재고",
  "価格と在庫"
 ],
 [
  "Đơn hàng",
  "Orders",
  "订单",
  "주문",
  "注文"
 ],
 [
  "Hội thoại",
  "Conversations",
  "对话",
  "대화",
  "会話"
 ],
 [
  "Quản lý giá và kho",
  "Manage prices and stock",
  "管理价格与库存",
  "가격 및 재고 관리",
  "価格と在庫の管理"
 ],
 [
  "Giá cập nhật áp dụng cho tư vấn AI và đơn mới. Đơn đã tạo giữ giá tại thời điểm khách xác nhận. Tồn kho là số lượng còn có thể bán, chưa dành cho đơn đã xác nhận.",
  "Price updates apply to AI advice and new orders. Existing drafts retain the agreed price. Stock is the quantity still available for sale, excluding confirmed reservations.",
  "新价格适用于 AI 咨询和新订单；已有订单保留确认时价格。库存指扣除已确认预留数量后仍可售的数量。",
  "새 가격은 AI 상담과 새 주문에 적용되며 기존 주문은 합의 가격을 유지합니다. 재고는 확정 예약 수량을 제외한 판매 가능 수량입니다.",
  "更新価格はAI相談と新規注文に適用され、既存注文は合意済み価格を保持します。在庫は確保分を除いた販売可能数です。"
 ],
 [
  "Tìm sản phẩm",
  "Find a product",
  "查找商品",
  "상품 찾기",
  "商品を探す"
 ],
 [
  "Nh&#243;m s&#7843;n ph&#7849;m",
  "Product group",
  "商品分组",
  "상품 그룹",
  "商品グループ"
 ],
 [
  "T&#7845;t c&#7843; nh&#243;m",
  "All groups",
  "所有分组",
  "모든 그룹",
  "すべてのグループ"
 ],
 [
  "Giá bán (đồng)",
  "Price (VND)",
  "售价（越南盾）",
  "판매 가격(VND)",
  "販売価格（VND）"
 ],
 [
  "Tồn kho đã kiểm kê (bỏ trống nếu chưa biết)",
  "Verified stock (leave blank if unknown)",
  "已核实库存（未知请留空）",
  "확인된 재고(모르면 비워 두세요)",
  "確認済み在庫（不明なら空欄）"
 ],
 [
  "Lưu giá & tồn kho",
  "Save price & inventory",
  "保存价格与库存",
  "가격 및 재고 저장",
  "価格と在庫を保存"
 ],
 [
  "Đơn nháp & xử lý đơn",
  "Drafts & order processing",
  "订单草稿与处理",
  "주문 초안 및 처리",
  "注文下書きと処理"
 ],
 [
  "Tất cả trạng thái",
  "All statuses",
  "所有状态",
  "모든 상태",
  "すべての状態"
 ],
 [
  "Đang giao / chờ khách nhận",
  "In transit / awaiting receipt",
  "配送中／待收货",
  "배송 중 / 수령 대기",
  "配送中・受取待ち"
 ],
 [
  "Khách đã nhận hàng",
  "Customer received order",
  "客户已收货",
  "고객 수령 완료",
  "お客様受取済み"
 ],
 [
  "Người bán xác nhận đơn và cập nhật vận chuyển, thanh toán. Đơn chỉ hoàn thành khi khách hàng xác nhận đã nhận hàng.",
  "The seller confirms the order and updates shipping and payment. An order is completed only after the customer confirms receipt.",
  "卖家确认订单并更新配送与付款信息；只有客户确认收货后，订单才完成。",
  "판매자가 주문을 확인하고 배송과 결제를 갱신합니다. 고객의 수령 확인 후에만 주문이 완료됩니다.",
  "販売者が注文を確認し配送と支払いを更新します。お客様の受取確認後にのみ完了します。"
 ],
 [
  "Hội thoại tư vấn",
  "Consultation conversations",
  "咨询对话",
  "상담 대화",
  "相談の会話"
 ],
 [
  "Cần nhân viên hỗ trợ",
  "Needs staff support",
  "需要员工支持",
  "직원 지원 필요",
  "スタッフの対応が必要"
 ],
 [
  "Tất cả hội thoại",
  "All conversations",
  "所有对话",
  "모든 대화",
  "すべての会話"
 ],
 [
  "Đã xử lý hỗ trợ",
  "Support resolved",
  "支持已处理",
  "지원 처리 완료",
  "対応済み"
 ],
 [
  "Chỉ người bán đã đăng nhập được xem. Lưu tối đa 500 phiên / 90 ngày, 60 tin nhắn gần nhất mỗi phiên. Hội thoại mới được ghi nhận từ lần nâng cấp này.",
  "Visible only to authenticated sellers. Retains up to 500 sessions / 90 days and 60 recent messages per session. Logging starts with this upgrade.",
  "仅已登录卖家可查看。最多保留500个会话、90天以及每个会话最近60条消息，记录从此次升级开始。",
  "로그인한 판매자만 볼 수 있습니다. 최대 500개 세션, 90일, 세션별 최근 메시지 60개를 보관하며 이번 업데이트부터 기록합니다.",
  "認証済み販売者のみ閲覧できます。最大500セッション・90日間、各セッション最新60件を保持し、今回の更新から記録します。"
 ]
];if(typeof module==='object'&&module.exports)module.exports=rows;else root.OCOPUITranslations.rows.push(...rows);})(typeof window!=='undefined'?window:globalThis);
