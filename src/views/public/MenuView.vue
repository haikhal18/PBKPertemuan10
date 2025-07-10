<template>
    <div class="menu-view">
      <section class="menu-hero">
        <div class="menu-hero-content">
          <h1 class="menu-hero-title">Menu Kami</h1>
          <p class="menu-hero-subtitle">Jelajahi Beragam Pilihan Kuliner Istimewa</p>
        </div>
      </section>
  
      <section class="menu-content">
        <div class="menu-filters">
          <h3 class="filter-title">Filter Kategori:</h3>
          <div class="filter-buttons">
            <Button
              type="secondary"
              :class="{ 'active-filter': activeCategory === 'all' }"
              @click="setActiveCategory('all')"
            >
              Semua
            </Button>
            <Button
              v-for="category in uniqueCategories"
              :key="category"
              type="secondary"
              :class="{ 'active-filter': activeCategory === category }"
              @click="setActiveCategory(category)"
            >
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </Button>
          </div>
        </div>
  
        <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat daftar menu..." size="60px" color="#A00" />
        <p v-else-if="menuItems.length === 0 && !isLoading" class="no-items-message">
          Maaf, belum ada item menu yang tersedia untuk kategori ini.
        </p>
        <div v-else class="menu-grid">
          <Card
            v-for="item in filteredMenuItems"
            :key="item.id"
            :imageUrl="item.imageUrl"
            :imageAlt="item.name"
            hoverEffect
          >
            <h3 class="menu-item-title">{{ item.name }}</h3>
            <p class="menu-item-description">{{ item.description }}</p>
            <p class="menu-item-price">Rp {{ item.price.toLocaleString('id-ID') }}</p>
            <template #footer>
              <Button type="primary" style="width: 100%;" @click="addToCart(item)">Tambahkan ke Keranjang</Button>
            </template>
          </Card>
        </div>
      </section>
    </div>
  </template>
  
  <script>
import { ref, onMounted, computed } from 'vue';
import Button from '@/components/common/Button.vue';
import Card from '@/components/common/Card.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useCartStore } from '@/stores/cart';
import { fetchAllMenus } from '@/composables/useApi'; // Ini sudah benar!

export default {
  name: 'MenuView',
  components: {
    Button,
    Card,
    LoadingSpinner,
  },
  setup() {
    const cartStore = useCartStore();

    const menuItems = ref([]); // State untuk menyimpan semua item menu
    const isLoading = ref(true); // State untuk loading spinner
    const activeCategory = ref('all'); // State untuk kategori yang aktif

    // Ambil kategori unik dari data menu
    const uniqueCategories = computed(() => {
      const categories = new Set();
      menuItems.value.forEach(item => {
        if (item.category) {
          categories.add(item.category);
        }
      });
      return Array.from(categories);
    });

    // Filter menu item berdasarkan kategori yang aktif
    const filteredMenuItems = computed(() => {
      if (activeCategory.value === 'all') {
        return menuItems.value;
      }
      return menuItems.value.filter(item => item.category === activeCategory.value);
    });

    // Fungsi untuk mengubah kategori aktif
    const setActiveCategory = (category) => {
      activeCategory.value = category;
    };

    // Fungsi untuk menambahkan item ke keranjang
    const addToCart = (item) => {
      cartStore.addItem(item);
      alert(`${item.name} telah ditambahkan ke keranjang!`); // Notifikasi sederhana
    };

    // Fungsi untuk memuat semua data menu dari API
    const loadMenuItems = async () => {
      isLoading.value = true; // Aktifkan loading spinner
      try {
        menuItems.value = await fetchAllMenus(); // PENTING: Panggilan fungsi yang benar!
      } catch (error) {
        console.error('Gagal memuat menu:', error);
        alert('Gagal memuat menu. Silakan coba lagi nanti.'); // Notifikasi error ke user
      } finally {
        isLoading.value = false; // Nonaktifkan loading spinner
      }
    };

    // Panggil saat komponen di-mount
    onMounted(() => {
      loadMenuItems();
    });

    return {
      menuItems,
      isLoading,
      activeCategory,
      uniqueCategories,
      filteredMenuItems,
      setActiveCategory,
      addToCart,
    };
  },
};
</script>
  
  <style scoped>
  /* Variabel CSS, konsisten dengan HomeView atau base.css */
  :root {
    --primary-color: #a00;
    --secondary-color: #f0f0f0;
    --text-dark: #333;
    --text-light: #f0f0f0;
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Open Sans', sans-serif;
  }
  
  .menu-view {
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  /* --- Menu Hero Section --- */
  .menu-hero {
    position: relative;
    width: 100%;
    height: 40vh; /* Tinggi yang lebih pendek dari hero HomeView */
    background-image: url('@/assets/img/hero/menu-hero-bg.jpg'); /* Ganti dengan gambar latar belakang menu */
    background-size: cover;
    background-position: center;
    background-attachment: fixed; /* Efek Parallax */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    overflow: hidden;
  }
  
  .menu-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Overlay gelap */
    z-index: 1;
  }
  
  .menu-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 20px;
  }
  
  .menu-hero-title {
    font-family: var(--font-heading);
    font-size: 3.5em;
    margin-bottom: 10px;
    line-height: 1.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .menu-hero-subtitle {
    font-size: 1.2em;
    margin-top: 0;
  }
  
  /* --- Menu Content Section --- */
  .menu-content {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .menu-filters {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .filter-title {
    font-family: var(--font-heading);
    font-size: 1.8em;
    color: var(--primary-color);
    margin-bottom: 20px;
  }
  
  .filter-buttons {
    display: flex;
    flex-wrap: wrap; /* Agar tombol bisa pindah baris di mobile */
    justify-content: center;
    gap: 15px; /* Jarak antar tombol filter */
  }
  
  /* Style khusus untuk tombol filter aktif */
  .filter-buttons .btn.active-filter {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  .filter-buttons .btn.active-filter:hover {
    background-color: darken(var(--primary-color), 10%); /* Jika pakai SCSS */
    background-color: #800; /* Jika pakai Vanilla CSS */
  }
  
  .no-items-message {
    text-align: center;
    font-size: 1.2em;
    color: #777;
    padding: 50px 0;
  }
  
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Responsif grid menu */
    gap: 30px; /* Jarak antar kartu menu */
  }
  
  /* Styling untuk teks di dalam Card */
  .menu-item-title {
    font-family: var(--font-heading);
    font-size: 1.5em;
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--text-dark);
  }
  
  .menu-item-description {
    font-size: 0.95em;
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
  }
  
  .menu-item-price {
    font-weight: bold;
    font-size: 1.2em;
    color: var(--primary-color);
    margin-top: 15px;
    margin-bottom: 0;
  }
  
  /* --- Media Queries --- */
  @media (max-width: 768px) {
    .menu-hero {
      height: 30vh;
    }
    .menu-hero-title {
      font-size: 2.5em;
    }
    .menu-hero-subtitle {
      font-size: 1em;
    }
    .menu-content {
      padding: 40px 15px;
    }
    .filter-title {
      font-size: 1.5em;
    }
    .filter-buttons {
      gap: 10px;
    }
    .menu-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }
  
  @media (max-width: 480px) {
    .menu-hero-title {
      font-size: 2em;
    }
    .menu-hero-subtitle {
      font-size: 0.9em;
    }
  }
  </style>