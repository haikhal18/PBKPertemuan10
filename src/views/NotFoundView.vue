<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="not-found-view">
    <div class="container">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Halaman Tidak Ditemukan</h2>
      <p class="error-description">
        Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau tidak pernah ada.
      </p>
      <RouterLink to="/" class="home-button">
        Kembali ke Beranda
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh; /* Memastikan konten berada di tengah layar */
  font-family: var(--font-family-base);
  padding: 1rem;
}

.container {
  max-width: 500px;
}

.error-code {
  font-size: 8rem; /* Ukuran font sangat besar untuk '404' */
  font-weight: 900;
  color: var(--color-primary);
  margin-bottom: 0;
  line-height: 1;
}

.error-title {
  font-size: 2rem;
  color: var(--color-heading);
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.error-description {
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 2.5rem;
}

.home-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-white);
  background-color: var(--color-primary);
  border-radius: 50px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.home-button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
}
</style>