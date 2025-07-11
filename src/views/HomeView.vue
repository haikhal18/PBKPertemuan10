<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="home-view">
    <div class="hero-container">
      <h1 class="hero-title">
        Selamat Datang di 🍔 Cepat Saji!
      </h1>
      <p class="hero-subtitle">
        Pesan makanan favorit Anda dengan cepat dan mudah. Kualitas terjamin, rasa tak tertandingi.
      </p>
      <RouterLink to="/foods" class="cta-button">
        Lihat Menu Sekarang
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh; /* Mengisi tinggi layar */
  padding: 2rem;
  background-color: #f9f9f9; /* Warna latar belakang lembut */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-container {
  max-width: 600px;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  background-color: #ff6347; /* Warna oranye tomat khas brand */
  border-radius: 50px; /* Membuat tombol berbentuk pil */
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 4px 15px rgba(255, 99, 71, 0.4);
}

.cta-button:hover {
  background-color: #e5533d;
  transform: translateY(-3px); /* Efek sedikit terangkat saat hover */
}
</style>