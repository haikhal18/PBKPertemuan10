<template>
    <div class="admin-dashboard">
      <h1 class="dashboard-title">Dashboard Admin</h1>
  
      <div v-if="loading" class="loading">Memuat data...</div>
  
      <div v-else class="stats-grid">
        <div class="stat-card">
          <h2>{{ totalVerified }}</h2>
          <p>Restoran Terverifikasi</p>
        </div>
  
        <div class="stat-card">
          <h2>{{ totalUnverified }}</h2>
          <p>Restoran Belum Diverifikasi</p>
        </div>
  
        <div class="stat-card">
          <h2>{{ totalMenus }}</h2>
          <p>Total Menu</p>
        </div>
  
        <div class="stat-card">
          <h2>{{ totalUsers }}</h2>
          <p>Total Pengguna (User & Penjual)</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const loading = ref(true)
  const totalVerified = ref(0)
  const totalUnverified = ref(0)
  const totalMenus = ref(0)
  const totalUsers = ref(0)
  
  const loadDashboardData = async () => {
    loading.value = true
    try {
      const [restoRes, menuRes, userRes] = await Promise.all([
        axios.get('http://localhost:3000/restaurants'),
        axios.get('http://localhost:3000/menus'),
        axios.get('http://localhost:3000/users')
      ])
  
      const restaurants = restoRes.data
      totalVerified.value = restaurants.filter(r => r.verified).length
      totalUnverified.value = restaurants.filter(r => !r.verified).length
      totalMenus.value = menuRes.data.length
      totalUsers.value = userRes.data.filter(u => u.role !== 'admin').length
    } catch (err) {
      alert('Gagal memuat data dashboard.')
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    loadDashboardData()
  })
  </script>
  
  <style scoped>
  .admin-dashboard {
    padding: 2rem;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .dashboard-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  
  .loading {
    font-style: italic;
    color: #444;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }
  
  .stat-card {
    background-color: #fef3c7;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 10px #00000010;
    text-align: center;
  }
  
  .stat-card h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #f97316;
  }
  
  .stat-card p {
    margin: 0;
    font-weight: 500;
  }
  </style>