import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import router from '../router';
import { useCartStore } from './cart'; // 1. Impor cart store

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')));

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(credentials) {
    // 2. Inisialisasi cart store di dalam action
    const cartStore = useCartStore();

    try {
      const response = await axios.get(`http://localhost:3000/users?email=${credentials.email}&password=${credentials.password}`);
      
      if (response.data.length > 0) {
        const loggedInUser = response.data[0];
        user.value = loggedInUser;
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        
        // 3. Panggil aksi untuk memuat keranjang milik user ini
        cartStore.loadCartFromLocalStorage(); 
        
        alert('Login berhasil!');
        router.push('/');
      } else {
        alert('Email atau password salah.');
      }
    } catch (error) {
      console.error('Login gagal:', error);
      alert('Terjadi kesalahan saat mencoba login.');
    }
  }

  function logout() {
    // 4. Inisialisasi cart store di dalam action
    const cartStore = useCartStore();

    user.value = null;
    localStorage.removeItem('user');
    
    // 5. Panggil aksi untuk mengosongkan keranjang saat logout
    cartStore.clearCart(); 
    
    alert('Anda telah logout.');
    router.push('/login');
  }

  return { user, isLoggedIn, isAdmin, login, logout };
});