// src/stores/orders.js
import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Sesuaikan dengan port json-server Anda

export const useOrderStore = defineStore('orders', {
  state: () => ({
    allOrders: [], // Array untuk menyimpan semua pesanan yang di-fetch
    isLoading: false, // Status loading data pesanan
    error: null,      // Pesan error jika gagal memuat data
  }),

  getters: {
    // Getter untuk mendapatkan semua pesanan
    getAllOrders: (state) => state.allOrders,

    // Getter untuk mendapatkan pesanan berdasarkan status tertentu
    getOrdersByStatus: (state) => (status) => {
      if (!status || status.toLowerCase() === 'all') {
        return state.allOrders;
      }
      return state.allOrders.filter(order => order.status.toLowerCase() === status.toLowerCase());
    },

    // Getter untuk mendapatkan jumlah pesanan dengan status 'baru' (penting untuk notifikasi admin/karyawan)
    pendingOrdersCount: (state) => {
      return state.allOrders.filter(order => order.status.toLowerCase() === 'baru').length;
    },

    // Getter untuk mendapatkan pesanan berdasarkan userId (untuk halaman status pesanan user)
    getOrdersForUser: (state) => (userId) => {
      return state.allOrders.filter(order => order.userId === userId);
    },
  },

  actions: {
    /**
     * Mengambil semua pesanan dari API.
     * Data akan disimpan di state 'allOrders'.
     */
    async fetchAllOrders() {
      if (this.isLoading && this.allOrders.length > 0) return; // Mencegah multiple fetches jika sudah ada data

      this.isLoading = true;
      this.error = null; // Reset error
      try {
        const response = await axios.get(`${API_BASE_URL}/orders`);
        this.allOrders = response.data;
      } catch (error) {
        console.error('Error fetching all orders:', error);
        this.error = 'Gagal memuat pesanan. Silakan coba lagi nanti.';
        throw error; // Lempar error agar komponen yang memanggil juga tahu ada masalah
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Membuat pesanan baru dan menambahkannya ke state.
     * @param {Object} newOrderData - Data pesanan baru.
     */
    async createOrder(newOrderData) {
      this.isLoading = true; // Bisa pakai loading terpisah untuk operasi CRUD
      this.error = null;
      try {
        const response = await axios.post(`${API_BASE_URL}/orders`, newOrderData);
        // Tambahkan pesanan baru ke state lokal setelah berhasil di API
        this.allOrders.push(response.data);
        return response.data; // Kembalikan pesanan yang baru dibuat (termasuk ID dari json-server)
      } catch (error) {
        console.error('Error creating order:', error);
        this.error = 'Gagal membuat pesanan. Silakan coba lagi.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Memperbarui pesanan yang sudah ada.
     * @param {number} id - ID pesanan yang akan diperbarui.
     * @param {Object} updatedOrderData - Data pesanan yang diperbarui (misal: { status: 'diproses' }).
     */
    async updateOrder(id, updatedOrderData) {
      this.isLoading = true;
      this.error = null;
      try {
        // Gunakan PATCH jika hanya memperbarui sebagian properti
        const response = await axios.patch(`${API_BASE_URL}/orders/${id}`, updatedOrderData);
        
        // Perbarui pesanan di state lokal
        const index = this.allOrders.findIndex(order => order.id === id);
        if (index !== -1) {
          // Gabungkan data lama dengan data yang diperbarui dari respons API
          this.allOrders[index] = { ...this.allOrders[index], ...response.data };
        }
        return response.data;
      } catch (error) {
        console.error(`Error updating order with ID ${id}:`, error);
        this.error = 'Gagal memperbarui pesanan. Silakan coba lagi.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Menghapus pesanan.
     * @param {number} id - ID pesanan yang akan dihapus.
     */
    async deleteOrder(id) {
      this.isLoading = true;
      this.error = null;
      try {
        await axios.delete(`${API_BASE_URL}/orders/${id}`);
        // Hapus pesanan dari state lokal
        this.allOrders = this.allOrders.filter(order => order.id !== id);
      } catch (error) {
        console.error(`Error deleting order with ID ${id}:`, error);
        this.error = 'Gagal menghapus pesanan. Silakan coba lagi.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Menginisialisasi store pesanan saat aplikasi dimulai.
     * Memanggil fetchAllOrders untuk memuat data awal.
     */
    async initializeOrderStore() {
        // Hanya panggil fetch jika belum ada data dan tidak sedang loading
        if (this.allOrders.length === 0 && !this.isLoading) {
            await this.fetchAllOrders();
        }
    }
  },
});