<template>
    <div class="order-detail-page" v-if="order">
      <h2>Detail Pesanan</h2>
      <div class="order-info">
        <p><strong>Nama:</strong> {{ order.name }}</p>
        <p><strong>Alamat:</strong> {{ order.address }}</p>
        <p><strong>Nomor HP:</strong> {{ order.phone }}</p>
        <p><strong>Total:</strong> Rp {{ order.total.toLocaleString() }}</p>
      </div>
  
      <h3>Daftar Item</h3>
      <ul class="item-list">
        <li v-for="(item, idx) in order.items" :key="idx">
          {{ item.name }} - Rp {{ item.price.toLocaleString() }}
        </li>
      </ul>
  
      <router-link to="/orders" class="btn-back">← Kembali ke Riwayat</router-link>
    </div>
  
    <div v-else>
      <p>Pesanan tidak ditemukan.</p>
      <router-link to="/orders">← Kembali ke Riwayat</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrderDetail',
    data() {
      return {
        order: null
      }
    },
    mounted() {
      const id = this.$route.params.id
      const orders = JSON.parse(localStorage.getItem('orders')) || []
      this.order = orders[id] || null
    }
  }
  </script>
  
  <style scoped>
  .order-detail-page {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fffef9;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .order-info {
    margin-bottom: 1.5rem;
  }
  
  .item-list {
    padding-left: 1.25rem;
    list-style-type: disc;
  }
  
  .btn-back {
    display: inline-block;
    margin-top: 1.5rem;
    background: #ccc;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
  }
  
  .btn-back:hover {
    background: #bbb;
  }
  </style>
  