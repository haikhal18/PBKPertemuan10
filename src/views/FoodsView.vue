<script setup>
import { ref, onMounted, computed } from 'vue'; // 1. Impor 'computed'
import axios from 'axios';
import FoodCard from '../components/FoodCard.vue';

// --- STATE ---
const foods = ref([]);
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref(''); // 2. State baru untuk menampung teks pencarian

// --- COMPUTED PROPERTY ---
// 3. Logika untuk memfilter makanan secara real-time
const filteredFoods = computed(() => {
  if (!searchQuery.value) {
    return foods.value; // Jika input kosong, tampilkan semua
  }
  // Ubah ke huruf kecil agar pencarian tidak case-sensitive
  return foods.value.filter(food =>
    food.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- API CALL ---
const fetchFoods = async () => {
  // ... (fungsi fetchFoods tetap sama)
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

    <div v-if="isLoading" class="loading-state">...</div>
    <div v-else-if="error" class="error-state">...</div>

    <div v-else-if="filteredFoods.length > 0" class="food-list-grid">
      <FoodCard 
        v-for="food in filteredFoods" 
        :key="food.id" 
        :food="food" 
      />
    </div>

    <div v-else class="empty-state">
      <p>Makanan dengan nama "{{ searchQuery }}" tidak ditemukan.</p>
    </div>
  </div>
</template>

<style scoped>
/* ... (style lama tetap sama) ... */
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
  border: 1px solid var(--color-border);
}
.food-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.empty-state {
  text-align: center;
  padding: 2rem;
}
</style>