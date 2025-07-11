<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import FoodForm from '../components/FoodForm.vue'; // Impor komponen form

// --- STATE ---
const foods = ref([]); // Untuk menampung daftar makanan dari API
const isLoading = ref(true); // Status loading
const error = ref(null); // Menampung pesan error
const showAddForm = ref(false); // Status untuk menampilkan/menyembunyikan form tambah

// --- METHODS ---

/**
 * Mengambil semua data makanan dari API.
 */
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

/**
 * Menangani penambahan makanan baru (CREATE).
 * Fungsi ini akan dipanggil oleh event dari komponen FoodForm.
 * @param {object} foodData - Data makanan baru dari form.
 */
const handleAddFood = async (foodData) => {
  try {
    await axios.post('http://localhost:3000/foods', foodData);
    alert('Menu baru berhasil ditambahkan!');
    showAddForm.value = false; // Sembunyikan form setelah berhasil
    await fetchFoods(); // Ambil ulang data untuk menampilkan item baru
  } catch (err) {
    console.error('Gagal menambah data:', err);
    alert('Gagal menambah menu baru.');
  }
};

/**
 * Menghapus data makanan (DELETE).
 * @param {number} foodId - ID makanan yang akan dihapus.
 */
const deleteFood = async (foodId) => {
  if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
    try {
      await axios.delete(`http://localhost:3000/foods/${foodId}`);
      alert('Menu berhasil dihapus.');
      await fetchFoods(); // Ambil ulang data untuk memperbarui daftar
    } catch (err) {
      console.error('Gagal menghapus data:', err);
      alert('Gagal menghapus menu.');
    }
  }
};

// --- LIFECYCLE HOOK ---

// Panggil fetchFoods() saat komponen pertama kali dimuat.
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
</template>

<style scoped>
.admin-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--color-heading);
}

.add-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: var(--color-primary-dark);
}

.form-container {
  background-color: #fdfdfd;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
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

.foods-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.foods-table th, .foods-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
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
}

.actions .edit-btn, .actions .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-size: 0.9rem;
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