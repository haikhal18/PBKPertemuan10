<template>
  <aside :class="['admin-sidebar', { 'is-open': isOpen }]">
    <div class="sidebar-header">
      <router-link to="/admin" class="sidebar-logo">
        <img src="@/assets/img/admin-logo.png" alt="Admin Logo" class="admin-logo-img" v-if="!isMobile" />
        <span class="logo-text" :class="{ 'is-mobile': isMobile }">Admin Panel</span>
      </router-link>
      <button class="close-sidebar-btn" @click="toggleSidebar" v-if="isMobile">&times;</button>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/admin" exact-active-class="active" @click="closeSidebar">
            <i class="fas fa-tachometer-alt sidebar-icon"></i>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/menu-management" active-class="active" @click="closeSidebar">
            <i class="fas fa-utensils sidebar-icon"></i>
            <span>Manajemen Menu</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/order-management" active-class="active" @click="closeSidebar">
            <i class="fas fa-clipboard-list sidebar-icon"></i>
            <span>Manajemen Pesanan</span>
            <span v-if="orderStore.pendingOrdersCount > 0" class="badge">{{ orderStore.pendingOrdersCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/user-management" active-class="active" @click="closeSidebar">
            <i class="fas fa-users sidebar-icon"></i>
            <span>Manajemen Pengguna</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/reservation-management" active-class="active" @click="closeSidebar">
            <i class="fas fa-calendar-alt sidebar-icon"></i>
            <span>Manajemen Reservasi</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/reports" active-class="active" @click="closeSidebar">
            <i class="fas fa-chart-line sidebar-icon"></i>
            <span>Laporan & Statistik</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/settings" active-class="active" @click="closeSidebar">
            <i class="fas fa-cog sidebar-icon"></i>
            <span>Pengaturan Sistem</span>
          </router-link>
        </li>
        <li class="sidebar-logout-item">
          <a href="#" @click.prevent="handleLogout">
            <i class="fas fa-sign-out-alt sidebar-icon"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>

  <div class="sidebar-overlay" v-if="isMobile && isOpen" @click="closeSidebar"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from '@/stores/orders';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminSidebar',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const authStore = useAuthStore();
    const orderStore = useOrderStore();
    const router = useRouter();

    const isOpen = ref(props.modelValue);
    const isMobile = ref(window.innerWidth < 768);

    watch(() => props.modelValue, (newVal) => {
      isOpen.value = newVal;
      if (isMobile.value) {
        document.body.style.overflow = newVal ? 'hidden' : '';
      }
    });

    watch(isOpen, (newVal) => {
      emit('update:modelValue', newVal);
    });

    const toggleSidebar = () => {
      isOpen.value = !isOpen.value;
      if (isMobile.value) {
        document.body.style.overflow = isOpen.value ? 'hidden' : '';
      }
    };

    const closeSidebar = () => {
      isOpen.value = false;
      if (isMobile.value) {
        document.body.style.overflow = '';
      }
    };

    const handleLogout = () => {
      authStore.logout();
      router.push('/auth');
      closeSidebar();
    };

    const handleResize = () => {
      const wasMobile = isMobile.value;
      isMobile.value = window.innerWidth < 768;
      if (wasMobile && !isMobile.value && isOpen.value) {
        isOpen.value = true;
        document.body.style.overflow = '';
      }
      if (!wasMobile && isMobile.value && isOpen.value) {
        document.body.style.overflow = 'hidden';
      }
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      if (isMobile.value && isOpen.value) {
        document.body.style.overflow = 'hidden';
      }
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    });

    return {
      authStore,
      orderStore,
      isOpen,
      isMobile,
      toggleSidebar,
      closeSidebar,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.admin-sidebar {
  width: 280px;
  background-color: #ffffff;
  color: #333;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 70px;
  box-shadow: 3px 0 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #d32f2f;
  z-index: 901;
}

.sidebar-logo {
  text-decoration: none;
  color: #ffffff;
  font-size: 1.4em;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.admin-logo-img {
  height: 35px;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-family: 'Roboto', sans-serif;
  font-size: 1.4em;
  color: #ffffff;
  font-weight: 500;
  display: none;
}

.logo-text.is-mobile {
  display: block;
}

.close-sidebar-btn {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.8em;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-sidebar-btn:hover {
  opacity: 1;
}

.sidebar-nav {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav ul li {
  margin-bottom: 5px;
}

.sidebar-nav ul li a {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 25px;
  color: #555;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  font-size: 0.95em;
  border-left: 4px solid transparent;
}

.sidebar-icon {
  font-size: 1.1em;
  width: 25px;
  text-align: center;
  color: #777;
}

.sidebar-nav ul li a:hover {
  background-color: #f8f8f8;
  color: #d32f2f;
}

.sidebar-nav ul li a:hover .sidebar-icon {
  color: #d32f2f;
}

.sidebar-nav ul li a.active {
  background-color: #fef2f2;
  color: #d32f2f;
  border-left-color: #d32f2f;
  font-weight: 500;
}

.sidebar-nav ul li a.active .sidebar-icon {
  color: #d32f2f;
}

.badge {
  background-color: #d32f2f;
  color: white;
  border-radius: 10px;
  padding: 3px 8px;
  font-size: 0.7em;
  font-weight: bold;
  margin-left: auto;
  min-width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-logout-item {
  margin-top: 20px;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.sidebar-logout-item a {
  color: #777;
}

.sidebar-logout-item a:hover {
  color: #d32f2f;
}

/* Overlay untuk mobile */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9990;
  backdrop-filter: blur(2px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 280px;
    transform: translateX(-100%);
    padding-top: 0;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
  }

  .admin-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-header {
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: none;
  }

  .admin-logo-img {
    display: none;
  }

  .logo-text.is-mobile {
    display: block;
    font-size: 1.3em;
  }

  .close-sidebar-btn {
    display: block;
  }

  .sidebar-overlay {
    display: block;
  }
}
</style>