<template>
    <div class="staff-layout">
      <StaffSidebar v-model="isSidebarOpen" />
  
      <div :class="['staff-main-content', { 'sidebar-shift': isSidebarOpen && !isMobile }]">
        <header class="staff-header">
          <button class="toggle-sidebar-btn" @click="toggleSidebar" v-if="isMobile">
            <i class="fas fa-bars"></i>
          </button>
          <h2 class="staff-panel-title">Dashboard Karyawan</h2>
          <div class="header-actions">
            <span class="user-info">Halo, {{ authStore.user?.username || 'Karyawan' }}!</span>
            <Button type="primary" @click="handleLogout">Logout</Button>
          </div>
        </header>
  
        <main class="staff-page-content">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
  
        <footer class="staff-footer">
          <p>&copy; {{ currentYear }} Nama Restoran - Staff Panel. Semua Hak Cipta Dilindungi.</p>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import StaffSidebar from '@/components/staff/StaffSidebar.vue'; // Sesuaikan path
  import Button from '@/components/common/Button.vue'; // Sesuaikan path
  import { useAuthStore } from '@/stores/auth'; // Sesuaikan path
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'StaffLayout',
    components: {
      StaffSidebar,
      Button,
    },
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      const isSidebarOpen = ref(true); // Sidebar default terbuka di desktop
      const isMobile = ref(window.innerWidth < 768); // Deteksi mode mobile
  
      const currentYear = new Date().getFullYear(); // Ambil tahun saat ini secara dinamis
  
      // Fungsi untuk mengubah status sidebar
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
        // Kunci/buka scroll body saat sidebar dibuka/ditutup di mobile
        if (isMobile.value) {
          document.body.style.overflow = isSidebarOpen.value ? 'hidden' : '';
        }
      };
  
      // Logout handler
      const handleLogout = () => {
        authStore.logout();
        router.push('/auth'); // Redirect ke halaman login
      };
  
      // Handle resize untuk menyesuaikan tampilan sidebar antara desktop dan mobile
      const handleResize = () => {
        const wasMobile = isMobile.value;
        isMobile.value = window.innerWidth < 768; // Perbarui status mobile
  
        // Jika beralih dari mobile ke desktop
        if (wasMobile && !isMobile.value) {
          isSidebarOpen.value = true; // Sidebar selalu terbuka di desktop
          document.body.style.overflow = ''; // Pastikan scroll body normal
        }
        // Jika beralih dari desktop ke mobile
        if (!wasMobile && isMobile.value) {
          isSidebarOpen.value = false; // Sidebar default tertutup di mobile
          document.body.style.overflow = ''; // Pastikan scroll body normal saat transisi
        }
      };
  
      onMounted(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Panggil saat mount untuk inisialisasi awal
      });
  
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        document.body.style.overflow = ''; // Pastikan overflow kembali normal saat komponen dihancurkan
      });
  
      // Watch sidebar status untuk memastikan overflow body diperbarui
      watch(isSidebarOpen, (newVal) => {
        if (isMobile.value) { // Hanya terapkan di mobile
          document.body.style.overflow = newVal ? 'hidden' : '';
        }
      });
  
      return {
        authStore,
        isSidebarOpen,
        isMobile,
        currentYear,
        toggleSidebar,
        handleLogout,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Variabel CSS, konsisten dengan StaffSidebar (atau bisa disesuaikan) */
  :root {
    --sidebar-width-desktop-staff: 220px; /* Sesuaikan dengan lebar StaffSidebar */
    --sidebar-bg-staff: #34495e; /* Warna background sidebar staf */
    --header-height-staff: 70px; /* Tinggi header staf */
  }
  
  .staff-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f0f2f5; /* Background utama konten staf, sedikit berbeda dari admin */
  }
  
  /* Konten Utama (di samping sidebar) */
  .staff-main-content {
    flex-grow: 1; /* Mengisi sisa ruang */
    margin-left: var(--sidebar-width-desktop-staff); /* Memberikan ruang untuk sidebar */
    transition: margin-left 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
  }
  
  /* Header Karyawan */
  .staff-header {
    background-color: white;
    height: var(--header-height-staff);
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    z-index: 100;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
  }
  
  .staff-panel-title {
    margin: 0;
    font-size: 1.4em; /* Sedikit lebih kecil dari admin jika diinginkan */
    color: #333;
    flex-grow: 1;
  }
  
  .toggle-sidebar-btn {
    display: none; /* Sembunyikan di desktop */
    background: none;
    border: none;
    font-size: 1.5em;
    color: #555;
    cursor: pointer;
    margin-right: 15px;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-info {
    font-weight: 500;
    color: #555;
  }
  
  /* Area Konten Halaman Karyawan (router-view) */
  .staff-page-content {
    flex-grow: 1;
    padding: 30px;
    overflow-y: auto;
  }
  
  /* Footer Karyawan */
  .staff-footer {
    padding: 15px 20px;
    background-color: #e9ecef;
    color: #6c757d;
    text-align: center;
    font-size: 0.85em;
    border-top: 1px solid #dee2e6;
    margin-top: auto;
  }
  
  /* --- Transisi Halaman (sama seperti DefaultLayout dan AdminLayout) --- */
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .page-fade-enter-from,
  .page-fade-leave-to {
    opacity: 0;
  }
  
  /* --- Responsif untuk Mobile --- */
  @media (max-width: 768px) {
    .staff-main-content {
      margin-left: 0; /* Tidak ada margin-left di mobile */
    }
  
    .toggle-sidebar-btn {
      display: block; /* Tampilkan tombol hamburger di mobile */
    }
  
    .staff-header {
      justify-content: flex-start;
    }
  
    .staff-panel-title {
      font-size: 1.2em;
    }
  
    .staff-page-content {
      padding: 20px;
    }
  
    .staff-footer {
      padding: 10px 15px;
    }
  }
  </style>