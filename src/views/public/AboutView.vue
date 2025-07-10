<template>
  <div class="about-view">
    <section class="about-hero fade-in-on-scroll">
      <div class="about-hero-content">
        <h1 class="about-hero-title">Tentang Kami</h1>
        <p class="about-hero-subtitle">Cita Rasa, Gairah, dan Warisan.</p>
      </div>
    </section>

    <section class="history-mission-section fade-in-on-scroll">
      <div class="section-container">
        <h2 class="section-title">Perjalanan Kuliner Kami</h2>
        <p class="section-subtitle">Dari Impian Menjadi Hidangan.</p>

        <div class="content-block">
          <div class="text-content">
            <h3>Sejarah Singkat</h3>
            <p><strong>Nama Restoran Anda</strong> berdiri pada tahun 2020, berawal dari impian sederhana untuk menciptakan sebuah tempat di mana setiap hidangan bukan hanya makanan, tetapi sebuah pengalaman. Didirikan oleh Chef [Nama Chef/Pendiri], yang memiliki latar belakang keluarga koki dan kecintaan mendalam pada bahan-bahan lokal, restoran ini tumbuh dari sebuah dapur kecil menjadi destinasi kuliner yang dicintai.</p>
            <p>Sejak hari pertama, kami berkomitmen untuk menyajikan hidangan dengan integritas, menggunakan resep tradisional yang diwariskan dari generasi ke generasi, namun dengan sentuhan inovatif yang modern.</p>
          </div>
          <div class="image-content">
            <img src="@/assets/img/about/about-history.jpg" alt="Sejarah Restoran" class="img-fluid" />
          </div>
        </div>

        <div class="content-block reverse">
          <div class="image-content">
            <img src="@/assets/img/about/about-mission.jpg" alt="Visi Misi Restoran" class="img-fluid" />
          </div>
          <div class="text-content">
            <h3>Visi & Misi</h3>
            <p><strong>Visi Kami:</strong> Menjadi restoran terkemuka yang diakui atas inovasi kuliner, pelayanan prima, dan komitmen terhadap keberlanjutan.</p>
            <p><strong>Misi Kami:</strong></p>
            <ul>
              <li>Menyajikan hidangan yang tak hanya lezat, tetapi juga menginspirasi dan menggugah selera.</li>
              <li>Menciptakan suasana hangat dan ramah yang membuat setiap pengunjung merasa seperti di rumah.</li>
              <li>Mendukung petani dan pemasok lokal untuk menjamin kesegaran dan kualitas bahan baku.</li>
              <li>Mengembangkan tim yang berdedikasi dan bersemangat untuk memberikan pelayanan terbaik.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section fade-in-on-scroll">
      <div class="section-container">
        <h2 class="section-title">Tim Kami</h2>
        <p class="section-subtitle">Para Penggerak di Balik Setiap Sajian.</p>
        <div class="team-grid">
          <div class="team-member">
            <img src="@/assets/img/team/team-chef.jpg" alt="Chef Utama" class="member-photo" />
            <h4 class="member-name">Chef Budi Santoso</h4>
            <p class="member-role">Kepala Koki</p>
            <p class="member-bio">Dengan pengalaman lebih dari 15 tahun di dunia kuliner, Chef Budi adalah jantung dari dapur kami. Keahliannya dalam memadukan rasa tradisional dengan teknik modern menciptakan hidangan yang tak terlupakan.</p>
          </div>
          <div class="team-member">
            <img src="@/assets/img/team/team-manager.jpg" alt="Manager Restoran" class="member-photo" />
            <h4 class="member-name">Dewi Anggraini</h4>
            <p class="member-role">Manajer Restoran</p>
            <p class="member-bio">Dewi memastikan setiap aspek pelayanan berjalan lancar, dari sambutan hangat hingga pengalaman bersantap yang sempurna. Keramahannya adalah bagian tak terpisahkan dari suasana restoran kami.</p>
          </div>
          </div>
      </div>
    </section>

    <section class="values-section fade-in-on-scroll">
      <div class="section-container">
        <h2 class="section-title">Nilai-Nilai Kami</h2>
        <p class="section-subtitle">Fondasi Setiap Keputusan Kami.</p>
        <div class="values-grid">
          <div class="value-item">
            <i class="fas fa-hand-holding-heart value-icon"></i>
            <h3>Kualitas Tanpa Kompromi</h3>
            <p>Kami berkomitmen untuk menggunakan hanya bahan-bahan segar dan terbaik, disiapkan dengan standar kebersihan tertinggi.</p>
          </div>
          <div class="value-item">
            <i class="fas fa-seedling value-icon"></i>
            <h3>Keberlanjutan Lokal</h3>
            <p>Mendukung komunitas lokal dengan bermitra bersama petani dan pemasok dari Pekanbaru dan sekitarnya.</p>
          </div>
          <div class="value-item">
            <i class="fas fa-award value-icon"></i>
            <h3>Inovasi Berkelanjutan</h3>
            <p>Terus berinovasi dalam menu dan pengalaman bersantap, sambil tetap menghormati akar kuliner tradisional.</p>
          </div>
          <div class="value-item">
            <i class="fas fa-smile value-icon"></i>
            <h3>Pelayanan Penuh Hati</h3>
            <p>Setiap anggota tim kami berdedikasi untuk memberikan pelayanan yang ramah, efisien, dan personal.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import Button from '@/components/common/Button.vue'; // Diperlukan karena Anda pakai <Button> di template
import { useScrollAnimation } from '@/composables/useScrollAnimation'; // Impor composable baru

export default {
  name: 'AboutView',
  components: { // Pastikan Button didaftarkan
    Button,
  },
  setup() {
    onMounted(() => {
      // Kode Intersection Observer kini di dalam useScrollAnimation composable
      // Tidak perlu ada kode di onMounted di sini untuk scroll animation lagi
    });

    // --- PANGGIL COMPOSABLE BARU UNTUK MENGAKTIFKAN ANIMASI SCROLL ---
    // Selector harus mencari elemen di dalam komponen AboutView ini
    useScrollAnimation('.about-view section.fade-in-on-scroll', 'is-visible');

    return {}; // Tidak ada data reaktif atau metode yang spesifik untuk halaman ini saja
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

.about-view {
  font-family: var(--font-body);
  color: var(--text-dark);
}

/* --- About Hero Section --- */
.about-hero {
  position: relative;
  width: 100%;
  height: 35vh;
  /* PASTIKAN FILE ADA DI `src/assets/img/hero/about-hero-bg.jpg` */
  background-image: url('@/assets/img/hero/about-hero-bg.jpg'); 
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

.about-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.about-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 20px;
}

.about-hero-title {
  font-family: var(--font-heading);
  font-size: 3em;
  margin-bottom: 10px;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.about-hero-subtitle {
  font-size: 1.1em;
  margin-top: 0;
}

/* --- General Section Styling --- */
/* Umum untuk history-mission, team, values */
section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0; /* Default hidden for scroll animation */
  transform: translateY(30px); /* Default slightly moved for scroll animation */
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

/* Class to apply when section is in view (handled by JS later) */
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

/* --- History & Mission Section --- */
.history-mission-section {
  background-color: #fff;
}

.content-block {
  display: grid;
  grid-template-columns: 1fr; /* Default one column for mobile */
  gap: 40px;
  align-items: center;
  margin-bottom: 60px; /* Jarak antar blok konten */
}

.content-block.reverse {
  /* Di desktop, balik urutan kolom */
  grid-template-columns: 1fr; /* Default tetap 1 kolom di mobile */
}

.text-content {
  line-height: 1.8;
  color: #555;
}

.text-content h3 {
  font-family: var(--font-heading);
  font-size: 2em;
  color: var(--text-dark);
  margin-bottom: 15px;
}

.text-content p {
  margin-bottom: 15px;
}

.text-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.text-content ul li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;
}

/* Contoh custom bullet point */
ul li::before {
  content: '\2022'; /* Unicode bullet point */
  color: var(--primary-color); /* Warna bullet point */
  position: absolute;
  left: 0;
  font-weight: bold;
}

.image-content {
  text-align: center;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out; /* For optional scroll animation */
}

/* --- Team Section --- */
.team-section {
  background-color: #f9f9f9;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.team-member {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.member-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 20px;
  border: 4px solid var(--primary-color); /* Border foto tim */
}

.member-name {
  font-family: var(--font-heading);
  font-size: 1.5em;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.member-role {
  font-size: 0.95em;
  color: #a00;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.member-bio {
  font-size: 0.9em;
  color: #666;
  line-height: 1.6;
}

/* --- Values Section --- */
.values-section {
  background-color: #fff;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.value-item {
  text-align: center;
  padding: 25px;
  background-color: #fcfcfc;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: background-color 0.3s ease;
}

.value-item:hover {
  background-color: #f0f0f0;
}

.value-icon {
  font-size: 3em;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.value-item h3 {
  font-family: var(--font-heading);
  font-size: 1.4em;
  color: var(--text-dark);
  margin-bottom: 10px;
}

.value-item p {
  font-size: 0.9em;
  color: #666;
  line-height: 1.6;
}


/* --- Media Queries --- */
@media (min-width: 768px) {
  .content-block {
    grid-template-columns: 1fr 1fr; /* Dua kolom di desktop */
  }
  .content-block.reverse {
    grid-template-columns: 1fr 1fr;
    direction: rtl; /* Membalik urutan visual kolom tanpa mengubah DOM order */
  }
  .content-block.reverse .text-content,
  .content-block.reverse .image-content {
    direction: ltr; /* Mengembalikan arah teks dan gambar di dalam kolom */
  }

  .text-content {
    text-align: left;
  }
  .image-content {
    text-align: right; /* Untuk gambar di sisi kanan */
  }
  .content-block.reverse .image-content {
    text-align: left; /* Untuk gambar di sisi kiri saat reverse */
  }
  .text-content ul {
    text-align: left; /* Pastikan list rata kiri */
  }
  .team-grid {
    grid-template-columns: repeat(2, 1fr); /* Dua kolom untuk tim di tablet */
  }
}

@media (min-width: 992px) {
  .team-grid {
    grid-template-columns: repeat(3, 1fr); /* Tiga kolom untuk tim di desktop */
  }
  .values-grid {
    grid-template-columns: repeat(4, 1fr); /* Empat kolom untuk values di desktop */
  }
}

@media (max-width: 768px) {
  .about-hero {
    height: 25vh;
  }
  .about-hero-title {
    font-size: 2.2em;
  }
  .about-hero-subtitle {
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
  .content-block, .content-block.reverse {
    grid-template-columns: 1fr; /* Satu kolom di mobile */
    gap: 20px; /* Sedikit lebih kecil untuk gap */
  }
  .team-member, .value-item {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .about-hero-title {
    font-size: 2em;
  }
  .about-hero-subtitle {
    font-size: 0.8em;
  }
}
</style>