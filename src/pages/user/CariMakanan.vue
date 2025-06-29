<template>
  <div class="food-search-page">
    <!-- Hero Search Section -->
    <div class="search-hero">
      <div class="hero-content">
        <h1>Cari Makanan Favoritmu</h1>
        <p>Temukan berbagai menu lezat dari restoran terbaik</p>
        <div class="search-container">
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama makanan, restoran..."
            class="search-input"
          />
          <button class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="results-container">
      <!-- Empty State -->
      <div v-if="filteredMenus.length === 0" class="empty-state">
        <img src="https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png" 
             alt="No results" 
             class="empty-image">
        <h3>Tidak ada menu yang cocok</h3>
        <p>Coba kata kunci lain atau lihat rekomendasi kami</p>
        <button class="explore-button" @click="search = ''; fetchMenus()">
          Lihat Semua Menu
        </button>
      </div>

      <!-- Menu Grid -->
      <div v-else class="menu-grid">
        <div
          v-for="item in filteredMenus"
          :key="item.id"
          class="menu-card"
          @click="user?.role === 'user' && goToRestaurantDetail(item.restoId)"
        >
          <div class="menu-image">
            <img :src="item.image || 'https://via.placeholder.com/300x200?text=Food+Image'" 
                 :alt="item.name">
            <div class="price-tag">Rp {{ item.price.toLocaleString() }}</div>
          </div>
          <div class="menu-content">
            <h3 class="menu-title">{{ item.name }}</h3>
            <p class="restaurant-name">
              <i class="fas fa-store"></i> {{ item.restaurantName }}
            </p>
            <div class="menu-meta">
              <span class="stock" :class="{ low: item.stock < 10 }">
                <i class="fas fa-box-open"></i> Stok: {{ item.stock }}
              </span>
              <span class="rating">
                <i class="fas fa-star"></i> 4.5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'CariMakanan',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const user = authStore.user
    const search = ref('')
    const menus = ref([])

    const fetchMenus = async () => {
      try {
        const res = await axios.get('http://localhost:3000/restaurants')
        const verifiedResto = res.data.filter(r => r.verified)

        const allMenus = []
        verifiedResto.forEach(resto => {
          if (Array.isArray(resto.menu)) {
            resto.menu.forEach(menu => {
              allMenus.push({
                ...menu,
                restaurantName: resto.name,
                restoId: resto.id,
                image: menu.image || 'https://via.placeholder.com/300x200?text=Food+Image'
              })
            })
          }
        })

        menus.value = allMenus
      } catch (err) {
        console.error('Gagal ambil menu:', err)
      }
    }

    const filteredMenus = computed(() =>
      menus.value.filter(item =>
        item.name.toLowerCase().includes(search.value.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(search.value.toLowerCase())
      )
    )

    const goToRestaurantDetail = (restoId) => {
      router.push(`/restoran/${restoId}`)
    }
    
    onMounted(() => {
      fetchMenus()
    })

    return {
      search,
      filteredMenus,
      goToRestaurantDetail,
      user
    }
  }
}
</script>

<style scoped>
.food-search-page {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.search-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://images.unsplash.com/photo-1504674900247-0877df9cc836') center/cover;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 1rem;
}

.hero-content {
  max-width: 800px;
  width: 100%;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-button {
  background: #ff7f1f;
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.search-button:hover {
  background: #e6731c;
}

.results-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-image {
  max-width: 200px;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.explore-button {
  background: #ff7f1f;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.explore-button:hover {
  background: #e6731c;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.menu-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.menu-image {
  position: relative;
  height: 180px;
}

.menu-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
}

.menu-content {
  padding: 1.2rem;
}

.menu-title {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.restaurant-name {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.menu-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.stock {
  color: #666;
}

.stock.low {
  color: #e74c3c;
}

.rating {
  color: #f39c12;
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-hero {
    height: 250px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .menu-grid {
    grid-template-columns: 1fr;
  }
}
</style>