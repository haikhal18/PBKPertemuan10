import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Umum
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profil from '@/pages/Profil.vue'

// User Pages
import CariMakanan from '@/pages/user/CariMakanan.vue'
import RestoranDetail from '@/pages/user/RestoranDetail.vue'
import Keranjang from '@/pages/user/Keranjang.vue'
import DaftarRestoran from '@/pages/user/DaftarRestoran.vue'

// Karyawan Pages (renamed from penjual)
import HomeKaryawan from '@/pages/karyawan/HomeKaryawan.vue'
import TambahRestoran from '@/pages/karyawan/TambahRestoran.vue'
import RestoranSaya from '@/pages/karyawan/RestoranSaya.vue'
import TambahMenu from '@/pages/karyawan/TambahMenu.vue'

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard.vue'
import VerifikasiRestoran from '@/pages/admin/VerifikasiRestoran.vue'
import Laporan from '@/pages/admin/Laporan.vue'

const routes = [
  // === PUBLIK ===
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Register', guest: true }
  },
  {
    path: '/profil',
    name: 'Profil',
    component: Profil,
    meta: { title: 'Profil', requiresAuth: true }
  },

  // === USER ===
  {
    path: '/cari',
    name: 'CariMakanan',
    component: CariMakanan,
    meta: { title: 'Cari Makanan' }
  },
  {
    path: '/restoran/:id',
    name: 'RestoranDetail',
    component: RestoranDetail,
    meta: { title: 'Detail Restoran' },
    props: true
  },
  {
    path: '/keranjang',
    name: 'Keranjang',
    component: Keranjang,
    meta: { title: 'Keranjang', requiresAuth: true }
  },
  {
    path: '/restoran',
    name: 'DaftarRestoran',
    component: DaftarRestoran,
    meta: { title: 'Daftar Restoran' }
  },

  // === KARYAWAN === (updated from penjual)
  {
    path: '/karyawan',
    name: 'HomeKaryawan',
    component: HomeKaryawan,
    meta: { 
      title: 'Dashboard Karyawan', 
      requiresAuth: true, 
      role: ['karyawan'] // Backward compatible
    }
  },
  {
    path: '/karyawan/tambah-restoran',
    name: 'TambahRestoran',
    component: TambahRestoran,
    meta: { 
      title: 'Tambah Restoran', 
      requiresAuth: true, 
      role: ['karyawan'] // Backward compatible
    }
  },
  {
    path: '/karyawan/restoran-saya',
    name: 'RestoranSaya',
    component: RestoranSaya,
    meta: { 
      title: 'Restoran Saya', 
      requiresAuth: true, 
      role: ['karyawan', 'penjual'] // Backward compatible
    }
  },
  {
    path: '/karyawan/tambah-menu/:id',
    name: 'TambahMenu',
    component: TambahMenu,
    meta: { 
      title: 'Tambah Menu', 
      requiresAuth: true, 
      role: ['karyawan', 'penjual'] // Backward compatible
    },
    props: true
  },

  // === ADMIN ===
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard Admin', requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/verifikasi',
    name: 'VerifikasiRestoran',
    component: VerifikasiRestoran,
    meta: { title: 'Verifikasi Restoran', requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/laporan',
    name: 'Laporan',
    component: Laporan,
    meta: { title: 'Laporan', requiresAuth: true, role: 'admin' }
  },

  // === BACKWARD COMPATIBILITY REDIRECTS ===
  {
    path: '/penjual',
    redirect: '/karyawan'
  },
  {
    path: '/penjual/tambah-restoran',
    redirect: '/karyawan/tambah-restoran'
  },
  {
    path: '/penjual/restoran-saya',
    redirect: '/karyawan/restoran-saya'
  },
  {
    path: '/penjual/tambah-menu/:id',
    redirect: to => ({ path: `/karyawan/tambah-menu/${to.params.id}` })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.user !== null
  const userRole = authStore.user?.role

  // Set document title
  document.title = to.meta.title ? `${to.meta.title} | FoodOrder` : 'FoodOrder'

  // Check if route requires auth
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Check if route is guest-only
  if (to.meta.guest && isAuthenticated) {
    return next('/')
  }

  // Check role permissions
  if (to.meta.role) {
    const allowedRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    
    // Handle backward compatibility for penjual -> karyawan
    const effectiveRole = userRole === 'penjual' ? 'karyawan' : userRole
    
    if (!allowedRoles.includes(effectiveRole)) {
      return next('/')
    }
  }

  next()
})

export default router