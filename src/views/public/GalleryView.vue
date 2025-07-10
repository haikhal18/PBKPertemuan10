<template>
    <div class="gallery-view">
      <section class="gallery-hero">
        <div class="gallery-hero-content">
          <h1 class="gallery-hero-title">Galeri Foto</h1>
          <p class="gallery-hero-subtitle">Momen Indah, Cita Rasa Tak Terlupakan.</p>
        </div>
      </section>
  
      <section class="gallery-content">
        <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat galeri foto..." size="60px" color="#A00" />
  
        <div v-else-if="galleryItems.length === 0" class="empty-gallery">
          <i class="fas fa-camera-retro empty-gallery-icon"></i>
          <p class="empty-gallery-message">Belum ada foto di galeri ini.</p>
          <p class="empty-gallery-suggestion">Segera tambahkan koleksi visual restoran Anda!</p>
        </div>
  
        <div v-else class="gallery-grid">
          <div
            v-for="item in galleryItems"
            :key="item.id"
            class="gallery-item"
            @click="openLightbox(item)"
          >
            <img :src="item.src" :alt="item.alt" class="gallery-image" loading="lazy" />
            <div class="gallery-overlay">
              <h3 class="gallery-title">{{ item.title }}</h3>
              <p class="gallery-category">{{ item.category }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <Modal :isVisible="isLightboxOpen" :showCloseButton="true" :closeOnClickOutside="true" @close="closeLightbox" maxWidth="90%">
        <template #body>
          <div class="lightbox-content">
            <img :src="currentLightboxImage.src" :alt="currentLightboxImage.alt" class="lightbox-image" />
            <h3 class="lightbox-title">{{ currentLightboxImage.title }}</h3>
            <p class="lightbox-description">{{ currentLightboxImage.description }}</p>
          </div>
        </template>
      </Modal>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'; // Pastikan path benar
  import Modal from '@/components/common/Modal.vue';                   // Pastikan path benar
  import { fetchGalleryItems } from '@/composables/useApi';            // Pastikan path dan fungsi fetchGalleryItems benar
  
  export default {
    name: 'GalleryView',
    components: {
      LoadingSpinner,
      Modal,
    },
    setup() {
      const galleryItems = ref([]); // State untuk menyimpan daftar item galeri
      const isLoading = ref(true);    // State untuk loading spinner
  
      const isLightboxOpen = ref(false); // State untuk mengontrol visibilitas lightbox
      const currentLightboxImage = ref({}); // State untuk menyimpan data gambar yang sedang ditampilkan di lightbox
  
      // Fungsi untuk memuat item galeri dari API
      const loadGalleryItems = async () => {
        isLoading.value = true;
        try {
          const response = await fetchGalleryItems(); // Mengambil data galeri dari json-server
          galleryItems.value = response;
        } catch (error) {
          console.error('Gagal memuat item galeri:', error);
          alert('Gagal memuat galeri. Silakan coba lagi nanti.');
        } finally {
          isLoading.value = false;
        }
      };
  
      // Fungsi untuk membuka lightbox
      const openLightbox = (item) => {
        currentLightboxImage.value = item;
        isLightboxOpen.value = true;
      };
  
      // Fungsi untuk menutup lightbox
      const closeLightbox = () => {
        isLightboxOpen.value = false;
        currentLightboxImage.value = {}; // Bersihkan data saat ditutup
      };
  
      onMounted(() => {
        loadGalleryItems(); // Panggil saat komponen di-mount
      });
  
      return {
        galleryItems,
        isLoading,
        isLightboxOpen,
        currentLightboxImage,
        openLightbox,
        closeLightbox,
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
  
  .gallery-view {
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  /* --- Gallery Hero Section --- */
  .gallery-hero {
    position: relative;
    width: 100%;
    height: 35vh;
    background-image: url('@/assets/img/gallery-hero-bg.jpg'); /* Ganti dengan gambar latar belakang galeri */
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
  
  .gallery-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  .gallery-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 20px;
  }
  
  .gallery-hero-title {
    font-family: var(--font-heading);
    font-size: 3em;
    margin-bottom: 10px;
    line-height: 1.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .gallery-hero-subtitle {
    font-size: 1.1em;
    margin-top: 0;
  }
  
  /* --- Gallery Content Section --- */
  .gallery-content {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Empty Gallery State */
  .empty-gallery {
    text-align: center;
    padding: 80px 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  .empty-gallery-icon {
    font-size: 4em;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .empty-gallery-message {
    font-size: 1.8em;
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
  }
  
  .empty-gallery-suggestion {
    font-size: 1.1em;
    color: #777;
  }
  
  /* Gallery Grid */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsif grid */
    gap: 25px; /* Jarak antar item galeri */
  }
  
  .gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .gallery-image {
    width: 100%;
    height: 250px; /* Tinggi gambar yang konsisten */
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease; /* Untuk efek zoom hover */
  }
  
  .gallery-item:hover .gallery-image {
    transform: scale(1.05); /* Zoom in effect on hover */
  }
  
  .gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)); /* Gradasi gelap di bawah */
    color: white;
    transform: translateY(100%); /* Sembunyikan overlay di luar view */
    transition: transform 0.3s ease;
  }
  
  .gallery-item:hover .gallery-overlay {
    transform: translateY(0); /* Tampilkan overlay saat hover */
  }
  
  .gallery-title {
    font-family: var(--font-heading);
    font-size: 1.4em;
    margin: 0 0 5px;
  }
  
  .gallery-category {
    font-size: 0.9em;
    opacity: 0.8;
    text-transform: capitalize;
  }
  
  /* --- Lightbox Modal Content --- */
  .lightbox-content {
    text-align: center;
    padding: 20px;
  }
  
  .lightbox-image {
    max-width: 100%;
    max-height: 80vh; /* Batasi tinggi gambar di modal */
    display: block;
    margin: 0 auto 20px; /* Pusatkan gambar */
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .lightbox-title {
    font-family: var(--font-heading);
    font-size: 1.8em;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  
  .lightbox-description {
    font-size: 1em;
    color: #555;
    line-height: 1.5;
  }
  
  /* --- Media Queries --- */
  @media (max-width: 768px) {
    .gallery-hero {
      height: 25vh;
    }
    .gallery-hero-title {
      font-size: 2.2em;
    }
    .gallery-hero-subtitle {
      font-size: 0.9em;
    }
    .gallery-content {
      padding: 30px 15px;
    }
    .gallery-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Lebih rapat di mobile */
      gap: 15px;
    }
    .gallery-image {
      height: 180px; /* Tinggi gambar lebih kecil di mobile */
    }
    .gallery-title {
      font-size: 1.2em;
    }
  }
  
  @media (max-width: 480px) {
    .gallery-hero-title {
      font-size: 2em;
    }
    .gallery-hero-subtitle {
      font-size: 0.8em;
    }
    .empty-gallery-message {
      font-size: 1.5em;
    }
  }
  </style>