<template>
    <div class="not-found-view">
      <div class="not-found-content">
        <h1 class="not-found-title">404</h1>
        <p class="not-found-message">Halaman Tidak Ditemukan</p>
        <p class="not-found-description">
          Maaf, halaman yang Anda cari tidak ada. Mungkin Anda salah mengetik alamat atau halaman telah dipindahkan.
        </p>
        <Button type="primary" @click="goToHome">Kembali ke Beranda</Button>
      </div>
    </div>
  </template>
  
  <script>
  import Button from '@/components/common/Button.vue'; // Pastikan path benar
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'NotFoundView',
    components: {
      Button,
    },
    setup() {
      const router = useRouter();
  
      const goToHome = () => {
        router.push('/'); // Arahkan pengguna kembali ke halaman beranda
      };
  
      return {
        goToHome,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Variabel CSS, konsisten dengan base.css */
  :root {
    --primary-color: #a00;
    --text-dark: #333;
    --text-medium: #555;
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Open Sans', sans-serif;
  }
  
  .not-found-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - var(--header-height-public, 80px) - var(--footer-height, 100px)); /* Sesuaikan tinggi dengan header/footer */
    text-align: center;
    background-color: #f8f9fa; /* Latar belakang abu-abu muda */
    padding: 40px 20px;
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  .not-found-content {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    padding: 50px 30px;
    max-width: 500px;
    width: 100%;
  }
  
  .not-found-title {
    font-family: var(--font-heading);
    font-size: 6em; /* Ukuran besar untuk angka 404 */
    color: var(--primary-color);
    margin-bottom: 10px;
    line-height: 1;
  }
  
  .not-found-message {
    font-size: 2em;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 20px;
  }
  
  .not-found-description {
    font-size: 1.1em;
    color: var(--text-medium);
    margin-bottom: 30px;
    line-height: 1.6;
  }
  
  .not-found-view .btn {
    padding: 12px 25px;
    font-size: 1em;
  }
  
  /* Media Queries */
  @media (max-width: 768px) {
    .not-found-title {
      font-size: 4em;
    }
    .not-found-message {
      font-size: 1.5em;
    }
    .not-found-description {
      font-size: 1em;
    }
    .not-found-content {
      padding: 40px 20px;
    }
  }
  
  @media (max-width: 480px) {
    .not-found-title {
      font-size: 3em;
    }
    .not-found-message {
      font-size: 1.2em;
    }
  }
  </style>