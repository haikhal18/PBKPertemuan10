<template>
  <div class="admin-verify">
    <h1 class="title">Verifikasi & Manajemen Restoran</h1>

    <div v-if="loading" class="loading">Memuat data...</div>

    <div v-else-if="restaurants.length === 0" class="empty">
      Tidak ada restoran.
    </div>

    <div v-else class="restaurant-list">
      <div v-for="resto in restaurants" :key="resto.id" class="restaurant-card">
        <img :src="resto.image" :alt="resto.name" class="restaurant-image" />

        <div class="restaurant-info">
          <h2>{{ resto.name }}</h2>
          <p>{{ resto.description }}</p>
          <p><strong>Alamat:</strong> {{ resto.address }}</p>
          <p><strong>ID Penjual:</strong> {{ resto.ownerId }}</p>
          <p>
            <strong>Status:</strong>
            <span :class="resto.verified ? 'status-verified' : 'status-unverified'">
              {{ resto.verified ? 'Terverifikasi' : 'Belum Diverifikasi' }}
            </span>
          </p>

          <div class="actions">
            <button
              v-if="!resto.verified"
              @click="verifyRestaurant(resto.id)"
              class="btn btn-verif"
            >
              ✔ Verifikasi
            </button>
            <button
              v-else
              @click="unverifyRestaurant(resto.id)"
              class="btn btn-unverif"
            >
              ❌ Tutup
            </button>
            <button
              @click="deleteRestaurant(resto.id)"
              class="btn btn-delete"
            >
              🗑 Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const restaurants = ref([])
const loading = ref(true)

const loadRestaurants = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:3000/restaurants')
    // Urutkan: yang belum diverifikasi tampil dulu
    restaurants.value = res.data.sort((a, b) => a.verified - b.verified)
  } catch (err) {
    alert('Gagal memuat restoran')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const verifyRestaurant = async (id) => {
  await axios.patch(`http://localhost:3000/restaurants/${id}`, {
    verified: true
  })
  loadRestaurants()
}

const unverifyRestaurant = async (id) => {
  await axios.patch(`http://localhost:3000/restaurants/${id}`, {
    verified: false
  })
  loadRestaurants()
}

const deleteRestaurant = async (id) => {
  if (confirm('Apakah kamu yakin ingin menghapus restoran ini?')) {
    await axios.delete(`http://localhost:3000/restaurants/${id}`)
    alert('Restoran berhasil dihapus.')
    loadRestaurants()
  }
}

onMounted(() => {
  loadRestaurants()
})
</script>

<style scoped>
.admin-verify {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.loading {
  font-style: italic;
  color: #444;
}

.empty {
  font-style: italic;
  color: #888;
}

.restaurant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.restaurant-card {
  background-color: #fff6ea;
  border-radius: 12px;
  box-shadow: 0 2px 6px #00000010;
  padding: 1rem;
  width: 300px;
  display: flex;
  flex-direction: column;
}

.restaurant-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.restaurant-info h2 {
  margin: 0.2rem 0;
}

.status-verified {
  color: green;
  font-weight: bold;
}

.status-unverified {
  color: orange;
  font-weight: bold;
}

.actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn-verif {
  background-color: #4caf50;
  color: white;
}

.btn-unverif {
  background-color: #f44336;
  color: white;
}

.btn-delete {
  background-color: #999;
  color: white;
}
</style>
