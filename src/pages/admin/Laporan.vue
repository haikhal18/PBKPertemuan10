<template>
    <div class="laporan-admin">
      <h1 class="title">Laporan Pengguna & Penjual</h1>
  
      <div v-if="loading" class="loading">Memuat laporan...</div>
  
      <div v-else-if="reports.length === 0" class="empty">Tidak ada laporan saat ini.</div>
  
      <div v-else class="report-list">
        <div v-for="report in reports" :key="report.id" class="report-card">
          <p><strong>Dari:</strong> {{ report.fromRole }} (ID: {{ report.fromUserId }})</p>
          <p><strong>Pesan:</strong> {{ report.message }}</p>
          <p><strong>Waktu:</strong> {{ formatDate(report.timestamp) }}</p>
          <button @click="deleteReport(report.id)" class="btn-delete">Hapus Laporan</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const reports = ref([])
  const loading = ref(true)
  
  const loadReports = async () => {
    try {
      const res = await axios.get('http://localhost:3000/reports')
      reports.value = res.data
    } catch (err) {
      console.error('Gagal memuat laporan', err)
    } finally {
      loading.value = false
    }
  }
  
  const deleteReport = async (id) => {
    if (confirm('Yakin ingin menghapus laporan ini?')) {
      try {
        await axios.delete(`http://localhost:3000/reports/${id}`)
        reports.value = reports.value.filter(r => r.id !== id)
      } catch (err) {
        alert('Gagal menghapus laporan.')
        console.error(err)
      }
    }
  }
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
  
  onMounted(() => {
    loadReports()
  })
  </script>
  
  <style scoped>
  .laporan-admin {
    padding: 2rem;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
  
  .loading,
  .empty {
    font-style: italic;
    color: #888;
  }
  
  .report-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .report-card {
    background: #fff0f0;
    padding: 1rem;
    border-left: 6px solid #f87171;
    border-radius: 8px;
    box-shadow: 0 2px 5px #00000010;
  }
  
  .report-card p {
    margin: 0.3rem 0;
  }
  
  .btn-delete {
    margin-top: 0.5rem;
    background-color: #ef4444;
    color: white;
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  </style>