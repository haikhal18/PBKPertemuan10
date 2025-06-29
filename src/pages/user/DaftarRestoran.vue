<template>
  <div class="restaurant-discovery-page">
    <!-- Hero Section -->
    <div class="discovery-hero">
      <div class="hero-overlay">
        <h1>Jelajahi Restoran Kami</h1>
        <p>Temukan lokasi dan menu terfavorit di seluruh cabang</p>
      </div>
    </div>

    <!-- Location Highlights -->
    <div class="location-section">
      <h2 class="section-title">
        <i class="fas fa-map-marked-alt"></i> Lokasi Restoran Tersedia
      </h2>
      <div class="location-grid">
        <div 
          v-for="location in uniqueLocations" 
          :key="location" 
          class="location-card"
          @click="focusLocation(location)"
        >
          <div class="location-image">
            <img :src="getLocationImage(location)" :alt="location">
            <div class="location-badge">{{ countRestaurants(location) }} Restoran</div>
          </div>
          <h3>{{ location }}</h3>
          <button class="explore-btn">Jelajahi <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>

    <!-- Popular Menus -->
    <div class="menu-section">
      <h2 class="section-title">
        <i class="fas fa-utensils"></i> Menu Terfavorit
      </h2>
      <div class="menu-carousel">
        <div 
          v-for="(menu, index) in popularMenus" 
          :key="index" 
          class="menu-card"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="menu-image">
            <img :src="menu.image" :alt="menu.name">
            <div class="menu-badge">🔥 {{ menu.popularity }}%</div>
          </div>
          <div class="menu-info">
            <h3>{{ menu.name }}</h3>
            <p class="menu-description">{{ menu.description }}</p>
            <div class="menu-footer">
              <span class="price">Rp{{ menu.price.toLocaleString() }}</span>
              <span class="restaurant">{{ menu.restaurant }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Restaurants -->
    <div class="restaurant-section">
      <h2 class="section-title">
        <i class="fas fa-store"></i> Semua Restoran Kami
      </h2>
      <div class="restaurant-grid">
        <div 
          v-for="restaurant in restaurants" 
          :key="restaurant.id" 
          class="restaurant-card"
        >
          <div class="restaurant-header">
            <img :src="restaurant.image" :alt="restaurant.name">
            <div class="restaurant-tags">
              <span class="tag" v-for="tag in restaurant.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="restaurant-body">
            <h3>{{ restaurant.name }}</h3>
            <p class="location">
              <i class="fas fa-map-marker-alt"></i> {{ restaurant.address }}
            </p>
            <div class="popular-menu">
              <img :src="restaurant.popularMenu.image" :alt="restaurant.popularMenu.name">
              <div>
                <p class="menu-name">{{ restaurant.popularMenu.name }}</p>
                <p class="menu-price">Rp{{ restaurant.popularMenu.price.toLocaleString() }}</p>
              </div>
            </div>
            <button class="view-menu-btn" @click="goToRestaurant(restaurant.id)">
              Lihat Menu <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const restaurants = ref([])
const loading = ref(true)

// Sample data for demonstration
const popularMenus = ref([
  {
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan bumbu rahasia dan seafood segar",
    price: 45000,
    image: "https://images.unsplash.com/photo-1634093351937-f3d61e5decc3",
    popularity: 92,
    restaurant: "Sari Rasa"
  },
  {
    name: "Sate Ayam Madura",
    description: "Sate ayam dengan bumbu kacang khas Madura",
    price: 35000,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
    popularity: 88,
    restaurant: "Warung Madura"
  },
  {
    name: "Ramen Shoyu",
    description: "Ramen dengan kaldu ayam dan kecap Jepang",
    price: 55000,
    image: "https://images.unsplash.com/photo-1611270636750-7a9260445a1a",
    popularity: 85,
    restaurant: "Tokyo Kitchen"
  },
  {
    name: "Beef Burger Deluxe",
    description: "Burger dengan daging sapi premium dan keju melted",
    price: 65000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    popularity: 82,
    restaurant: "Burger Factory"
  },
  {
    name: "Tiramisu Classic",
    description: "Dessert Italia dengan lapisan mascarpone dan kopi",
    price: 35000,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    popularity: 78,
    restaurant: "Dolce Vita"
  }
])

const fetchRestaurants = async () => {
  try {
    const res = await axios.get('http://localhost:3000/restaurants')
    restaurants.value = res.data.map(r => ({
      ...r,
      tags: ['Trending', 'Terdekat', 'Populer'].slice(0, Math.floor(Math.random() * 2) + 1),
      popularMenu: {
        name: ['Nasi Goreng', 'Sate Ayam', 'Mie Ayam', 'Bakso'][Math.floor(Math.random() * 4)],
        price: Math.floor(Math.random() * 30000) + 25000,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
      }
    }))
  } catch (error) {
    console.error('Gagal memuat restoran:', error)
  } finally {
    loading.value = false
  }
}

const uniqueLocations = computed(() => {
  const locations = new Set()
  restaurants.value.forEach(r => {
    if (r.address) {
      const area = r.address.split(',').slice(-2).join(',').trim()
      locations.add(area || r.address)
    }
  })
  return Array.from(locations).slice(0, 4)
})

const countRestaurants = (location) => {
  return restaurants.value.filter(r => 
    r.address.includes(location)
  ).length
}

const getLocationImage = (location) => {
  const images = [
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    'https://images.unsplash.com/photo-1496564203457-11bb12075d90'
  ]
  return images[Math.floor(Math.random() * images.length)]
}

const focusLocation = (location) => {
  // Implement location focus logic
  console.log('Focus location:', location)
}

const goToRestaurant = (id) => {
  router.push(`/restoran/${id}`)
}

onMounted(() => {
  fetchRestaurants()
})
</script>

<style scoped>
.restaurant-discovery-page {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
}

.discovery-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4') center/cover;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.hero-overlay {
  max-width: 800px;
  padding: 0 1rem;
}

.hero-overlay h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-overlay p {
  font-size: 1.3rem;
  opacity: 0.9;
}

.section-title {
  text-align: center;
  margin: 3rem 0 2rem;
  font-size: 2rem;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.section-title i {
  color: #ff7f1f;
}

.location-section {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.location-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.location-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.location-card:hover {
  transform: translateY(-5px);
}

.location-image {
  position: relative;
  height: 180px;
}

.location-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.location-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.location-card h3 {
  padding: 1rem 1rem 0.5rem;
  margin: 0;
  color: #333;
}

.explore-btn {
  display: block;
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: none;
  border-top: 1px solid #eee;
  color: #ff7f1f;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.explore-btn:hover {
  background: #fff5ee;
}

.explore-btn i {
  margin-left: 0.5rem;
}

.menu-section {
  background: #fff5ee;
  padding: 3rem 1rem;
}

.menu-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0.5rem;
  scroll-snap-type: x mandatory;
  max-width: 1200px;
  margin: 0 auto;
}

.menu-carousel::-webkit-scrollbar {
  height: 8px;
}

.menu-carousel::-webkit-scrollbar-thumb {
  background: #ff7f1f;
  border-radius: 4px;
}

.menu-card {
  flex: 0 0 280px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: var(--delay);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.menu-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 127, 31, 0.9);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.menu-info {
  padding: 1.2rem;
}

.menu-info h3 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.menu-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
  color: #ff7f1f;
  font-size: 1.1rem;
}

.restaurant {
  font-size: 0.8rem;
  color: #888;
}

.restaurant-section {
  padding: 3rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.restaurant-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-header {
  position: relative;
  height: 180px;
}

.restaurant-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-tags {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: rgba(255, 127, 31, 0.9);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.restaurant-body {
  padding: 1.2rem;
}

.restaurant-body h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

.location {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.popular-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem;
  background: #fff9f5;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.popular-menu img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
}

.menu-name {
  font-weight: 500;
  margin: 0 0 0.2rem;
  font-size: 0.9rem;
}

.menu-price {
  color: #ff7f1f;
  font-size: 0.9rem;
  margin: 0;
}

.view-menu-btn {
  width: 100%;
  padding: 0.8rem;
  background: #ff7f1f;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.view-menu-btn:hover {
  background: #e6731c;
}

.view-menu-btn i {
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .hero-overlay h1 {
    font-size: 2.2rem;
  }
  
  .hero-overlay p {
    font-size: 1.1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .location-grid {
    grid-template-columns: 1fr;
  }
  
  .menu-carousel {
    padding-bottom: 1.5rem;
  }
}
</style>