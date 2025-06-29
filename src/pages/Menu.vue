<template>
  <div class="menu-page">
    <h2>Menu Makanan & Minuman</h2>

    <!-- FILTER SECTION -->
    <div class="filters">
      <input type="text" v-model="filters.search" placeholder="Cari menu..." />

      <select v-model="filters.category">
        <option value="">Semua Kategori</option>
        <option value="makanan">Makanan</option>
        <option value="minuman">Minuman</option>
      </select>

      <select v-model="filters.restaurant">
        <option value="">Semua Restoran</option>
        <option v-for="resto in restaurantOptions" :key="resto" :value="resto">{{ resto }}</option>
      </select>

      <div class="price-range">
        <label>
          Harga Min:
          <input type="number" v-model.number="filters.minPrice" />
        </label>
        <label>
          Harga Max:
          <input type="number" v-model.number="filters.maxPrice" />
        </label>
      </div>
    </div>

    <!-- MENU LIST -->
    <div class="menu-list">
      <div class="menu-card" v-for="(item, index) in filteredMenu" :key="index">
        <img :src="item.image" alt="Makanan" />
        <h3>{{ item.name }}</h3>
        <p class="restaurant">Restoran: {{ item.restaurant }}</p>
        <p class="price">Rp {{ item.price.toLocaleString() }}</p>
        <button @click="addToCart(item, index)" class="btn">Tambah ke Keranjang</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Menu',
  data() {
    return {
      menuItems: [],
      filters: {
        search: '',
        category: '',
        restaurant: '',
        minPrice: 0,
        maxPrice: Infinity
      }
    }
  },
  computed: {
    restaurantOptions() {
      const set = new Set(this.menuItems.map(item => item.restaurant))
      return Array.from(set)
    },
    filteredMenu() {
      return this.menuItems.filter(item => {
        const matchName = item.name.toLowerCase().includes(this.filters.search.toLowerCase())
        const matchCategory = !this.filters.category || item.category === this.filters.category
        const matchRestaurant = !this.filters.restaurant || item.restaurant === this.filters.restaurant
        const matchPrice = item.price >= this.filters.minPrice && item.price <= this.filters.maxPrice
        return matchName && matchCategory && matchRestaurant && matchPrice
      })
    }
  },
  methods: {
    async fetchMenuItems() {
      const res = await axios.get('http://localhost:3000/restaurants')
      const items = []
      res.data.forEach(resto => {
        if (resto.verified && resto.menu) {
          resto.menu.forEach(menu => {
            items.push({
              ...menu,
              restaurant: resto.name,
              image: `https://source.unsplash.com/300x200/?${menu.name}` // fallback image
            })
          })
        }
      })
      this.menuItems = items
    },
    addToCart(item, index) {
      const user = JSON.parse(localStorage.getItem("user"))
      if (!user) {
        alert("Silakan login terlebih dahulu.")
        this.$router.push("/login")
        return
      }

      const itemWithId = {
        id: item.name + '-' + index,
        ...item
      }

      const cartStore = useCartStore()
      cartStore.addItem(itemWithId)
      alert(`${item.name} ditambahkan ke keranjang.`)
    }
  },
  mounted() {
    this.fetchMenuItems()
  }
}
</script>

<style scoped>
.menu-page {
  padding: 2rem;
  text-align: center;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.filters input,
.filters select {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.price-range input {
  width: 100px;
}
.menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
.menu-card {
  width: 260px;
  background: #fff7f0;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: left;
}
.menu-card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  object-fit: cover;
  height: 160px;
}
.menu-card h3 {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}
.restaurant {
  font-size: 0.9rem;
  color: #555;
}
.price {
  font-weight: bold;
  margin: 0.5rem 0;
}
.btn {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
.btn:hover {
  background-color: #e5533d;
}
</style>
