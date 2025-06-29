// src/stores/authStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { id, name, email, role }
    loading: false,
    error: null
  }),

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`)
        if (res.data.length === 1) {
          const userData = res.data[0]
          // Handle role conversion from penjual to karyawan
          if (userData.role === 'penjual') {
            userData.role = 'karyawan'
          }
          this.user = userData
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
          this.error = 'Email atau password salah.'
        }
      } catch (err) {
        this.error = 'Terjadi kesalahan saat login.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
    },

    autoLogin() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        // Handle role conversion from penjual to karyawan
        if (userData.role === 'penjual') {
          userData.role = 'karyawan'
        }
        this.user = userData
      }
    },

    loadUserFromStorage() {
      this.autoLogin()
    },

    setUser(userData) {
      // Handle role conversion from penjual to karyawan
      if (userData.role === 'penjual') {
        userData.role = 'karyawan'
      }
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isKaryawan: (state) => state.user?.role === 'karyawan',
    isUser: (state) => state.user?.role === 'user',
    // Backward compatibility
    isPenjual: (state) => state.user?.role === 'karyawan'
  }
})