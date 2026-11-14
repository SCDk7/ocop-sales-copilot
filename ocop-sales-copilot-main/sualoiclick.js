document.addEventListener("DOMContentLoaded", function () {
    // Tìm các phần tử Intro
    const introOverlay = document.getElementById("intro-overlay") || document.querySelector(".intro-container");
    const enterMarketBtn = document.getElementById("btn-enter") || document.querySelector(".btn-enter-market");
    const skipBtn = document.getElementById("btn-skip");

    // Hàm ẩn màn hình Intro
    function hideIntro() {
        if (introOverlay) {
            introOverlay.style.opacity = "0";
            introOverlay.style.transition = "opacity 0.3s ease";
            setTimeout(() => {
                introOverlay.style.display = "none";
            }, 300);
        }
    }

    // Gắn sự kiện click cho nút "Bước vào chợ tinh hoa OCOP"
    if (enterMarketBtn) {
        enterMarketBtn.addEventListener("click", function (e) {
            e.preventDefault();
            hideIntro();
        });
    }

    // Gắn sự kiện phím Esc để bỏ qua Intro
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.keyCode === 27) {
            hideIntro();
        }
    });
});