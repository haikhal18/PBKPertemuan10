<template>
  <div class="restaurants-page">
    <div class="hero-section">
      <h1>Temukan Restoran Terdekat</h1>
      <p>Nikmati pengalaman kuliner terbaik di berbagai lokasi kami</p>
      <div class="search-box">
        <input 
          type="text" 
          placeholder="Cari berdasarkan lokasi..." 
          v-model="searchQuery"
          @input="filterRestaurants"
        >
        <button class="search-btn">🔍</button>
      </div>
    </div>

    <div class="container">
      <div class="location-filters">
        <button 
          v-for="location in uniqueLocations" 
          :key="location"
          @click="filterByLocation(location)"
          :class="{ active: activeLocation === location }"
        >
          {{ location }}
        </button>
        <button @click="clearFilters" class="clear-btn">
          Tampilkan Semua
        </button>
      </div>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Memuat restoran...</p>
      </div>

      <div v-else>
        <div v-if="filteredRestaurants.length === 0" class="empty-state">
          <img src="@/assets/no-restaurants.svg" alt="No restaurants">
          <h3>Tidak ada restoran ditemukan</h3>
          <p v-if="activeLocation">Coba cari di lokasi lain</p>
          <button v-if="isStaff" @click="addNewRestaurant" class="primary-btn">
            + Tambah Restoran Baru
          </button>
        </div>

        <div class="restaurants-grid">
          <div 
            v-for="restaurant in filteredRestaurants"
            :key="restaurant.id"
            class="restaurant-card"
            :style="{ '--rating-color': getRatingColor(restaurant.rating) }"
          >
            <div class="card-badge" v-if="restaurant.isNew">BARU</div>
            <div class="rating-badge">
              ⭐ {{ restaurant.rating || '4.5' }}
            </div>
            
            <RouterLink :to="`/restoran/${restaurant.id}`" class="card-link">
              <div class="card-image">
                <img :src="restaurant.image" :alt="restaurant.name">
                <div class="location-tag">
                  📍 {{ restaurant.address.split(',')[0] }}
                </div>
              </div>
              
              <div class="card-content">
                <h3>{{ restaurant.name }}</h3>
                <p class="cuisine-type">{{ restaurant.cuisine || 'Masakan Indonesia' }}</p>
                
                <div class="features">
                  <span v-if="restaurant.isOpen" class="open-now">BUKA SEKARANG</span>
                  <div class="delivery-info">
                    <span>🛵 {{ restaurant.deliveryTime || '30-45 menit' }}</span>
                    <span>•</span>
                    <span>💲{{ restaurant.priceRange || 'Rp20.000-50.000' }}</span>
                  </div>
                </div>
              </div>
            </RouterLink>

            <div v-if="isStaff" class="admin-actions">
              <button @click.stop="editRestaurant(restaurant.id)" class="action-btn edit">
                <span>✏️ Edit</span>
              </button>
              <button @click.stop="deleteRestaurant(restaurant.id)" class="action-btn delete">
                <span>🗑️ Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export default {
  name: "RestaurantsList",
  setup() {
    const loading = ref(true)
    const restaurants = ref([])
    const filteredRestaurants = ref([])
    const searchQuery = ref('')
    const activeLocation = ref(null)
    const router = useRouter()

    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    const isStaff = computed(() => {
      return ['admin', 'karyawan'].includes(user.value?.role)
    })

    const uniqueLocations = computed(() => {
      const locations = new Set()
      restaurants.value.forEach(r => {
        if (r.address) {
          const area = r.address.split(',')[1]?.trim() || r.address
          locations.add(area)
        }
      })
      return Array.from(locations).slice(0, 5) // Limit to 5 locations
    })

    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:3000/restaurants')
        // Add some sample data for demo
        restaurants.value = res.data.map(r => ({
          ...r,
          isOpen: Math.random() > 0.3,
          isNew: Math.random() > 0.7,
          rating: (Math.random() * 1 + 4).toFixed(1)
        }))
        filteredRestaurants.value = [...restaurants.value]
      } catch (error) {
        console.error('Gagal memuat restoran:', error)
      } finally {
        loading.value = false
      }
    }

    const filterRestaurants = () => {
      if (!searchQuery.value) {
        filteredRestaurants.value = [...restaurants.value]
        return
      }
      
      filteredRestaurants.value = restaurants.value.filter(`r => 
        r.name.toLowerCase().includes(searchQuery.value.toLowerCase()`) ||
        r.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    }

    const filterByLocation = (location) => {
      activeLocation.value = location
      filteredRestaurants.value = restaurants.value.filter(r => 
        r.address.includes(location))
    }

    const clearFilters = () => {
      activeLocation.value = null
      searchQuery.value = ''
      filteredRestaurants.value = [...restaurants.value]
    }

    const getRatingColor = (rating) => {
      const num = parseFloat(rating)
      if (num >= 4.5) return '#2ecc71'
      if (num >= 4.0) return '#f39c12'
      return '#e74c3c'
    }

    const deleteRestaurant = async (id) => {
      if (confirm('Yakin ingin menghapus restoran ini?')) {
        try {
          await axios.delete(`http://localhost:3000/restaurants/${id}`)
          restaurants.value = restaurants.value.filter(r => r.id !== id)
          filteredRestaurants.value = filteredRestaurants.value.filter(r => r.id !== id)
        } catch (error) {
          alert('Gagal menghapus restoran')
          console.error(error)
        }
      }
    }

    const editRestaurant = (id) => {
      router.push(`/edit-restoran/${id}`)
    }

    const addNewRestaurant = () => {
      router.push('/tambah-restoran')
    }

    onMounted(fetchRestaurants)

    return {
      loading,
      restaurants,
      filteredRestaurants,
      searchQuery,
      activeLocation,
      uniqueLocations,
      user,
      isStaff,
      filterRestaurants,
      filterByLocation,
      clearFilters,
      getRatingColor,
      deleteRestaurant,
      editRestaurant,
      addNewRestaurant
    }
  }
}
</script>

<style scoped>
.restaurants-page {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
              url('@/assets/restaurant-hero.jpg') center/cover;
  color: white;
  padding: 5rem 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-box input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-btn {
  background: #ff7f1f;
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #e6731c;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

.location-filters {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.location-filters button {
  background: white;
  border: 1px solid #ddd;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.location-filters button:hover {
  background: #f0f0f0;
}

.location-filters button.active {
  background: #ff7f1f;
  color: white;
  border-color: #ff7f1f;
}

.clear-btn {
  background: transparent;
  color: #ff7f1f;
  border: 1px solid #ff7f1f;
}

.loading-spinner {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #ff7f1f;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-state img {
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

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.restaurant-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff7f1f;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 2;
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--rating-color);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 2;
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.restaurant-card:hover .card-image img {
  transform: scale(1.05);
}

.location-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.card-content {
  padding: 1.2rem;
}

.card-content h3 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.2rem;
}

.cuisine-type {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.open-now {
  background: #2ecc71;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  align-self: flex-start;
}

.delivery-info {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
}

.admin-actions {
  display: flex;
  border-top: 1px solid #eee;
  padding: 0.8rem;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit {
  background: #e3f2fd;
  color: #1976d2;
}

.action-btn.edit:hover {
  background: #bbdefb;
}

.action-btn.delete {
  background: #ffebee;
  color: #d32f2f;
}

.action-btn.delete:hover {
  background: #ffcdd2;
}

.primary-btn {
  background: #ff7f1f;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.primary-btn:hover {
  background: #e6731c;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .restaurants-grid {
    grid-template-columns: 1fr;
  }
}
</style>