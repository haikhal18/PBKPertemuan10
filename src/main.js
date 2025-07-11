import './assets/main.css'; // Opsional: Mengimpor file CSS global

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// 1. Buat instance aplikasi Vue dengan komponen root App.vue
const app = createApp(App);

// 2. Buat instance Pinia dan pasang (install) ke aplikasi Vue
// Ini akan menyediakan akses ke semua store di seluruh komponen
app.use(createPinia());

// 3. Pasang (install) Vue Router ke aplikasi Vue
// Ini akan mengaktifkan semua fungsionalitas routing
app.use(router);

// 4. Mount aplikasi Vue ke elemen DOM dengan id="app" di index.html
// Ini adalah langkah terakhir yang membuat aplikasi Anda benar-benar terlihat di browser.
app.mount('#app');