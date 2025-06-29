<template>
  <div class="orders-page">
    <h2>Riwayat Pesanan</h2>

    <div v-if="orders.length > 0">
      <div v-for="(order, index) in orders" :key="index" class="order-card">
        <h3>Pesanan #{{ index + 1 }}</h3>
        <p><strong>Nama:</strong> {{ order.name }}</p>
        <p><strong>Alamat:</strong> {{ order.address }}</p>
        <p><strong>Nomor HP:</strong> {{ order.phone }}</p>
        <p><strong>Total:</strong> Rp {{ order.total.toLocaleString() }}</p>

        <ul>
          <li v-for="(item, idx) in order.items" :key="idx">
            {{ item.name }} - Rp {{ item.price.toLocaleString() }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else>
      <p>Belum ada riwayat pesanan.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data() {
    return {
      orders: []
    }
  },
  mounted() {
    const savedOrders = localStorage.getItem('orders')
    this.orders = savedOrders ? JSON.parse(savedOrders) : []
  }
}
</script>

<style scoped>
.orders-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fffdf9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.order-card {
  background-color: #f8f3ef;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.order-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

ul {
  padding-left: 1.25rem;
  margin-top: 0.5rem;
}
</style>
