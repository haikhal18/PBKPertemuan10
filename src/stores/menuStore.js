// src/stores/menuStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [],
    selectedMenu: null,
  }),

  actions: {
    async fetchByRestaurant(restaurantId) {
      try {
        const res = await axios.get(`http://localhost:3000/menus?restaurantId=${restaurantId}`)
        this.menus = res.data
      } catch (err) {
        console.error('Gagal mengambil menu:', err)
      }
    },

    async fetchById(id) {
      try {
        const res = await axios.get(`http://localhost:3000/menus/${id}`)
        this.selectedMenu = res.data
      } catch (err) {
        console.error('Gagal mengambil detail menu:', err)
      }
    },

    async addMenu(data) {
      try {
        await axios.post('http://localhost:3000/menus', data)
        await this.fetchByRestaurant(data.restaurantId)
      } catch (err) {
        console.error('Gagal menambahkan menu:', err)
      }
    },

    async deleteMenu(id, restaurantId) {
      try {
        await axios.delete(`http://localhost:3000/menus/${id}`)
        await this.fetchByRestaurant(restaurantId)
      } catch (err) {
        console.error('Gagal menghapus menu:', err)
      }
    },

    async updateStock(menuId, newStock) {
      try {
        await axios.patch(`http://localhost:3000/menus/${menuId}`, {
          stock: newStock
        })
        const menuIndex = this.menus.findIndex(m => m.id === menuId)
        if (menuIndex !== -1) {
          this.menus[menuIndex].stock = newStock
        }
      } catch (err) {
        console.error('Gagal memperbarui stok menu:', err)
      }
    }
  }
})
