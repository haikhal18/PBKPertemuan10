// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Impor Pinia auth store

// --- Import Layouts ---
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import StaffLayout from '@/layouts/StaffLayout.vue';

// --- Import Public Views ---
// Pastikan path sesuai dengan struktur Anda (src/views/public)
import HomeView from '@/views/public/HomeView.vue';
import MenuView from '@/views/public/MenuView.vue';
import CartView from '@/views/public/CartView.vue';
import CheckoutView from '@/views/public/CheckoutView.vue';
import OrderStatusView from '@/views/public/OrderStatusView.vue';
import GalleryView from '@/views/public/GalleryView.vue';
import AboutView from '@/views/public/AboutView.vue';
import ContactView from '@/views/public/ContactView.vue';
import AuthView from '@/views/public/AuthView.vue';
import NotFoundView from '@/views/public/NotFoundView.vue'; // Halaman 404

// --- Define Routes ---
const routes = [
  // Rute Publik (menggunakan DefaultLayout)
  {
    path: '/',
    component: DefaultLayout, // Semua child route ini akan menggunakan DefaultLayout
    children: [
      {
        path: '', // Rute untuk '/'
        name: 'Home',
        component: HomeView,
      },
      {
        path: 'menu',
        name: 'Menu',
        component: MenuView,
      },
      {
        path: 'cart',
        name: 'Cart',
        component: CartView,
        // Keranjang bisa diakses user yang login
        meta: { requiresAuth: true, allowedRoles: ['user', 'admin', 'karyawan'] },
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: CheckoutView,
        // Checkout hanya bisa diakses user yang login
        meta: { requiresAuth: true, allowedRoles: ['user', 'admin', 'karyawan'] },
      },
      {
        path: 'my-orders',
        name: 'MyOrders',
        component: OrderStatusView,
        // Status pesanan hanya untuk user yang login
        meta: { requiresAuth: true, allowedRoles: ['user'] },
      },
      {
        path: 'gallery',
        name: 'Gallery',
        component: GalleryView,
      },
      {
        path: 'about',
        name: 'About',
        component: AboutView,
      },
      {
        path: 'contact',
        name: 'Contact',
        component: ContactView,
      },
      // Tambahkan rute publik lainnya di sini jika ada
    ],
  },

  // Rute Otentikasi (AuthView, tidak menggunakan DefaultLayout penuh)
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: {
      // Jika user sudah login, tidak perlu ke halaman auth lagi
      // Bisa redirect ke home atau dashboard sesuai role
      redirectIfLoggedIn: true,
    },
  },

  // Rute Admin (menggunakan AdminLayout)
  {
    path: '/admin',
    component: AdminLayout, // Semua child route ini akan menggunakan AdminLayout
    // Meta field untuk proteksi rute: hanya admin yang bisa akses
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
    children: [
      {
        path: '', // Rute untuk '/admin'
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'), // Lazy load
      },
      {
        path: 'menu-management',
        name: 'AdminMenuManagement',
        component: () => import('@/views/admin/AdminMenuManagement.vue'), // Lazy load
      },
      {
        path: 'user-management',
        name: 'AdminUserManagement',
        component: () => import('@/views/admin/AdminUserManagement.vue'), // Lazy load
      },
      {
        path: 'order-management',
        name: 'AdminOrderManagement',
        component: () => import('@/views/admin/AdminOrderManagement.vue'), // Lazy load
      },
      {
        path: 'reservation-management',
        name: 'AdminReservationManagement',
        component: () => import('@/views/admin/AdminReservationManagement.vue'), // Lazy load
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('@/views/admin/AdminReports.vue'), // Lazy load
      },
      {
        path: 'settings', // Contoh halaman pengaturan admin
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettings.vue'), // Pastikan Anda membuat komponen ini
      },
    ],
  },

  // Rute Karyawan (menggunakan StaffLayout)
  {
    path: '/staff',
    component: StaffLayout, // Semua child route ini akan menggunakan StaffLayout
    // Meta field untuk proteksi rute: karyawan dan admin bisa akses
    meta: { requiresAuth: true, allowedRoles: ['karyawan', 'admin'] },
    children: [
      {
        path: '', // Rute untuk '/staff'
        name: 'StaffDashboard',
        component: () => import('@/views/staff/StaffDashboard.vue'), // Lazy load
      },
      {
        path: 'order-management',
        name: 'StaffOrderManagement',
        component: () => import('@/views/staff/StaffOrderManagement.vue'), // Lazy load
      },
      {
        path: 'menu-view', // Karyawan hanya melihat menu, tidak mengelola
        name: 'StaffMenuView',
        component: () => import('@/views/public/MenuView.vue'), // Bisa pakai komponen Menu yang sama
      },
      {
        path: 'table-management', // Path untuk manajemen meja
        name: 'StaffTableManagement',
        component: () => import('@/views/staff/StaffTableManagement.vue'),
      },
      // Tambahkan rute karyawan lainnya di sini jika ada
    ],
  },

  // Catch-all 404 Not Found
  {
    path: '/:pathMatch(.*)*', // Ini harus diletakkan paling akhir
    name: 'NotFound',
    component: NotFoundView,
  },
];

// --- Create Router Instance ---
const router = createRouter({
  history: createWebHistory(), // Menggunakan history mode untuk URL yang bersih
  routes,
  // Opsi scroll behavior (opsional, untuk mengontrol posisi scroll saat navigasi)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' }; // Scroll ke atas setiap kali navigasi
    }
  },
});

// --- Navigation Guards ---
// Ini adalah bagian KRUSIAL untuk otentikasi dan otorisasi
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Ambil instance store auth

  const requiresAuth = to.meta.requiresAuth; // Cek apakah rute butuh autentikasi
  const allowedRoles = to.meta.allowedRoles; // Cek role yang diizinkan

  // 1. Cek apakah user sudah login tapi mencoba akses halaman Auth
  if (to.meta.redirectIfLoggedIn && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next({ name: 'AdminDashboard' }); // Redirect ke dashboard admin
    } else if (authStore.isKaryawan) {
      next({ name: 'StaffDashboard' }); // Redirect ke dashboard karyawan
    } else {
      next({ name: 'Home' }); // Redirect ke beranda user
    }
    return; // Hentikan proses navigasi
  }

  // 2. Cek apakah rute memerlukan autentikasi
  if (requiresAuth && !authStore.isAuthenticated) {
    // Jika butuh login tapi belum login, redirect ke halaman login
    alert('Anda perlu login untuk mengakses halaman ini.');
    next({ name: 'Auth' });
    return; // Hentikan proses navigasi
  }

  // 3. Cek otorisasi berdasarkan role
  if (requiresAuth && authStore.isAuthenticated && allowedRoles) {
    // Jika butuh login, sudah login, dan ada allowedRoles, cek apakah role user diizinkan
    if (!allowedRoles.includes(authStore.user?.role)) {
      // Jika role tidak diizinkan
      alert('Anda tidak memiliki izin untuk mengakses halaman ini.');
      // Redirect ke halaman yang sesuai dengan role atau halaman utama
      if (authStore.isAdmin) {
        next({ name: 'AdminDashboard' });
      } else if (authStore.isKaryawan) {
        next({ name: 'StaffDashboard' });
      } else {
        next({ name: 'Home' });
      }
      return; // Hentikan proses navigasi
    }
  }

  // Jika semua cek berhasil, lanjutkan navigasi
  next();
});

export default router;