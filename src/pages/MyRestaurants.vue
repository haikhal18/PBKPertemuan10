<template>
    <div class="my-restaurants">
      <h1>Restoran Saya</h1>
  
      <div v-if="myRestaurants.length === 0" class="empty">
        Anda belum memiliki restoran.
      </div>
  
      <div v-else class="restaurant-list">
        <div
          v-for="resto in myRestaurants"
          :key="resto.id"
          class="restaurant-card"
        >
          <img :src="resto.image" :alt="resto.name" class="restaurant-image" />
          <div class="info">
            <h2>{{ resto.name }}</h2>
            <p>{{ resto.description }}</p>
            <p><strong>Alamat:</strong> {{ resto.address }}</p>
            <p><strong>Status:</strong>
              <span :class="resto.verified ? 'status-verified' : 'status-unverified'">
                {{ resto.verified ? 'Terverifikasi' : 'Belum Diverifikasi' }}
              </span>
            </p>
  
            <h3>Menu:</h3>
            <ul v-if="resto.menu.length > 0">
              <li v-for="item in resto.menu" :key="item.id">
                🍽 {{ item.name }} - Rp{{ item.price }} (Stok: {{ item.stok }})
              </li>
            </ul>
            <p v-else><i>Belum ada menu.</i></p>
  
            <button class="btn-add" @click="addMenu(resto.id)">
              ➕ Tambah Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  // Simulasi login penjual
  const currentUser = JSON.parse(localStorage.getItem('user')) || { id: '', role: '' }
  
  const allRestaurants = ref([])
  const myRestaurants = ref([])
  
  const fetchRestaurants = async () => {
    const res = await axios.get('http://localhost:3000/restaurants')
    allRestaurants.value = res.data
    myRestaurants.value = allRestaurants.value.filter(
      resto => resto.ownerId === currentUser.id
    )
  }
  
  const addMenu = async (restoId) => {
    const name = prompt('Nama menu:')
    const price = parseInt(prompt('Harga menu:'), 10)
    const stok = parseInt(prompt('Stok menu:'), 10)
  
    if (!name || isNaN(price) || isNaN(stok)) {
      alert('Input tidak valid.')
      return
    }
  
    const resto = myRestaurants.value.find(r => r.id === restoId)
    const newId = `${restoId}-${resto.menu.length + 1}`
  
    const newMenu = {
      id: newId,
      name,
      price,
      stok
    }
  
    const updatedMenu = [...resto.menu, newMenu]
  
    await axios.patch(`http://localhost:3000/restaurants/${restoId}`, {
      menu: updatedMenu
    })
  
    fetchRestaurants()
  }
  
  onMounted(() => {
    fetchRestaurants()
  })
  </script>
  
  <style scoped>
  .my-restaurants {
    padding: 2rem;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .restaurant-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  
  .restaurant-card {
    width: 300px;
    background: #fffaf0;
    border-radius: 10px;
    box-shadow: 0 2px 8px #00000020;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .restaurant-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  
  .info {
    padding: 1rem;
  }
  
  .status-verified {
    color: green;
    font-weight: bold;
  }
  
  .status-unverified {
    color: orange;
    font-weight: bold;
  }
  
  .btn-add {
    margin-top: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .btn-add:hover {
    background-color: #45a049;
  }
  
  .empty {
    font-style: italic;
    color: gray;
  }
  </style>
  