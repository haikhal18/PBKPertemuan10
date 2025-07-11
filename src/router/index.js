import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// --- Import Semua Komponen View ---
// Customer Views
import HomeView from '../views/HomeView.vue';
import FoodsView from '../views/FoodsView.vue';
import CartView from '../views/CartView.vue';
import AboutView from '../views/AboutView.vue';

// Admin Views
import AdminFoodsView from '../views/AdminFoodsView.vue'; // <-- Pastikan baris ini ada
import EditFoodView from '../views/EditFoodView.vue';

// Auth Views
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

// Fallback View
import NotFoundView from '../views/NotFoundView.vue';

// --- Definisi Rute ---
const routes = [
  // ... Rute Pelanggan ...
  { path: '/', name: 'home', component: HomeView },
  { path: '/foods', name: 'foods', component: FoodsView },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/about', name: 'about', component: AboutView },

  // ... Rute Admin (CRUD) ...
  {
    path: '/admin/foods',
    name: 'admin-foods',
    component: AdminFoodsView, // Variabel ini sekarang sudah dikenali
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/foods/edit/:id',
    name: 'edit-food',
    component: EditFoodView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // ... Rute Otentikasi ...
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },

  // ... Rute Fallback 404 ...
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

// ... Navigation Guard ...
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;
  const isAdmin = authStore.isAdmin;

  if (to.meta.requiresAdmin && !isAdmin) {
    alert('Akses Ditolak! Anda bukan admin.');
    next({ name: 'home' });
  } else if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;