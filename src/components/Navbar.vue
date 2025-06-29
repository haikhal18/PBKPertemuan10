<template>
  <nav class="navbar">
    <!-- Logo -->
    <div class="logo">
      <RouterLink to="/">🍽 FoodOrder</RouterLink>
    </div>

    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" @click="toggleMobileMenu">
      ☰
    </button>

    <!-- Navigasi dan tombol -->
    <div class="nav-right" :class="{ 'mobile-menu-active': isMobileMenuOpen }">
      <ul class="nav-links">
        <!-- Belum Login (Umum) -->
        <template v-if="!user">
          <li><RouterLink to="/" @click="closeMobileMenu">Home</RouterLink></li>
          <li><RouterLink to="/restoran" @click="closeMobileMenu">Restoran</RouterLink></li>
          <li><RouterLink to="/cari" @click="closeMobileMenu">Pencarian</RouterLink></li>
          <li><RouterLink to="/login" class="login-btn" @click="closeMobileMenu">Login</RouterLink></li>
          <li><RouterLink to="/register" class="register-btn" @click="closeMobileMenu">Daftar</RouterLink></li>
        </template>

        <!-- Role: User -->
        <template v-else-if="user.role === 'user'">
          <li><RouterLink to="/" @click="closeMobileMenu">Home</RouterLink></li>
          <li><RouterLink to="/restoran" @click="closeMobileMenu">Restoran</RouterLink></li>
          <li><RouterLink to="/cari" @click="closeMobileMenu">Pencarian</RouterLink></li>
          <li><RouterLink to="/profil" @click="closeMobileMenu">Profil</RouterLink></li>
          <li class="cart-icon">
            <RouterLink to="/keranjang" @click="closeMobileMenu">
              🛒
              <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
            </RouterLink>
          </li>
        </template>

        <!-- Role: Penjual -->
        <template v-else-if="user.role === 'karywan'">
          <li><RouterLink to="/karyawan" @click="closeMobileMenu">Dashboard</RouterLink></li>
          <li><RouterLink to="/karyawan/restoran-saya" @click="closeMobileMenu">Restoran Saya</RouterLink></li>
          <li><RouterLink to="/profil" @click="closeMobileMenu">Profil</RouterLink></li>
        </template>

        <!-- Role: Admin -->
        <template v-else-if="user.role === 'admin'">
          <li><RouterLink to="/admin/dashboard" @click="closeMobileMenu">Dashboard</RouterLink></li>
          <li><RouterLink to="/admin/verifikasi" @click="closeMobileMenu">Verifikasi</RouterLink></li>
          <li><RouterLink to="/admin/laporan" @click="closeMobileMenu">Laporan</RouterLink></li>
        </template>
      </ul>

      <!-- Tombol Kembali dan Logout -->
      <div class="btn-group" v-if="user">
        <button @click="goBack" class="back-btn">← Kembali</button>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const user = computed(() => authStore.user)
const cartItemCount = computed(() => cartStore.itemCount)
const router = useRouter()
const isMobileMenuOpen = ref(false)

const logout = () => {
  authStore.logout()
  router.push('/login')
  closeMobileMenu()
}

const goBack = () => {
  router.back()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo a {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ff7f1f;
  text-decoration: none;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-links li a {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  position: relative;
}

.nav-links li a:hover {
  background-color: #f3f3f3;
  color: #000;
}

.login-btn {
  color: #333;
  border: 1px solid #ddd;
}

.register-btn {
  background-color: #ff7f1f;
  color: white;
}

.register-btn:hover {
  background-color: #e6731c;
  color: white;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.logout-btn {
  background-color: #e63946;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background-color: #c5303a;
}

.back-btn {
  background-color: #38a169;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #2f855a;
}

.cart-icon {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e63946;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .nav-right {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transform: translateY(-150%);
    transition: transform 0.3s ease;
  }

  .nav-right.mobile-menu-active {
    transform: translateY(0);
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .nav-links li {
    width: 100%;
  }

  .nav-links li a {
    padding: 0.8rem;
    border-radius: 4px;
  }

  .btn-group {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>