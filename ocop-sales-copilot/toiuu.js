// Tối ưu hóa chuyển động theo tần số quét thực tế của màn hình (lên đến 240Hz)
class UIAnimation {
  constructor() {
    this.cards = document.querySelectorAll('.modern-card');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Sử dụng requestAnimationFrame để render mượt ở tần số quét cao
          requestAnimationFrame(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) translateZ(0)';
          });
        }
      });
    }, { threshold: 0.15 });

    this.cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) translateZ(0)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new UIAnimation();
});