// src/stores/menu.js
import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Sesuaikan dengan port json-server Anda

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [], // Array untuk menyimpan semua item menu
    isLoading: false, // Status loading data menu
    error: null,      // Pesan error jika gagal memuat data
  }),

  getters: {
    // Getter untuk mendapatkan semua item menu
    getAllMenuItems: (state) => state.items,

    // Getter untuk mendapatkan kategori unik dari menu
    getUniqueCategories: (state) => {
      const categories = new Set();
      state.items.forEach(item => {
        if (item.category) {
          categories.add(item.category.toLowerCase()); // Simpan dalam huruf kecil
        }
      });
      return Array.from(categories);
    },

    // Getter untuk mendapatkan item menu berdasarkan kategori
    getMenuItemsByCategory: (state) => (category) => {
      if (!category || category.toLowerCase() === 'all') {
        return state.items;
      }
      return state.items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    },
  },

  actions: {
    /**
     * Mengambil semua item menu dari API.
     * Data akan disimpan di state 'items'.
     */
    async fetchMenuItems() {
      if (this.isLoading) return; // Mencegah multiple fetches
      if (this.items.length > 0) return; // Jika sudah ada data, tidak perlu fetch lagi (caching sederhana)

      this.isLoading = true;
      this.error = null; // Reset error
      try {
        const response = await axios.get(`${API_BASE_URL}/menu`);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching menu items:', error);
        this.error = 'Gagal memuat item menu. Silakan coba lagi nanti.';
        throw error; // Lempar error agar komponen yang memanggil juga tahu ada masalah
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Menambahkan item menu baru.
     * @param {Object} newMenuItemData - Data item menu baru.
     */
    async addMenuItem(newMenuItemData) {
      this.isLoading = true; // Bisa pakai loading terpisah untuk operasi CRUD
      this.error = null;
      try {
        const response = await axios.post(`${API_BASE_URL}/menu`, newMenuItemData);
        // Tambahkan item baru ke state lokal setelah berhasil di API
        this.items.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding menu item:', error);
        this.error = 'Gagal menambahkan menu. Silakan coba lagi.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Memperbarui item menu yang sudah ada.
     * @param {number} id - ID item menu yang akan diperbarui.
     * @param {Object} updatedMenuItemData - Data item menu yang diperbarui.
     */
    async updateMenuItem(id, updatedMenuItemData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE_URL}/menu/${id}`, updatedMenuItemData);
        // Perbarui item di state lokal
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items[index] = response.data; // Ganti item lama dengan yang baru dari respons API
        }
        return response.data;
      } catch (error) {
        console.error(`Error updating menu item with ID ${id}:`, error);
        this.error = 'Gagal memperbarui menu. Silakan coba lagi.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Menghapus item menu.
     * @param {number} id - ID item menu yang akan dihapus.
     */
    async deleteMenuItem(id) {
      this.isLoading = true;
      this.error = null;
      try {
        await axios.delete(`${API_BASE_URL}/menu/${id}`);
        // Hapus item dari state lokal
        this.items = this.items.filter(item => item.id !== id);
      } catch (error) {
        console.error(`Error deleting menu item with ID ${id}:`, error);
        this.error = 'Gagal menghapus menu. Silakan coba lagi.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Menginisialisasi store menu saat aplikasi dimulai.
     * Memanggil fetchMenuItems untuk memuat data awal.
     */
    async initializeMenuStore() {
        // Hanya panggil fetch jika belum ada data
        if (this.items.length === 0 && !this.isLoading) {
            await this.fetchMenuItems();
        }
    }
  },
});