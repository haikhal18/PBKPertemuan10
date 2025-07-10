<template>
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-section footer-contact">
          <h3>Hubungi Kami</h3>
          <p>
            <i class="fas fa-map-marker-alt"></i> Jl. Jend. Sudirman No. 123, Pekanbaru, Riau 28112
          </p>
          <p>
            <i class="fas fa-phone-alt"></i> (0761) 1234567
          </p>
          <p>
            <i class="fas fa-envelope"></i> info@namarestoran.com
          </p>
        </div>
  
        <div class="footer-section footer-hours">
          <h3>Jam Operasional</h3>
          <p>Senin - Jumat: 10:00 - 22:00 WIB</p>
          <p>Sabtu - Minggu: 10:00 - 23:00 WIB</p>
          <p>Hari Libur Nasional: Tutup (kecuali ada pemberitahuan)</p>
        </div>
  
        <div class="footer-section footer-nav">
          <h3>Jelajahi</h3>
          <ul>
            <li><router-link to="/menu">Menu</router-link></li>
            <li><router-link to="/gallery">Galeri</router-link></li>
            <li><router-link to="/about">Tentang Kami</router-link></li>
            <li><router-link to="/contact">Kontak</router-link></li>
            <li><router-link to="/privacy-policy">Kebijakan Privasi</router-link></li>
          </ul>
        </div>
  
        <div class="footer-section footer-social">
          <h3>Ikuti Kami</h3>
          <div class="social-links">
            <a href="https://facebook.com/namarestoran" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com/namarestoran" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com/namarestoran" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-twitter"></i>
            </a>
            </div>
          <div class="footer-newsletter">
            <h4>Dapatkan Pembaruan</h4>
            <p>Daftar untuk mendapatkan berita terbaru dan penawaran spesial!</p>
            <form @submit.prevent="subscribeNewsletter">
              <input type="email" v-model="newsletterEmail" placeholder="Masukkan email Anda" required>
              <Button type="primary" class="newsletter-btn">Daftar</Button>
            </form>
          </div>
        </div>
      </div>
  
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Nama Restoran. Semua Hak Cipta Dilindungi.</p>
        <p>Dibuat dengan ❤️ di Pekanbaru</p>
      </div>
    </footer>
  </template>
  
  <script>
  import { ref } from 'vue';
  import Button from '@/components/common/Button.vue'; // Pastikan path benar
  
  export default {
    name: 'AppFooter',
    components: {
      Button,
    },
    setup() {
      const currentYear = new Date().getFullYear();
      const newsletterEmail = ref('');
  
      const subscribeNewsletter = () => {
        if (newsletterEmail.value) {
          alert(`Terima kasih telah mendaftar dengan email: ${newsletterEmail.value}`);
          // Di sini Anda bisa menambahkan logika untuk mengirim email ke API backend
          newsletterEmail.value = ''; // Reset form
        }
      };
  
      return {
        currentYear,
        newsletterEmail,
        subscribeNewsletter,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Pastikan Anda sudah mengimpor font Open Sans atau font lain yang Anda gunakan di assets/css/base.css */
  
  .app-footer {
    background-color: #222; /* Warna latar belakang footer yang gelap */
    color: #f0f0f0; /* Warna teks yang terang */
    padding: 40px 0 20px; /* Padding atas, bawah, dan samping */
    font-family: 'Open Sans', sans-serif;
    font-size: 0.95em;
    line-height: 1.6;
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Kolom responsif */
    gap: 30px; /* Jarak antar bagian footer */
  }
  
  .footer-section {
    margin-bottom: 20px;
  }
  
  .footer-section h3 {
    color: #fff; /* Warna judul section */
    font-size: 1.2em;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;
  }
  
  /* Garis bawah sederhana untuk judul section */
  .footer-section h3::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 50px; /* Panjang garis */
    height: 2px;
    background-color: #a00; /* Warna aksen yang sama dengan primary button */
  }
  
  .footer-section p {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .footer-section p i {
    color: #a00; /* Warna ikon */
    font-size: 1.1em;
  }
  
  /* Navigasi Footer */
  .footer-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-nav ul li {
    margin-bottom: 8px;
  }
  
  .footer-nav ul li a {
    text-decoration: none;
    color: #f0f0f0;
    transition: color 0.3s ease;
  }
  
  .footer-nav ul li a:hover {
    color: #a00;
  }
  
  /* Link Media Sosial */
  .social-links {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .social-links a {
    color: white;
    font-size: 1.5em;
    transition: color 0.3s ease;
  }
  
  .social-links a:hover {
    color: #a00;
  }
  
  /* Newsletter Section */
  .footer-newsletter h4 {
    color: #fff;
    font-size: 1.1em;
    margin-bottom: 10px;
  }
  
  .footer-newsletter p {
    font-size: 0.9em;
    margin-bottom: 15px;
  }
  
  .footer-newsletter form {
    display: flex;
    flex-direction: column; /* Stack input dan button di mobile */
    gap: 10px;
  }
  
  .footer-newsletter input[type="email"] {
    padding: 10px 15px;
    border: 1px solid #555;
    border-radius: 5px;
    background-color: #333;
    color: #fff;
    font-size: 1em;
    width: 100%; /* Lebar penuh di mobile */
  }
  
  .footer-newsletter input[type="email"]::placeholder {
    color: #bbb;
  }
  
  .footer-newsletter .newsletter-btn {
    width: 100%; /* Tombol memenuhi lebar */
  }
  
  /* Bagian Bawah Footer (Copyright) */
  .footer-bottom {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #333; /* Garis pemisah */
    font-size: 0.85em;
    color: #aaa;
  }
  
  /* Media Queries untuk Responsivitas */
  @media (max-width: 768px) {
    .footer-container {
      grid-template-columns: 1fr; /* Satu kolom di layar kecil */
      text-align: center;
    }
  
    .footer-section h3::after {
      left: 50%;
      transform: translateX(-50%); /* Pusatkan garis bawah */
    }
  
    .footer-section p {
      justify-content: center; /* Pusatkan teks & ikon */
    }
  
    .social-links {
      justify-content: center;
    }
  
    .footer-newsletter form {
      flex-direction: column; /* Tetap column di mobile */
      align-items: center; /* Pusatkan elemen form */
    }
    .footer-newsletter input[type="email"] {
      max-width: 300px; /* Batasi lebar input di mobile */
    }
  }
  </style>