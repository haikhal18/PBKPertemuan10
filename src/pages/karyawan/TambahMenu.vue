<template>
  <div class="add-menu">
    <h2>{{ isEdit ? 'Edit Menu' : 'Tambah Menu' }} untuk Restoran</h2>

    <form @submit.prevent="submitMenu">
      <div class="form-group">
        <label>Nama Menu</label>
        <input v-model="form.name" required />
      </div>

      <div class="form-group">
        <label>Deskripsi</label>
        <textarea v-model="form.description" required></textarea>
      </div>

      <div class="form-group">
        <label>Harga (Rp)</label>
        <input type="number" v-model.number="form.price" required />
      </div>

      <div class="form-group">
        <label>Kategori</label>
        <select v-model="form.category" required>
          <option value="makanan">Makanan</option>
          <option value="minuman">Minuman</option>
        </select>
      </div>

      <div class="form-group">
        <label>URL Gambar</label>
        <input v-model="form.image" placeholder="https://..." />
      </div>

      <button type="submit">{{ isEdit ? 'Simpan Perubahan' : 'Tambah Menu' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const restaurantId = route.params.id
const menuId = route.params.menuId // kalau ada, untuk edit

const isEdit = ref(false)
const form = ref({
  name: '',
  description: '',
  price: 0,
  category: 'makanan',
  image: ''
})

onMounted(async () => {
  if (menuId) {
    isEdit.value = true
    try {
      // Ambil data restoran
      const res = await axios.get(`http://localhost:3000/restaurants/${restaurantId}`)
      const restaurant = res.data

      // Cari menu yang mau diedit
      const menuToEdit = restaurant.menu.find(m => m.id === Number(menuId))
      if (!menuToEdit) {
        alert('Menu tidak ditemukan.')
        router.push(`/restoran/${restaurantId}`)
        return
      }

      // Isi form dengan data menu yang diedit
      form.value.name = menuToEdit.name
      form.value.description = menuToEdit.description
      form.value.price = menuToEdit.price
      form.value.category = menuToEdit.category
      form.value.image = menuToEdit.image
    } catch (err) {
      alert('Gagal mengambil data menu.')
      console.error(err)
      router.push(`/restoran/${restaurantId}`)
    }
  }
})

const submitMenu = async () => {
  try {
    // Ambil data restoran dulu
    const res = await axios.get(`http://localhost:3000/restaurants/${restaurantId}`)
    const restaurant = res.data

    if (!restaurant.verified) {
      alert('Restoran belum diverifikasi admin.')
      return
    }

    if (isEdit.value) {
      // Update menu yang ada
      const index = restaurant.menu.findIndex(m => m.id === Number(menuId))
      if (index === -1) {
        alert('Menu tidak ditemukan.')
        return
      }
      restaurant.menu[index] = {
        ...restaurant.menu[index], // agar tetap punya properti lain seperti stock, id
        name: form.value.name,
        description: form.value.description,
        price: form.value.price,
        category: form.value.category,
        image: form.value.image || 'https://via.placeholder.com/150'
      }
    } else {
      // Tambah menu baru
      const newMenu = {
        id: Date.now(),
        name: form.value.name,
        description: form.value.description,
        price: form.value.price,
        category: form.value.category,
        image: form.value.image || 'https://via.placeholder.com/150',
        stock: 10
      }
      restaurant.menu.push(newMenu)
    }

    // Simpan perubahan ke server
    await axios.put(`http://localhost:3000/restaurants/${restaurantId}`, restaurant)

    alert(isEdit.value ? 'Menu berhasil diperbarui!' : 'Menu berhasil ditambahkan!')
    router.push(`/restoran/${restaurantId}`)
  } catch (err) {
    alert('Gagal menyimpan menu.')
    console.error(err)
  }
}
</script>

<style scoped>
/* Style sama seperti sebelumnya */
.add-menu {
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
  background-color: #fff8f2;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 0.6rem 1.2rem;
  background-color: #ff7f1f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #e96e0d;
}
</style>
