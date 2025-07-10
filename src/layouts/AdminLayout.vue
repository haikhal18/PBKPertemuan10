<template>
  <div class="admin-layout">
    <AdminSidebar
      v-model="isSidebarOpen"
      v-model:collapsed="isSidebarCollapsed"
    />

    <div
      :class="[
        'admin-main-content',
        { 
          'sidebar-pushed': isSidebarOpen && isMobile,
          'sidebar-collapsed': isSidebarCollapsed && !isMobile 
        }
      ]"
    >
      <header class="admin-header">
        <div class="header-left-section">
          <button class="toggle-sidebar-btn" @click="toggleSidebar" v-if="isMobile">
            <i class="fas fa-bars"></i>
          </button>

          <button class="toggle-collapse-btn" @click="toggleCollapse" v-if="!isMobile">
            <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
          </button>

          <h2 class="admin-panel-title">Dashboard Admin</h2>
        </div>

        <div class="user-greeting-wrapper">
          <div class="user-greeting-card">
            Halo, {{ authStore.user?.username || 'Admin' }}!
          </div>
        </div>
      </header>

      <main class="admin-page-content">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <footer class="admin-footer">
        <p>&copy; {{ currentYear }} Nama Restoran - Admin Panel. Semua Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminLayout',
  components: {
    AdminSidebar,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const isSidebarOpen = ref(true);
    const isSidebarCollapsed = ref(false);
    const isMobile = ref(window.innerWidth < 768);

    const currentYear = new Date().getFullYear();

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      if (isMobile.value) {
        document.body.style.overflow = isSidebarOpen.value ? 'hidden' : '';
      }
    };

    const toggleCollapse = () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
    };

    const handleResize = () => {
      const wasMobile = isMobile.value;
      isMobile.value = window.innerWidth < 768;

      if (wasMobile && !isMobile.value) {
        isSidebarOpen.value = true;
        document.body.style.overflow = '';
      } else if (!wasMobile && isMobile.value) {
        isSidebarOpen.value = false;
        document.body.style.overflow = '';
      } else if (isMobile.value && isSidebarOpen.value) {
        document.body.style.overflow = 'hidden';
      }
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      handleResize();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    });

    watch(isSidebarOpen, (newVal) => {
      if (isMobile.value) {
        document.body.style.overflow = newVal ? 'hidden' : '';
      }
    });

    return {
      authStore,
      isSidebarOpen,
      isSidebarCollapsed,
      isMobile,
      currentYear,
      toggleSidebar,
      toggleCollapse,
    };
  },
};
</script>

<style scoped>
:root {
  --sidebar-width-desktop: 250px;
  --sidebar-width-collapsed: 80px;
  --sidebar-width-mobile: 280px;
  --header-height-admin: 70px;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  overflow-x: hidden;
}

.admin-main-content {
  flex-grow: 1;
  margin-left: var(--sidebar-width-desktop);
  transition: margin-left 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.admin-main-content.sidebar-collapsed {
  margin-left: var(--sidebar-width-collapsed);
}

.toggle-sidebar-btn,
.toggle-collapse-btn {
  background: none;
  border: none;
  color: #333;
  font-size: 1.3em;
  margin-right: 15px;
  cursor: pointer;
}

.toggle-sidebar-btn {
  display: none;
}

@media (max-width: 768px) {
  .admin-main-content {
    margin-left: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
    z-index: 1;
  }

  .admin-main-content.sidebar-pushed {
    transform: translateX(var(--sidebar-width-mobile));
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }

  .toggle-sidebar-btn {
    display: block;
  }

  .toggle-collapse-btn {
    display: none;
  }
}

.admin-header {
  background-color: white;
  height: var(--header-height-admin);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.header-left-section {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.admin-panel-title {
  margin: 0;
  font-size: 1.5em;
  color: #333;
  white-space: nowrap;
}

.user-greeting-wrapper {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}

.user-greeting-card {
  background-color: #dc3545;
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.user-greeting-card:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.admin-page-content {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
}

.admin-footer {
  padding: 15px 20px;
  background-color: #e9ecef;
  color: #6c757d;
  text-align: center;
  font-size: 0.85em;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.5s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>