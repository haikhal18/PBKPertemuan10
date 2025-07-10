// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Impor fungsi untuk membuat Pinia store
import App from './App.vue'; // Komponen root aplikasi Anda
import router from './router'; // Vue Router instance Anda
import { useAuthStore } from './stores/auth'; // Impor Pinia Auth store
import { useCartStore } from './stores/cart'; // Impor Pinia Cart store
import { useMenuStore } from './stores/menu'; // Impor Pinia Menu store
import { useOrderStore } from './stores/orders'; // Impor Pinia Order store

// --- Import CSS Global Anda ---
// Pastikan urutan impor ini:
// 1. base.css (reset, variabel, basic HTML styles)
// 2. typography.css (text styles)
// 3. layout.css (grid, flexbox, spacing utils)
// 4. utilities.css (single-purpose helpers)
// 5. animations.css (keyframes, transition utils)
import './assets/css/base.css';
import './assets/css/typography.css';
import './assets/css/layout.css';
import './assets/css/utilities.css';
import './assets/css/animations.css';

// --- Inisialisasi Aplikasi Vue ---
const app = createApp(App);

// --- Inisialisasi Pinia ---
const pinia = createPinia(); // Buat instance Pinia
app.use(pinia); // Daftarkan Pinia ke aplikasi Vue

// --- Inisialisasi Pinia Stores ---
// Penting: Stores harus diinisialisasi SETELAH `app.use(pinia)`
// dan SEBELUM digunakan, terutama jika mereka memiliki aksi `initialize`
// atau membutuhkan `router` di Navigation Guard.
const authStore = useAuthStore();
authStore.initializeAuth(); // Muat ulang sesi autentikasi dari localStorage

const cartStore = useCartStore();
cartStore.initializeCart(); // Muat ulang keranjang belanja dari localStorage

const menuStore = useMenuStore();
menuStore.initializeMenuStore(); // Muat data menu awal jika belum ada

const orderStore = useOrderStore();
orderStore.initializeOrderStore(); // Muat data pesanan awal jika belum ada

// --- Daftarkan Vue Router ---
app.use(router); // Daftarkan router ke aplikasi Vue

// --- Mount Aplikasi ke Elemen DOM ---
app.mount('#app');

// --- Logika untuk Menyembunyikan Initial Loading Spinner (dari public/index.html) ---
// Jalankan setelah aplikasi Vue berhasil dimuat dan di-mount
document.addEventListener('DOMContentLoaded', () => {
  const initialSpinner = document.querySelector('.initial-loading-spinner');
  const appElement = document.getElementById('app');

  if (initialSpinner) {
    // Sembunyikan spinner dengan transisi (opsional)
    initialSpinner.style.opacity = '0';
    initialSpinner.addEventListener('transitionend', () => {
      initialSpinner.style.display = 'none';
      if (appElement) {
        appElement.style.display = 'block'; // Tampilkan aplikasi Vue
      }
    }, { once: true }); // Pastikan event listener hanya jalan sekali
  } else if (appElement) {
    // Jika tidak ada spinner awal, pastikan #app terlihat
    appElement.style.display = 'block';
  }
});

/*
 * KODE INTERSECTION OBSERVER GLOBAL TELAH DIHAPUS DARI SINI.
 * SEKARANG DITANGANI DI DALAM KOMPONEN YANG MEMBUTUHKANNYA (misal: HomeView.vue).
 */