<template>
  <div class="max-w-4xl mx-auto mt-10 p-4">
    <h2 class="text-2xl font-bold mb-6">Restoran Saya</h2>

    <div v-if="restaurants.length === 0" class="text-center text-gray-500">
      Belum ada restoran yang Anda tambahkan.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="resto in restaurants"
        :key="resto.id"
        class="border rounded-xl p-4 shadow bg-white"
      >
        <img
          :src="resto.image"
          alt="Foto Restoran"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h3 class="text-xl font-semibold">{{ resto.name }}</h3>
        <p class="text-gray-600">{{ resto.description }}</p>
        <p class="mt-2 text-sm">
          Status:
          <span :class="resto.verified ? 'text-green-600' : 'text-red-600'">
            {{ resto.verified ? 'Terverifikasi' : 'Menunggu Verifikasi' }}
          </span>
        </p>
        <div class="flex gap-3 mt-3">
          <button
            @click="goToDetail(resto.id)"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Kelola Restoran
          </button>
          <button
            @click="goToTambahMenu(resto.id)"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Tambah Menu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const restaurants = ref([])
const router = useRouter()
const authStore = useAuthStore()

const fetchMyRestaurants = async () => {
  try {
    const res = await axios.get('http://localhost:3000/restaurants')
    restaurants.value = res.data.filter(
      (r) => r.ownerId === authStore.user.id
    )
  } catch (err) {
    console.error('Gagal mengambil data restoran', err)
  }
}

const goToDetail = (id) => {
  router.push(`/restoran/${id}`)
}

const goToTambahMenu = (id) => {
  router.push(`/penjual/tambah-menu/${id}`)
}

onMounted(() => {
  if (!authStore.user || authStore.user.role !== 'penjual') {
    alert('Anda harus login sebagai penjual!')
    router.push('/login')
  } else {
    fetchMyRestaurants()
  }
})
</script>

<style scoped>
/* Tambahkan styling jika diperlukan */
</style>
