<template>
  <header :class="['app-header', { 'scrolled': isScrolled }]">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/img/restaurant-logo.png" alt="Restaurant Logo" class="logo-img" />
        </router-link>
      </div>

      <nav :class="{ 'nav-open': isMobileNavOpen }">
        <ul class="nav-links">
          <li><router-link to="/" @click="closeMobileNav">Beranda</router-link></li>
          <li><router-link to="/menu" @click="closeMobileNav">Menu</router-link></li>
          <li><router-link to="/gallery" @click="closeMobileNav">Galeri</router-link></li>
          <li><router-link to="/about" @click="closeMobileNav">Tentang Kami</router-link></li>
          <li><router-link to="/contact" @click="closeMobileNav">Kontak</router-link></li>

          <li v-if="authStore.isAuthenticated && authStore.isUser">
            <router-link to="/my-orders" @click="closeMobileNav">Pesanan Saya</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && authStore.isKaryawan">
            <router-link to="/staff" @click="closeMobileNav">Dashboard Karyawan</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && authStore.isAdmin">
            <router-link to="/admin" @click="closeMobileNav">Dashboard Admin</router-link>
          </li>
        </ul>

        <div class="nav-actions">
          <router-link
            v-if="!authStore.isAuthenticated || authStore.isUser"
            to="/cart"
            class="cart-icon"
            @click="closeMobileNav"
          >
            <img src="@/assets/img/icons/cart.png" alt="Cart Icon" class="cart-icon-img" />
            <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
          </router-link>

          <router-link v-if="!authStore.isAuthenticated" to="/auth" class="btn btn-primary header-btn" @click="closeMobileNav">
            Login
          </router-link>
          <Button v-else type="primary" class="header-btn" @click="handleLogout">Logout</Button>
        </div>
      </nav>

      <button class="hamburger-menu" @click="toggleMobileNav">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';

export default {
  name: 'AppHeader',
  components: {
    Button,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const router = useRouter();

    const isScrolled = ref(false);
    const isMobileNavOpen = ref(false);

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
    };

    const handleLogout = () => {
      authStore.logout();
      router.push('/');
      closeMobileNav();
    };

    const toggleMobileNav = () => {
      isMobileNavOpen.value = !isMobileNavOpen.value;
      document.body.style.overflow = isMobileNavOpen.value ? 'hidden' : '';
    };

    const closeMobileNav = () => {
      isMobileNavOpen.value = false;
      document.body.style.overflow = '';
    };

    const closeMobileNavOnDesktopResize = () => {
      if (window.innerWidth > 768 && isMobileNavOpen.value) {
        closeMobileNav();
      }
    };

    watch(isMobileNavOpen, (newVal) => {
      if (newVal) {
        window.addEventListener('resize', closeMobileNavOnDesktopResize);
      } else {
        window.removeEventListener('resize', closeMobileNavOnDesktopResize);
      }
    });

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', closeMobileNavOnDesktopResize);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', closeMobileNavOnDesktopResize);
      document.body.style.overflow = '';
    });

    return {
      authStore,
      cartStore,
      isScrolled,
      isMobileNavOpen,
      handleLogout,
      toggleMobileNav,
      closeMobileNav,
    };
  },
};
</script>
  
  <style scoped>
  

  .cart-icon-img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  display: inline-block;
}

.cart-icon {
  position: relative;
  text-decoration: none;
  transition: color 0.3s ease;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #a00;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7em;
  font-weight: bold;
  line-height: 1;
  min-width: 18px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

  .app-header {
    position: fixed; /* Header tetap di atas saat scroll */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999; /* Pastikan di atas konten lain tapi di bawah modal */
    background-color: rgba(255, 255, 255, 0.9); /* Latar belakang transparan putih */
    padding: 15px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Bayangan lembut */
    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* Transisi saat scroll */
  }
  
  /* Style saat header di-scroll (mirip Quellenhof.it yang berubah warna) */
  .app-header.scrolled {
    background-color: white; /* Lebih solid saat di-scroll */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .header-container {
    max-width: 1200px; /* Lebar maksimal konten header */
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    flex-shrink: 0; /* Mencegah logo mengecil */
  }
  
  .logo-img {
    height: 50px; /* Sesuaikan tinggi logo Anda */
    max-width: 100%;
    display: block;
  }
  
  /* Navigasi Utama */
  nav {
    display: flex;
    align-items: center;
    gap: 30px; /* Jarak antara nav-links dan nav-actions */
  }
  
  .nav-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 25px; /* Jarak antar link navigasi */
  }
  
  .nav-links li a {
    text-decoration: none;
    color: #333; /* Warna teks link default */
    font-weight: 500;
    font-size: 1.05em;
    padding: 5px 0;
    position: relative;
    transition: color 0.3s ease;
  }
  
  .nav-links li a:hover {
    color: #a00; /* Warna hover yang konsisten dengan primary button */
  }
  
  /* Indikator aktif pada link navigasi */
  .nav-links li a.router-link-active {
    color: #a00;
  }
  
  .nav-links li a.router-link-active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 2px;
    background-color: #a00;
    transform: scaleX(0.8); /* Garis bawah sedikit lebih pendek */
    transition: transform 0.3s ease;
  }
  
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 20px; /* Jarak antara ikon keranjang dan tombol login/logout */
  }
  
  /* Ikon Keranjang */
  .cart-icon {
    position: relative;
    font-size: 1.5em;
    color: #333;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .cart-icon:hover {
    color: #a00;
  }
  
  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #a00;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.7em;
    font-weight: bold;
    line-height: 1;
    min-width: 18px; /* Pastikan badge cukup lebar */
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Tombol Login/Logout (menggunakan komponen Button.vue) */
  .header-btn {
    /* Style khusus untuk tombol di header jika diperlukan,
       tapi sebagian besar styling sudah ada di Button.vue */
    padding: 8px 18px; /* Sesuaikan ukuran tombol di header */
    font-size: 0.95em;
  }
  
  /* Hamburger Menu (untuk mobile) */
  .hamburger-menu {
    display: none; /* Sembunyikan di desktop */
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  .hamburger-menu .bar {
    width: 100%;
    height: 3px;
    background-color: #333;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
  }
  
  /* Mobile Navigation */
  @media (max-width: 768px) {
    .app-header {
      padding: 10px 0;
    }
  
    .header-container {
      padding: 0 15px;
    }
  
    .hamburger-menu {
      display: flex; /* Tampilkan di mobile */
    }
  
    nav {
      position: fixed;
      top: 0;
      right: -100%; /* Sembunyikan menu di luar layar */
      width: 70%; /* Lebar menu mobile */
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.98); /* Latar belakang menu mobile */
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      flex-direction: column;
      justify-content: flex-start;
      padding-top: 80px; /* Ruang untuk header yang tetap */
      transition: right 0.4s ease-in-out;
      z-index: 998; /* Di bawah modal, di atas konten */
    }
  
    nav.nav-open {
      right: 0; /* Tampilkan menu mobile */
    }
  
    .nav-links {
      flex-direction: column;
      width: 100%;
      gap: 0; /* Hapus jarak antar link */
    }
  
    .nav-links li {
      width: 100%;
      border-bottom: 1px solid #eee; /* Garis pemisah antar link */
    }
  
    .nav-links li:last-child {
      border-bottom: none;
    }
  
    .nav-links li a {
      padding: 15px 20px;
      display: block; /* Agar seluruh area link bisa diklik */
      width: 100%;
      color: #333; /* Warna teks di menu mobile */
    }
  
    .nav-links li a.router-link-active::after {
      display: none; /* Hilangkan garis bawah di mobile */
    }
  
    .nav-actions {
      flex-direction: column;
      width: 100%;
      margin-top: 30px; /* Jarak dari nav-links */
      padding: 0 20px;
      gap: 15px;
    }
  
    .nav-actions .cart-icon {
      font-size: 2em; /* Ikon keranjang lebih besar di mobile */
      margin-bottom: 10px;
    }
  
    .header-btn {
      width: 100%; /* Tombol memenuhi lebar di mobile */
    }
  }
  </style>