// src/stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // Inisialisasi keranjang dari localStorage untuk menjaga item setelah refresh
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    // Struktur setiap item di array 'items' diharapkan:
    // { menuId: number, name: string, price: number, quantity: number, imageUrl?: string }
  }),

  getters: {
    // Menghitung total jumlah item unik di keranjang
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    // Menghitung total harga semua item di keranjang
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),

    // Getter untuk mendapatkan item berdasarkan ID (berguna untuk validasi/cek keberadaan)
    getItemById: (state) => (menuId) => {
      return state.items.find(item => item.menuId === menuId);
    }
  },

  actions: {
    /**
     * Menambahkan item menu ke keranjang. Jika item sudah ada, kuantitasnya akan bertambah.
     * @param {Object} menuItem - Objek item menu dari database/API (misal: {id, name, price, imageUrl}).
     */
    addItem(menuItem) {
      const existingItem = this.items.find(item => item.menuId === menuItem.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          menuId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          imageUrl: menuItem.imageUrl // Simpan juga URL gambar jika perlu ditampilkan di keranjang
        });
      }
      this.saveCartToLocalStorage();
    },

    /**
     * Menghapus item dari keranjang berdasarkan menuId.
     * @param {number} menuId - ID dari item menu yang akan dihapus.
     */
    removeItem(menuId) {
      this.items = this.items.filter(item => item.menuId !== menuId);
      this.saveCartToLocalStorage();
    },

    /**
     * Memperbarui kuantitas item di keranjang. Jika kuantitas <= 0, item akan dihapus.
     * @param {number} menuId - ID dari item menu.
     * @param {number} newQuantity - Kuantitas baru.
     */
    updateItemQuantity(menuId, newQuantity) {
      const item = this.items.find(i => i.menuId === menuId);
      if (item) {
        if (newQuantity <= 0) {
          this.removeItem(menuId); // Hapus jika kuantitas jadi 0 atau kurang
        } else {
          item.quantity = newQuantity;
          this.saveCartToLocalStorage();
        }
      }
    },

    /**
     * Mengosongkan seluruh isi keranjang belanja.
     */
    clearCart() {
      this.items = [];
      this.saveCartToLocalStorage();
    },

    /**
     * Menyimpan state keranjang ke localStorage.
     * Ini dipanggil secara otomatis setelah setiap perubahan pada keranjang.
     */
    saveCartToLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    },

    /**
     * Menginisialisasi keranjang dari localStorage saat aplikasi dimulai.
     * Ini dipanggil satu kali di main.js.
     */
    initializeCart() {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        this.items = JSON.parse(storedItems);
      }
    }
  },
});