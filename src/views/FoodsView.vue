<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import FoodCard from '../components/FoodCard.vue';

const foods = ref([]);
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref('');

const filteredFoods = computed(() => {
  if (!searchQuery.value) {
    return foods.value;
  }
  return foods.value.filter(food =>
    food.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchFoods = async () => {
  try {
    const response = await axios.get('http://localhost:3000/foods');
    foods.value = response.data;
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFoods();
});
</script>

<template>
  <div class="foods-wrapper">
    <div class="foods-page">
      <h1 class="page-title">Pilih Menu Favorit Anda</h1>

      <div class="search-container">
        <input 
          type="search" 
          v-model="searchQuery"
          placeholder="Cari makanan berdasarkan nama..."
          class="search-input"
        />
      </div>

      <div v-if="isLoading" class="loading-state">
        <p>Memuat data makanan...</p>
      </div>
      <div v-else-if="error" class="error-state">
        <p>Terjadi kesalahan: {{ error }}</p>
      </div>

      <div v-else-if="filteredFoods.length > 0" class="food-list-grid">
        <FoodCard 
          v-for="food in filteredFoods" 
          :key="food.id" 
          :food="food" 
        />
      </div>

      <div v-else class="empty-state">
        <p>Makanan dengan nama "<strong>{{ searchQuery }}</strong>" tidak ditemukan.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.foods-wrapper {
  width: 100vw;
  min-height: 100vh;
  background-image: url('@/assets/food-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.foods-page {
  max-width: 1200px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.92);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ff6347; /* warna oranye */
  font-weight: bold;
}

.search-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  padding: 2rem 1rem;
}

.food-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
