// src/stores/restaurantStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurants: [],
    selectedRestaurant: null,
  }),

  actions: {
    async fetchAll() {
      try {
        const res = await axios.get('http://localhost:3000/restaurants')
        this.restaurants = res.data
      } catch (err) {
        console.error('Gagal mengambil restoran:', err)
      }
    },

    async fetchVerified() {
      try {
        const res = await axios.get('http://localhost:3000/restaurants?verified=true')
        this.restaurants = res.data
      } catch (err) {
        console.error('Gagal mengambil restoran terverifikasi:', err)
      }
    },

    async fetchByOwner(ownerId) {
      try {
        const res = await axios.get(`http://localhost:3000/restaurants?ownerId=${ownerId}`)
        this.restaurants = res.data
      } catch (err) {
        console.error('Gagal mengambil restoran milik penjual:', err)
      }
    },

    async fetchById(id) {
      try {
        const res = await axios.get(`http://localhost:3000/restaurants/${id}`)
        this.selectedRestaurant = res.data
      } catch (err) {
        console.error('Gagal mengambil detail restoran:', err)
      }
    },

    async addRestaurant(data) {
      try {
        await axios.post('http://localhost:3000/restaurants', data)
        await this.fetchAll()
      } catch (err) {
        console.error('Gagal menambahkan restoran:', err)
      }
    },

    async verifyRestaurant(id, verified) {
      try {
        await axios.patch(`http://localhost:3000/restaurants/${id}`, {
          verified
        })
        await this.fetchAll()
      } catch (err) {
        console.error('Gagal memverifikasi restoran:', err)
      }
    },

    async deleteRestaurant(id) {
      try {
        await axios.delete(`http://localhost:3000/restaurants/${id}`)
        this.restaurants = this.restaurants.filter(r => r.id !== id)
      } catch (err) {
        console.error('Gagal menghapus restoran:', err)
      }
    }
  }
})
