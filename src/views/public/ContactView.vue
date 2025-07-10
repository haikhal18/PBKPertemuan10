<template>
    <div class="contact-view">
      <section class="contact-hero">
        <div class="contact-hero-content">
          <h1 class="contact-hero-title">Hubungi Kami</h1>
          <p class="contact-hero-subtitle">Kami Siap Melayani Anda Dengan Sepenuh Hati.</p>
        </div>
      </section>
  
      <section class="contact-details-section">
        <div class="section-container">
          <h2 class="section-title">Informasi Kontak & Lokasi</h2>
          <p class="section-subtitle">Temukan Kami dan Rencanakan Kunjungan Anda.</p>
  
          <div class="contact-grid">
            <div class="info-card">
              <i class="fas fa-map-marker-alt contact-icon"></i>
              <h3>Alamat Kami</h3>
              <p>Jl. Jend. Sudirman No. 123, Pusat Kota Pekanbaru, Riau 28112</p>
              <a href="https://maps.app.goo.gl/YOUR_Maps_LINK" target="_blank" rel="noopener noreferrer" class="map-link">
                Lihat di Google Maps <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
            <div class="info-card">
              <i class="fas fa-phone-alt contact-icon"></i>
              <h3>Telepon Kami</h3>
              <p>Reservasi: (0761) 1234567</p>
              <p>Informasi Umum: (0761) 7654321</p>
              <a href="tel:+627611234567" class="call-link">
                Hubungi Sekarang <i class="fas fa-phone"></i>
              </a>
            </div>
            <div class="info-card">
              <i class="fas fa-envelope contact-icon"></i>
              <h3>Email Kami</h3>
              <p>Reservasi: reservasi@namarestoran.com</p>
              <p>Informasi Umum: info@namarestoran.com</p>
              <a href="mailto:info@namarestoran.com" class="email-link">
                Kirim Email <i class="fas fa-arrow-right"></i>
              </a>
            </div>
            <div class="info-card">
              <i class="fas fa-clock contact-icon"></i>
              <h3>Jam Operasional</h3>
              <p>Senin - Jumat: 10:00 - 22:00 WIB</p>
              <p>Sabtu - Minggu: 10:00 - 23:00 WIB</p>
              <p>Hari Libur: Mohon periksa pengumuman kami</p>
            </div>
          </div>
  
          <div class="google-map-container">
            <h3 class="section-sub-title">Lokasi Kami di Peta</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.650811985338!2d101.44299957470438!3d0.511394199480119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac9d1a337505%3A0x8677c7c34d31a50c!2sPekanbaru%2C%20Riau!5e0!3m2!1sen!2sid!4v1701234567890!5m2!1sen!2sid"
              width="100%"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
  
      <section class="contact-form-section">
        <div class="section-container">
          <h2 class="section-title">Kirim Pesan kepada Kami</h2>
          <p class="section-subtitle">Untuk Pertanyaan, Masukan, atau Reservasi Khusus.</p>
  
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-group">
              <label for="formName">Nama Lengkap:</label>
              <input type="text" id="formName" v-model="formData.name" required>
            </div>
            <div class="form-group">
              <label for="formEmail">Email Anda:</label>
              <input type="email" id="formEmail" v-model="formData.email" required>
            </div>
            <div class="form-group">
              <label for="formSubject">Subjek:</label>
              <input type="text" id="formSubject" v-model="formData.subject" required>
            </div>
            <div class="form-group">
              <label for="formMessage">Pesan Anda:</label>
              <textarea id="formMessage" v-model="formData.message" rows="6" required></textarea>
            </div>
            <Button type="primary" :disabled="isSubmitting">{{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}</Button>
            <p v-if="formMessage" :class="['form-status-message', formStatusClass]">{{ formMessage }}</p>
          </form>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue';
  import Button from '@/components/common/Button.vue'; // Pastikan path benar
  // import { sendContactForm } from '@/composables/useApi'; // Contoh fungsi API jika ada
  
  export default {
    name: 'ContactView',
    components: {
      Button,
    },
    setup() {
      const formData = reactive({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      const isSubmitting = ref(false);
      const formMessage = ref('');
      const formStatusClass = ref(''); // 'success' or 'error'
  
      const submitForm = async () => {
        isSubmitting.value = true;
        formMessage.value = ''; // Clear previous messages
        formStatusClass.value = '';
  
        // Simulasi pengiriman form ke API
        try {
          // Uncomment baris di bawah jika Anda punya API untuk form kontak
          // const response = await sendContactForm(formData);
          // console.log('Form berhasil dikirim:', response);
  
          // Simulasi sukses
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi delay API
          formMessage.value = 'Terima kasih! Pesan Anda telah berhasil dikirim.';
          formStatusClass.value = 'success';
          // Kosongkan form setelah sukses
          formData.name = '';
          formData.email = '';
          formData.subject = '';
          formData.message = '';
  
        } catch (error) {
          console.error('Gagal mengirim form:', error);
          formMessage.value = 'Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
          formStatusClass.value = 'error';
        } finally {
          isSubmitting.value = false;
        }
      };
  
      return {
        formData,
        isSubmitting,
        formMessage,
        formStatusClass,
        submitForm,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Variabel CSS, konsisten dengan base.css atau hero sections lainnya */
  :root {
    --primary-color: #a00;
    --secondary-color: #f0f0f0;
    --text-dark: #333;
    --text-light: #f0f0f0;
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Open Sans', sans-serif;
  }
  
  .contact-view {
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  /* --- Contact Hero Section --- */
  .contact-hero {
    position: relative;
    width: 100%;
    height: 35vh;
    background-image: url('@/assets/img/contact-hero-bg.jpg'); /* Ganti dengan gambar latar belakang kontak */
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    overflow: hidden;
  }
  
  .contact-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  .contact-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 20px;
  }
  
  .contact-hero-title {
    font-family: var(--font-heading);
    font-size: 3em;
    margin-bottom: 10px;
    line-height: 1.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .contact-hero-subtitle {
    font-size: 1.1em;
    margin-top: 0;
  }
  
  /* --- General Section Styling --- */
  section {
    padding: 80px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .section-container {
    max-width: 1000px; /* Konten lebih fokus di tengah */
    margin: 0 auto;
  }
  
  .section-title {
    font-family: var(--font-heading);
    font-size: 2.8em;
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 10px;
  }
  
  .section-subtitle {
    font-size: 1.2em;
    color: #666;
    text-align: center;
    margin-bottom: 50px;
  }
  
  /* --- Contact Details Section --- */
  .contact-details-section {
    background-color: #f9f9f9;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
  }
  
  .info-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: 30px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .contact-icon {
    font-size: 3.5em;
    color: var(--primary-color);
    margin-bottom: 20px;
  }
  
  .info-card h3 {
    font-family: var(--font-heading);
    font-size: 1.5em;
    color: var(--text-dark);
    margin-bottom: 15px;
  }
  
  .info-card p {
    font-size: 1em;
    color: #666;
    margin-bottom: 10px;
    line-height: 1.5;
  }
  
  .info-card a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: var(--primary-color);
    font-weight: 600;
    margin-top: 15px;
    transition: color 0.3s ease;
  }
  
  .info-card a:hover {
    color: darken(var(--primary-color), 10%); /* Jika pakai SCSS */
    color: #800; /* Jika pakai Vanilla CSS */
  }
  
  .google-map-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: 30px;
    text-align: center;
    overflow: hidden; /* Penting untuk iframe agar border-radius berlaku */
  }
  
  .section-sub-title {
    font-family: var(--font-heading);
    font-size: 2em;
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: 30px;
  }
  
  .google-map-container iframe {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* --- Contact Form Section --- */
  .contact-form-section {
    background-color: #fff;
  }
  
  .contact-form {
    max-width: 700px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    background-color: #fcfcfc;
  }
  
  .form-group {
    margin-bottom: 25px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
  }
  
  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1em;
    font-family: var(--font-body);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(170, 0, 0, 0.1);
    outline: none;
  }
  
  .contact-form .btn {
    width: 100%;
    padding: 15px; /* Tombol kirim lebih besar */
    font-size: 1.1em;
  }
  
  .form-status-message {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    font-weight: 500;
    text-align: center;
  }
  
  .form-status-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .form-status-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  
  /* --- Media Queries --- */
  @media (max-width: 768px) {
    .contact-hero {
      height: 25vh;
    }
    .contact-hero-title {
      font-size: 2.2em;
    }
    .contact-hero-subtitle {
      font-size: 0.9em;
    }
    section {
      padding: 40px 15px;
    }
    .section-title {
      font-size: 2em;
    }
    .section-subtitle {
      font-size: 1em;
    }
    .contact-grid {
      grid-template-columns: 1fr; /* Satu kolom di mobile */
      gap: 20px;
    }
    .info-card {
      padding: 25px;
    }
    .google-map-container {
      padding: 20px;
    }
    .section-sub-title {
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    .contact-form {
      padding: 20px;
    }
  }
  
  @media (max-width: 480px) {
    .contact-hero-title {
      font-size: 2em;
    }
    .contact-hero-subtitle {
      font-size: 0.8em;
    }
  }
  </style>