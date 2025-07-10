<template>
    <div class="default-layout">
      <AppHeader />
  
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
  
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppHeader from '@/components/layout/AppHeader.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
  
  export default {
    name: 'DefaultLayout',
    components: {
      AppHeader,
      AppFooter,
    },
  };
  </script>
  
  <style scoped>
  /* Pastikan Anda sudah mengimpor font Open Sans atau font lain yang Anda gunakan di assets/css/base.css */
  
  .default-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Memastikan layout mengambil tinggi penuh viewport */
    /* Memberikan ruang di atas untuk header fixed, sesuaikan dengan tinggi header Anda */
    padding-top: 80px; /* Sesuaikan dengan tinggi AppHeader, misal 60px + sedikit margin */
  }
  
  .main-content {
    flex-grow: 1; /* Konten utama akan mengisi ruang yang tersedia */
    /* Jika konten Anda tidak selalu membutuhkan lebar penuh, Anda bisa menambahkan max-width dan margin auto di sini */
    /* max-width: 1200px; */
    /* margin: 0 auto; */
  }
  
  /* --- Transisi Halaman (opsional, untuk UX yang lebih baik) --- */
  /* Nama transisi 'page-fade' sesuai dengan <transition name="page-fade"> */
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .page-fade-enter-from,
  .page-fade-leave-to {
    opacity: 0;
  }
  </style>