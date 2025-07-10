// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
// Tidak perlu mengimpor router di sini, navigasi akan dilakukan di komponen yang memanggil aksi.

const API_BASE_URL = 'http://localhost:3000'; // Sesuaikan dengan port json-server Anda

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Coba muat user dan token dari localStorage saat aplikasi dimulai
    // Ini membantu menjaga sesi login setelah refresh halaman
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'), // Cek apakah ada token
  }),

  getters: {
    // Getter untuk mengecek apakah user adalah admin
    isAdmin: (state) => state.user?.role === 'admin',
    // Getter untuk mengecek apakah user adalah karyawan
    isKaryawan: (state) => state.user?.role === 'karyawan',
    // Getter untuk mengecek apakah user adalah pelanggan biasa
    isUser: (state) => state.user?.role === 'user',
  },

  actions: {
    /**
     * Metode untuk melakukan proses login.
     * @param {string} username - Username pengguna.
     * @param {string} password - Password pengguna.
     */
    async login(username, password) {
      try {
        // Untuk json-server, kita simulasikan login dengan mencari user yang cocok
        // Dalam aplikasi nyata, ini akan menjadi endpoint POST /login yang diverifikasi oleh backend
        const response = await axios.get(`${API_BASE_URL}/users?username=${username}&password=${password}`);

        if (response.data.length > 0) {
          const user = response.data[0]; // Ambil user pertama yang cocok
          // Simpan informasi user dan token (simulasi)
          this.user = user;
          this.token = `fake-jwt-token-${user.id}-${user.role}`; // Token simulasi
          this.isAuthenticated = true;

          // Simpan ke localStorage agar sesi tetap ada setelah refresh
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', this.token);

          // Kembalikan objek user untuk digunakan di komponen
          return user;
        } else {
          // Jika tidak ada user yang cocok
          throw new Error('Username atau password salah.');
        }
      } catch (error) {
        console.error('Login failed:', error);
        // Lempar error agar bisa ditangkap dan ditampilkan di komponen
        throw error;
      }
    },

    /**
     * Metode untuk melakukan proses logout.
     * Menghapus semua data sesi.
     */
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      // Hapus dari localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Navigasi setelah logout biasanya dilakukan di komponen yang memanggil aksi ini
    },

    /**
     * Metode untuk memuat ulang user dari localStorage (misal saat inisialisasi aplikasi).
     * Penting untuk menjaga sesi login setelah refresh halaman.
     */
    initializeAuth() {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
        this.isAuthenticated = true;
      } else {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
      }
    }
  },
});