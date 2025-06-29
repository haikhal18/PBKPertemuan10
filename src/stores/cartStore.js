// src/stores/cartStore.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.qty, 0),

    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  },

  actions: {
    loadFromStorage() {
      try {
        const stored = localStorage.getItem('cart')
        if (stored) {
          this.items = JSON.parse(stored)
        }
      } catch (err) {
        console.error('Gagal memuat keranjang dari localStorage:', err)
        this.items = []
      }
    },

    saveToStorage() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.items))
      } catch (err) {
        console.error('Gagal menyimpan keranjang ke localStorage:', err)
      }
    },

    addItem(menuItem) {
      const existing = this.items.find(i => i.id === menuItem.id)
      if (existing) {
        existing.qty += 1
      } else {
        this.items.push({
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          qty: 1,
          restaurantId: menuItem.restaurantId
        })
      }
      this.saveToStorage()
    },

    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveToStorage()
    },

    increaseQty(id) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        item.qty++
        this.saveToStorage()
      }
    },

    decreaseQty(id) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        if (item.qty > 1) {
          item.qty--
        } else {
          this.removeItem(id)
          return
        }
        this.saveToStorage()
      }
    },

    clearCart() {
      this.items = []
      localStorage.removeItem('cart')
    }
  }
})
