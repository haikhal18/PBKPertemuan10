<template>
  <div class="max-w-md mx-auto mt-10 p-4 shadow-lg bg-white rounded-xl">
    <h2 class="text-xl font-bold mb-4">Tambah Restoran</h2>
    <form @submit.prevent="addRestaurant">
      <input v-model.trim="name" placeholder="Nama Restoran" class="input" required />
      <input v-model.trim="description" placeholder="Deskripsi" class="input" required />
      <input v-model.trim="address" placeholder="Alamat" class="input" required />
      <input v-model.trim="image" placeholder="URL Gambar (opsional)" class="input" />
      <button class="btn">Kirim ke Admin</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const description = ref('')
const address = ref('')
const image = ref('')

const addRestaurant = async () => {
  const defaultImage = 'https://via.placeholder.com/600x400?text=No+Image'

  if (!authStore.user || authStore.user.role !== 'penjual') {
    alert('Anda harus login sebagai penjual!')
    router.push('/login')
    return
  }

  try {
    await axios.post('http://localhost:3000/restaurants', {
      name: name.value,
      description: description.value,
      address: address.value,
      image: image.value.trim() || defaultImage,
      menu: [],
      ownerId: authStore.user.id,
      verified: false
    })

    alert('Berhasil dikirim ke admin!')
    name.value = ''
    description.value = ''
    address.value = ''
    image.value = ''
  } catch (err) {
    alert('Gagal menambahkan restoran')
    console.error(err)
  }
}
</script>

<style scoped>
.input {
  display: block;
  margin-bottom: 1rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
.btn {
  background: #4ade80;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  width: 100%;
}
.btn:hover {
  background-color: #22c55e;
}
</style>