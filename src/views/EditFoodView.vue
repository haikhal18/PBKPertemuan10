<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import FoodForm from '../components/FoodForm.vue';

// --- STATE & ROUTER ---
const food = ref(null); // Mulai dengan null, akan diisi data dari API
const isLoading = ref(true);
const error = ref(null);

const route = useRoute(); // Untuk mendapatkan parameter dari URL
const router = useRouter(); // Untuk navigasi
const foodId = route.params.id; // Ambil ID makanan dari URL, contoh: '/edit/3' -> 3

// --- METHODS ---

/**
 * Mengambil data makanan spesifik berdasarkan ID.
 */
const fetchFoodData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/foods/${foodId}`);
    food.value = response.data;
  } catch (err) {
    console.error('Gagal mengambil data untuk diedit:', err);
    error.value = 'Data makanan tidak ditemukan atau server error.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Menangani pembaruan data (UPDATE).
 * Dipicu oleh event 'submit' dari komponen FoodForm.
 * @param {object} updatedFoodData - Data terbaru dari form.
 */
const handleUpdateFood = async (updatedFoodData) => {
  try {
    await axios.put(`http://localhost:3000/foods/${foodId}`, updatedFoodData);
    alert('Menu berhasil diperbarui!');
    router.push({ name: 'admin-foods' }); // Kembali ke halaman utama admin
  } catch (err) {
    console.error('Gagal memperbarui data:', err);
    alert('Gagal memperbarui menu.');
  }
};

// --- LIFECYCLE HOOK ---

// Panggil fetchFoodData() saat komponen dimuat
onMounted(() => {
  fetchFoodData();
});
</script>

<template>
  <div class="edit-view">
    <h1>Edit Menu Makanan</h1>

    <div v-if="isLoading" class="loading">Memuat data form...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="food" class="form-container">
      <FoodForm :initial-data="food" @submit="handleUpdateFood" />
    </div>
  </div>
</template>

<style scoped>
.edit-view {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

.form-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #888;
}

.error {
  color: #d9534f;
}
</style>