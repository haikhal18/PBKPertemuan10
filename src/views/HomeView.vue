<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

import food1 from '@/assets/Burger.png';
import food2 from '@/assets/FC.png';
import food3 from '@/assets/hotdog.png';

const images = [food1, food2, food3];
const currentImage = ref(0);

onMounted(() => {
  setInterval(() => {
    currentImage.value = (currentImage.value + 1) % images.length;
  }, 4000);
});
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <div class="hero-image-container">
      <img :src="images[currentImage]" alt="Hero Food" class="hero-image" />
      <div class="hero-overlay">
        <h1 class="hero-title highlight-orange">
          Selamat Datang di 🍔 Cepat Saji!
        </h1>
        <p class="hero-subtitle">
          Pesan makanan favorit Anda dengan cepat dan mudah.<br />
          Kualitas terjamin, rasa tak tertandingi.
        </p>
        <RouterLink to="/foods" class="cta-button">
          Lihat Menu Sekarang
        </RouterLink>
      </div>
    </div>

    <!-- Menu Favorit -->
    <section class="favorite-menu">
      <h2>Menu Favorit Kami</h2>
      <div class="menu-carousel">
        <div class="menu-list">
          <div class="menu-card" v-for="(food, index) in images" :key="'a' + index">
            <img :src="food" alt="Menu" class="menu-image" />
            <h4>Menu #{{ index + 1 }}</h4>
            <p>Rp {{ (20000 + index * 5000).toLocaleString('id-ID') }}</p>
          </div>
          <div class="menu-card" v-for="(food, index) in images" :key="'b' + index">
            <img :src="food" alt="Menu" class="menu-image" />
            <h4>Menu #{{ index + 1 }}</h4>
            <p>Rp {{ (20000 + index * 5000).toLocaleString('id-ID') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Kenapa Memilih Kami -->
    <section class="why-us">
      <h2>Kenapa Memilih Cepat Saji?</h2>
      <div class="why-list">
        <div class="why-item">
          <img src="https://img.icons8.com/color/96/ingredients.png" alt="Bahan Segar" />
          <h3>Bahan Segar</h3>
          <p>Selalu menggunakan bahan berkualitas dan segar setiap hari.</p>
        </div>
        <div class="why-item">
          <img src="https://img.icons8.com/color/96/delivery.png" alt="Pengiriman Cepat" />
          <h3>Pengiriman Cepat</h3>
          <p>Pesanan Anda sampai dalam hitungan menit, panas & nikmat!</p>
        </div>
        <div class="why-item">
          <img src="https://img.icons8.com/color/96/restaurant-menu.png" alt="Menu Variatif" />
          <h3>Menu Variatif</h3>
          <p>Pilihan menu lengkap, dari burger, ayam, hingga hotdog.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  width: 100vw;
  min-height: 90vh;
  background: #f9f9f9;
  padding: 0;
  margin: 0;
}

/* Hero Section */
.hero-image-container {
  position: relative;
  width: 100vw;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 420px;
  object-fit: cover;
  filter: brightness(0.7);
  transition: all 0.7s;
}

.hero-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  background: rgba(0,0,0,0.18);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.highlight-orange {
  color: #ff6347;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2.2rem;
  line-height: 1.7;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #ff6347, #ffb347);
  border-radius: 50px;
  text-decoration: none;
  transition: 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 99, 71, 0.25);
}
.cta-button:hover {
  background: linear-gradient(90deg, #e5533d, #ff8c47);
  transform: scale(1.05);
}

/* Menu Favorit */
.favorite-menu {
  background-image: url('@/assets/food-background.jpg'); /* Ganti dengan gambar kamu */
  background-size: cover;
  background-position: center;
  padding: 4rem 1rem;
  text-align: center;
  color: #333;
}

.favorite-menu h2 {
  font-size: 2.2rem;
  color: #fff;
  margin-bottom: 2rem;
  font-weight: bold;
}

.menu-carousel {
  overflow: hidden;
  width: 100%;
}

.menu-list {
  display: flex;
  flex-direction: row-reverse;
  gap: 2rem;
  animation: scroll-right 20s linear infinite;
  width: max-content;
}

@keyframes scroll-right {
  0% { transform: translateX(0); }
  100% { transform: translateX(50%); }
}

.menu-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 220px;
  transform: perspective(1000px) rotateY(5deg);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}
.menu-card:hover {
  transform: perspective(1000px) rotateY(0deg) scale(1.05);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.menu-image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 1rem;
  transition: transform 0.4s ease;
}
.menu-card:hover .menu-image {
  transform: scale(1.1) translateY(-6px);
}

.menu-card h4 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.menu-card p {
  color: #ff6347;
  font-weight: bold;
}

/* Kenapa Memilih Kami */
.why-us {
  background: #fff;
  padding: 3rem 1rem;
  text-align: center;
}
.why-us h2 {
  font-size: 2rem;
  color: #ff6347;
  margin-bottom: 2rem;
}
.why-list {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.why-item {
  background: #fff7f2;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(255,99,71,0.07);
  padding: 1.5rem 1rem;
  width: 220px;
  transition: transform 0.2s;
}
.why-item:hover {
  transform: translateY(-6px) scale(1.03);
}
.why-item img {
  width: 64px;
  margin-bottom: 1rem;
}
.why-item h3 {
  color: #ff6347;
  margin-bottom: 0.5rem;
}
</style>
