<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

// Mengakses store untuk otentikasi dan keranjang belanja
const authStore = useAuthStore();
const cartStore = useCartStore();
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <RouterLink to="/" class="brand-link">
        🍔 Cepat Saji
      </RouterLink>
    </div>
    
    <div class="navbar-links">
      <RouterLink to="/">Beranda</RouterLink>
      <RouterLink to="/foods">Menu</RouterLink>
      <RouterLink to="/about">Tentang Kami</RouterLink>
      
      <RouterLink v-if="authStore.isAdmin" to="/admin/foods" class="admin-link">
        Manajemen Menu
      </RouterLink>
    </div>
    
    <div class="navbar-actions">
      <template v-if="authStore.isLoggedIn">
        <span class="welcome-user">Halo, {{ authStore.user.name }}</span>
        
        <RouterLink to="/cart" class="cart-link">
          Keranjang 🛒
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>
        
        <button @click="authStore.logout()" class="logout-button">Logout</button>
      </template>
      
      <template v-else>
        <RouterLink to="/login" class="login-button">Login</RouterLink>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand .brand-link {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
}

.navbar-links, .navbar-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.navbar-links a {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.2s, color 0.2s;
}

.navbar-links .router-link-exact-active {
  color: var(--color-primary);
}

.admin-link {
  border: 1px solid #007bff;
  color: #007bff !important;
}
.admin-link:hover {
  background-color: #e6f2ff;
}

.welcome-user {
  font-weight: 500;
  color: var(--color-text);
}

.cart-link, .login-button, .logout-button {
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.cart-link {
  background-color: var(--color-primary);
  color: var(--color-white);
  position: relative;
}
.cart-link:hover {
  background-color: var(--color-primary-dark);
}

.cart-badge {
  background-color: var(--color-white);
  color: var(--color-primary);
  border-radius: 50%;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 0.5rem;
}

.login-button {
  background-color: var(--color-secondary);
  color: var(--color-white);
}
.login-button:hover {
  background-color: var(--color-secondary-dark);
}

.logout-button {
  background-color: transparent;
  border-color: #6c757d;
  color: #6c757d;
}
.logout-button:hover {
  background-color: #6c757d;
  color: white;
}
</style>