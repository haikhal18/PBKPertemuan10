<template>
  <div class="home-view">
    <section class="hero-section fade-in-on-scroll">
      <div class="hero-content">
        <p class="hero-subheading">Nikmati Pengalaman Kuliner Tak Terlupakan</p>
        <h1 class="hero-title">Nama Restoran Anda</h1>
        <p class="hero-description">Di mana cita rasa bertemu keanggunan. Sajian istimewa untuk momen spesial Anda.</p>
        <div class="hero-actions">
          <Button type="primary" @click="goToMenu">Lihat Menu Kami</Button>
          <Button type="secondary" @click="goToReservations">Reservasi Meja</Button>
        </div>
      </div>
    </section>

    <section class="about-section fade-in-on-scroll">
      <div class="about-content">
        <h2 class="section-title">Cerita Kami</h2>
        <p class="section-subtitle">Lebih dari Sekadar Makanan, Sebuah Pengalaman.</p>
        <div class="about-grid">
          <div class="about-text">
            <p>Berdiri sejak 2020, <strong>Nama Restoran Anda</strong> didirikan dengan gairah untuk menyajikan hidangan berkualitas tinggi yang menggugah selera dan jiwa. Kami percaya bahwa setiap hidangan adalah sebuah karya seni, dan setiap kunjungan adalah perjalanan kuliner yang tak terlupakan.</p>
            <p>Dengan bahan-bahan pilihan terbaik, koki berpengalaman, dan suasana yang hangat, kami mengundang Anda untuk merasakan perpaduan sempurna antara tradisi dan inovasi.</p>
            <Button type="text" @click="goToAbout">Pelajari Lebih Lanjut</Button>
          </div>
          <div class="about-image">
            <img src="@/assets/img/about/restaurant-interior.jpg" alt="Restaurant Interior" class="img-fluid" />
          </div>
        </div>
      </div>
    </section>

    <section class="featured-menu-section fade-in-on-scroll">
      <div class="section-container">
        <h2 class="section-title">Hidangan Unggulan</h2>
        <p class="section-subtitle">Cicipi Keistimewaan Kami</p>
        <div class="menu-grid">
          <Card 
            v-for="item in featuredMenuItems" 
            :key="item.id" 
            :imageUrl="item.imageUrl" 
            :imageAlt="item.name" 
            hoverEffect
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p class="menu-price">Rp {{ item.price.toLocaleString('id-ID') }}</p>
            <template #footer>
              <Button type="primary" style="width: 100%;" @click="addToCart(item)">Tambahkan ke Keranjang</Button>
            </template>
          </Card>
        </div>
        <div class="text-center" style="margin-top: 40px;">
          <Button type="secondary" @click="goToMenu">Lihat Semua Menu</Button>
        </div>
      </div>
    </section>

    <section class="cta-section fade-in-on-scroll">
      <div class="cta-content">
        <h2 class="cta-title">Siap untuk Pengalaman Kuliner Berikutnya?</h2>
        <p class="cta-description">Reservasi meja Anda sekarang atau kunjungi kami langsung untuk merasakan keajaiban rasa.</p>
        <div class="cta-actions">
          <Button type="primary" @click="goToReservations">Reservasi Online</Button>
          <Button type="secondary" @click="goToContact">Hubungi Kami</Button>
        </div>
      </div>
    </section>

    <section class="testimonials-section fade-in-on-scroll">
      <div class="section-container narrow">
        <h2 class="section-title">Apa Kata Mereka?</h2>
        <p class="section-subtitle">Dengar langsung dari pelanggan setia kami.</p>

        <div v-if="testimonials.length > 0" class="testimonials-grid">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
            <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
            <p class="testimonial-author">- {{ testimonial.author }}</p>
            <div class="testimonial-rating">
              <i v-for="star in 5" :key="star" :class="['fas fa-star', { 'filled': star <= testimonial.rating }]"></i>
            </div>
          </div>
        </div>
        <p v-else class="no-testimonials-message">Belum ada testimoni.</p>
      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';
import Card from '@/components/common/Card.vue';
import { useCartStore } from '@/stores/cart';
import { fetchAllMenus, fetchTestimonials } from '@/composables/useApi'; // Impor fetchTestimonials juga

export default {
  name: 'HomeView',
  components: {
    Button,
    Card,
  },
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();
    const featuredMenuItems = ref([]);
    const testimonials = ref([]); // State untuk menyimpan testimoni

    const goToMenu = () => {
      router.push('/menu');
    };

    const goToReservations = () => {
      router.push('/contact');
    };

    const goToAbout = () => {
      router.push('/about');
    };

    const goToContact = () => {
      router.push('/contact');
    };

    const addToCart = (item) => {
      cartStore.addItem(item);
      alert(`${item.name} telah ditambahkan ke keranjang!`);
    };

    // Fungsi untuk mengambil data menu unggulan
    const loadFeaturedMenu = async () => {
      try {
        const allMenu = await fetchAllMenus();
        featuredMenuItems.value = allMenu.slice(0, 3);
      } catch (error) {
        console.error('Gagal memuat menu unggulan:', error);
      }
    };

    // Fungsi untuk mengambil data testimoni
    const loadTestimonials = async () => {
      try {
        testimonials.value = await fetchTestimonials();
      } catch (error) {
        console.error('Gagal memuat testimoni:', error);
      }
    };

    onMounted(() => {
      loadFeaturedMenu(); // Panggil saat komponen di-mount
      loadTestimonials(); // Panggil saat komponen di-mount juga

      // --- KODE INTERSECTION OBSERVER DIPINDAHKAN KE SINI ---
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Opsional: Hentikan pengamatan setelah visible jika animasi hanya perlu terjadi sekali
            // observer.unobserve(entry.target);
          } else {
            // Opsional: Hapus kelas jika keluar view untuk animasi berulang
            // entry.target.classList.remove('is-visible');
          }
        });
      }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // Menyesuaikan area viewport untuk trigger
      });

      // Amati semua elemen <section> yang memiliki kelas 'fade-in-on-scroll' di HomeView ini
      document.querySelectorAll('.home-view section.fade-in-on-scroll').forEach(section => {
        observer.observe(section);
      });
    });

    // --- PASTIKAN SEMUA VARIABEL DAN FUNGSI DIBAWAH INI DIKEMBALIKAN (RETURN) ---
    return {
      featuredMenuItems,
      testimonials, // Tambahkan ini agar bisa digunakan di template
      goToMenu,
      goToReservations,
      goToAbout,
      goToContact,
      addToCart,
    };
  },
};
</script>

<style scoped>
/* Pastikan Anda sudah mengimpor font Open Sans, Playfair Display, atau font lain yang Anda gunakan di assets/css/base.css */
/* Contoh font family */
:root {
  --primary-color: #a00; /* Merah marun */
  --secondary-color: #f0f0f0; /* Abu-abu terang */
  --text-dark: #333;
  --text-light: #f0f0f0;
  --font-heading: 'Playfair Display', serif; /* Font untuk judul besar */
  --font-body: 'Open Sans', sans-serif; /* Font untuk teks biasa */
}

.home-view {
  font-family: var(--font-body);
  color: var(--text-dark);
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  width: 100%;
  height: 90vh; /* Hampir seluruh tinggi viewport */
  /* JALUR GAMBAR INI JUGA SANGAT PENTING: PASTIKAN FILE ADA DI `src/assets/img/hero/hero-background.jpg` */
  background-image: url('@/assets/img/hero/hero-background.jpg'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Efek Parallax sederhana */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white; /* Warna teks di atas gambar latar belakang */
  overflow: hidden; /* Penting untuk efek parallax */
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Overlay gelap agar teks lebih terbaca */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  padding: 20px;
  animation: fadeIn 1.5s ease-out; /* Animasi fade-in saat load */
}

.hero-subheading {
  font-size: 1.2em;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 4.5em; /* Ukuran font yang sangat besar */
  margin-bottom: 20px;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-description {
  font-size: 1.4em;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* --- General Section Styling (for About, Featured Menu, CTA) --- */
section {
  padding: 80px 20px; /* Padding vertikal yang konsisten antar section */
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0; /* Default hidden for scroll animation */
  transform: translateY(30px); /* Default slightly moved for scroll animation */
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

/* Class to apply when section is in view (handled by JS later or AOS) */
/* Ini ada di animations.css dan harusnya bekerja sama dengan JS di atas */
.section-in-view { /* Ini hanya contoh nama, yang dipakai di JS adalah `is-visible` */
  opacity: 1;
  transform: translateY(0);
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

/* --- About Section --- */
.about-section {
  background-color: #fff;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr; /* Default one column for mobile */
  gap: 40px;
  align-items: center;
}

.about-text {
  line-height: 1.8;
  color: #555;
}

.about-text p {
  margin-bottom: 20px;
}

.about-image {
  text-align: center;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 12px; /* Border-radius untuk gambar */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* --- Featured Menu Section --- */
.featured-menu-section {
  background-color: #f9f9f9;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.menu-price {
  font-weight: bold;
  font-size: 1.2em;
  color: var(--primary-color);
  margin-top: 15px;
}

/* --- Call to Action Section --- */
.cta-section {
  position: relative;
  width: 100%;
  background-image: url('@/assets/img/hero/cta-background.jpg'); /* Ganti dengan jalur gambar Anda */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Untuk efek parallax */
  overflow: hidden; /* Penting untuk clipping */
  color: white;
  text-align: center;
  padding: 80px 20px; /* Jaga padding yang nyaman */
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Overlay hitam semi-transparan */
  z-index: 1;
}

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px; /* Padding content */
}


.cta-title {
  font-family: var(--font-heading);
  font-size: 3em;
  margin-bottom: 20px;
}

.cta-description {
  font-size: 1.2em;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* Override button styles for CTA section (optional) */
.cta-actions .btn-secondary {
  background-color: rgba(255, 255, 255, 0.2); /* Latar belakang transparan putih */
  color: white;
  border: 1px solid white;
}

.cta-actions .btn-secondary:hover {
  background-color: white;
  color: var(--primary-color);
}

/* --- Testimonials Section --- */
.testimonials-section {
  background-color: var(--secondary-color); /* Latar belakang abu-abu terang */
  text-align: center;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background-color: var(--bg-light);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Untuk mendorong rating/author ke bawah */
}

.testimonial-quote {
  font-size: 1.15em;
  font-style: italic;
  line-height: 1.7;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.testimonial-author {
  font-weight: 600;
  color: var(--primary-color);
  margin-top: auto; /* Dorong ke bawah */
  margin-bottom: 10px;
}

.testimonial-rating {
  color: #FFD700; /* Warna emas untuk bintang */
  font-size: 1.1em;
}

.testimonial-rating .fa-star {
  margin-right: 2px;
  opacity: 0.5; /* Bintang kosong */
}

.testimonial-rating .fa-star.filled {
  opacity: 1; /* Bintang terisi */
}

.no-testimonials-message {
  font-size: 1.1em;
  color: var(--text-light);
  padding: 40px 0;
  font-style: italic;
}


/* --- Animations --- */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* --- Media Queries --- */
@media (min-width: 768px) {
  .hero-title {
    font-size: 5.5em; /* Lebih besar di desktop */
  }

  .about-grid {
    grid-template-columns: 1fr 1fr; /* Dua kolom di desktop */
    align-items: start; /* Align items to top */
  }

  .about-text {
    padding-right: 30px; /* Spacing di antara teks dan gambar */
  }

  .cta-title {
    font-size: 4em;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 3em;
  }
  .hero-description {
    font-size: 1em;
  }
  .hero-actions, .cta-actions {
    flex-direction: column;
    gap: 15px;
  }
  .hero-actions .btn, .cta-actions .btn {
    width: 100%;
    max-width: 250px;
  }
  .section-title {
    font-size: 2em;
  }
  .section-subtitle {
    font-size: 1em;
  }
  section {
    padding: 60px 15px;
  }
}
</style>