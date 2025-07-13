import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// --- Import Semua Komponen View ---
// Customer Views
import HomeView from '../views/HomeView.vue';
import FoodsView from '../views/FoodsView.vue';
import CartView from '../views/CartView.vue';
import AboutView from '../views/AboutView.vue';
import CheckoutView from '../views/CheckoutView.vue'; // <-- BARU: Impor CheckoutView

// Admin Views
import AdminFoodsView from '../views/AdminFoodsView.vue';
import EditFoodView from '../views/EditFoodView.vue';

// Auth Views
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

// Fallback View
import NotFoundView from '../views/NotFoundView.vue';

// --- Definisi Rute ---
const routes = [
  // == Rute Sisi Pelanggan ==
  { path: '/', name: 'home', component: HomeView },
  { path: '/foods', name: 'foods', component: FoodsView },
  { path: '/about', name: 'about', component: AboutView },
  { 
    path: '/cart', 
    name: 'cart', 
    component: CartView,
    meta: { requiresAuth: true } // Keranjang hanya untuk user login
  },
  {
    path: '/checkout', // <-- BARU: Rute untuk halaman checkout
    name: 'checkout',
    component: CheckoutView,
    meta: { requiresAuth: true } // Checkout hanya untuk user login
  },

  // == Rute Sisi Admin (CRUD) ==
  {
    path: '/admin/foods',
    name: 'admin-foods',
    component: AdminFoodsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/foods/edit/:id',
    name: 'edit-food',
    component: EditFoodView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // == Rute Otentikasi ==
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { publicOnly: true } // <-- DIPERBARUI: Hanya untuk user yang belum login
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { publicOnly: true } // <-- DIPERBARUI: Hanya untuk user yang belum login
  },

  // == Rute Fallback 404 Not Found ==
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

// --- Navigation Guard yang Disempurnakan ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Jika rute hanya untuk publik (spt login) & user sudah login, arahkan ke home
  if (to.meta.publicOnly && authStore.isLoggedIn) {
    return next({ name: 'home' });
  }
  
  // Jika rute butuh otentikasi & user belum login, arahkan ke login
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login' });
  }

  // Jika rute butuh role admin & user bukan admin, tolak akses
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    alert('Akses Ditolak! Anda bukan admin.');
    return next({ name: 'home' });
  }

  // Jika semua kondisi aman, lanjutkan navigasi
  next();
});

export default router;