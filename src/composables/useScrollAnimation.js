// src/composables/useScrollAnimation.js
import { onMounted, onUnmounted } from 'vue';

export function useScrollAnimation(selector, visibleClass = 'is-visible', options = {}) {
  let observer;

  onMounted(() => {
    const elements = document.querySelectorAll(selector);

    if (elements.length > 0) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            // Opsional: Hentikan pengamatan setelah visible jika animasi hanya perlu terjadi sekali
            // observer.unobserve(entry.target);
          } else {
            // Opsional: Hapus kelas jika keluar view untuk animasi berulang
            // entry.target.classList.remove(visibleClass);
          }
        });
      }, {
        threshold: options.threshold || 0.1, // Default 10% terlihat
        rootMargin: options.rootMargin || "0px 0px -50px 0px",
      });

      elements.forEach(el => {
        observer.observe(el);
      });
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
}