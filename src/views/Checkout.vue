<template>
    <div class="checkout-page">
      <h2>Checkout</h2>
  
      <div v-if="cartItems.length > 0">
        <h3>Ringkasan Pesanan</h3>
        <ul class="checkout-list">
          <li v-for="(item, index) in cartItems" :key="index">
            {{ item.name }} - Rp {{ item.price.toLocaleString() }}
          </li>
        </ul>
  
        <p class="total">Total: <strong>Rp {{ totalPrice.toLocaleString() }}</strong></p>
  
        <form @submit.prevent="submitOrder">
          <h3>Informasi Pengiriman</h3>
          <input v-model="name" type="text" placeholder="Nama lengkap" required />
          <input v-model="address" type="text" placeholder="Alamat pengiriman" required />
          <input v-model="phone" type="text" placeholder="Nomor HP" required />
  
          <button type="submit" class="btn-confirm">Konfirmasi Pesanan</button>
        </form>
      </div>
  
      <div v-else>
        <p>Keranjang kosong. Silakan tambahkan item terlebih dahulu.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Checkout',
    data() {
      return {
        cartItems: [],
        name: '',
        address: '',
        phone: ''
      }
    },
    computed: {
      totalPrice() {
        return this.cartItems.reduce((total, item) => total + item.price, 0)
      }
    },
    methods: {
      loadCart() {
        const saved = localStorage.getItem('cart')
        this.cartItems = saved ? JSON.parse(saved) : []
      },
      submitOrder() {
        if (this.name && this.address && this.phone) {
          alert(`Pesanan atas nama ${this.name} telah diterima dan akan dikirim ke ${this.address}.`)
          this.cartItems = []
          localStorage.removeItem('cart')
  
          // Reset form
          this.name = ''
          this.address = ''
          this.phone = ''
  
          this.$router.push('/')
        }
      }
    },
    mounted() {
      this.loadCart()
    }
  }
  </script>
  
  <style scoped>
  .checkout-page {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1.5rem;
    background-color: #fdf8f4;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }
  
  .checkout-list {
    padding: 0;
    margin-bottom: 1rem;
  }
  
  .checkout-list li {
    background-color: #fff3e8;
    margin-bottom: 0.5rem;
    padding: 0.75rem;
    border-radius: 6px;
  }
  
  .total {
    font-size: 1.2rem;
    margin: 1rem 0;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .btn-confirm {
    background-color: #ff6347;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .btn-confirm:hover {
    background-color: #e6553a;
  }
  </style>
  