<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { onMounted } from 'vue';
import { useCartStore } from './stores/cart';

// Saat aplikasi dimuat, coba ambil data keranjang dari localStorage.
// Ini penting agar user yang me-refresh halaman tidak kehilangan keranjangnya.
onMounted(() => {
  useCartStore().loadCartFromLocalStorage();
});
</script>

<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  width: 100%;
}
</style>