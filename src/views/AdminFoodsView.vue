<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import FoodForm from '../components/FoodForm.vue';
import FoodDetailModal from '../components/FoodDetailModal.vue'; // 1. Impor komponen modal

// --- STATE ---
const foods = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showAddForm = ref(false);

// 2. State baru untuk mengontrol modal
const selectedFoodForDetail = ref(null);
const isDetailModalVisible = ref(false);

// --- METHODS ---
const fetchFoods = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://localhost:3000/foods');
    foods.value = response.data;
  } catch (err) {
    console.error('Gagal mengambil data:', err);
    error.value = 'Tidak dapat memuat data menu. Pastikan server API berjalan.';
  } finally {
    isLoading.value = false;
  }
};

const handleAddFood = async (foodData) => {
  try {
    await axios.post('http://localhost:3000/foods', foodData);
    alert('Menu baru berhasil ditambahkan!');
    showAddForm.value = false;
    await fetchFoods();
  } catch (err) {
    console.error('Gagal menambah data:', err);
    alert('Gagal menambah menu baru.');
  }
};

const deleteFood = async (foodId) => {
  if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
    try {
      await axios.delete(`http://localhost:3000/foods/${foodId}`);
      alert('Menu berhasil dihapus.');
      await fetchFoods();
    } catch (err) {
      console.error('Gagal menghapus data:', err);
      alert('Gagal menghapus menu.');
    }
  }
};

// 3. Fungsi baru untuk membuka modal detail
const openDetailModal = (food) => {
  selectedFoodForDetail.value = food;
  isDetailModalVisible.value = true;
};

// 4. Fungsi baru untuk menutup modal
const closeDetailModal = () => {
  isDetailModalVisible.value = false;
  selectedFoodForDetail.value = null;
};

onMounted(() => {
  fetchFoods();
});
</script>

<template>
  <div class="admin-view">
    <div class="header">
      <h1>Manajemen Menu</h1>
      <button @click="showAddForm = !showAddForm" class="add-button">
        {{ showAddForm ? 'Batal' : 'Tambah Menu Baru' }}
      </button>
    </div>

    <div v-if="showAddForm" class="form-container">
      <FoodForm @submit="handleAddFood" />
    </div>

    <div v-if="isLoading" class="loading">Memuat data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="foods-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Deskripsi</th>
          <th>Harga</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="foods.length === 0">
          <td colspan="4">Belum ada menu. Silakan tambahkan.</td>
        </tr>
        <tr v-for="food in foods" :key="food.id">
          <td>{{ food.name }}</td>
          <td>{{ food.description }}</td>
          <td>Rp {{ food.price.toLocaleString('id-ID') }}</td>
          <td class="actions">
            <button @click="openDetailModal(food)" class="detail-btn">
              Detail
            </button>
            <RouterLink :to="{ name: 'edit-food', params: { id: food.id } }" class="edit-btn">
              Edit
            </RouterLink>
            <button @click="deleteFood(food.id)" class="delete-btn">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <FoodDetailModal 
    v-if="isDetailModalVisible" 
    :food="selectedFoodForDetail" 
    @close="closeDetailModal"
  />
</template>

<style scoped>
/* STYLE ANDA TIDAK SAYA UBAH, HANYA MENAMBAHKAN STYLE UNTUK TOMBOL DETAIL */
.admin-view {
  max-width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background-image: url('@/assets/food-background.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  backdrop-filter: brightness(0.95);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
h1 {
  color: #333;
  margin: 0;
}
.add-button {
  background-color: var(--color-primary, #28a745);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.add-button:hover {
  background-color: var(--color-primary-dark, #218838);
}
.form-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}
.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #eee;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.error {
  color: #f44336;
}
.foods-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.foods-table th, .foods-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border, #ddd);
}
.foods-table th {
  background-color: #f8f9fa;
}
.foods-table tr:last-child td {
  border-bottom: none;
}
.foods-table tr:hover {
  background-color: #f1f1f1;
}
.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.actions .detail-btn,
.actions .edit-btn,
.actions .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-size: 0.9rem;
  text-align: center;
}
.detail-btn {
  background-color: #17a2b8; /* Warna Info/Biru Langit */
}
.detail-btn:hover {
  background-color: #138496;
}
.edit-btn {
  background-color: #007bff;
}
.edit-btn:hover {
  background-color: #0056b3;
}
.delete-btn {
  background-color: #dc3545;
}
.delete-btn:hover {
  background-color: #c82333;
}
</style>