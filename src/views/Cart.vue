<template>
  <div class="cart-page">
    <h2>Keranjang Belanja</h2>
    <div v-if="cartItems.length > 0">
      <ul class="cart-list">
        <li v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>Restoran: {{ item.restaurant }}</p>
            <p>Harga: Rp {{ item.price.toLocaleString() }}</p>
          </div>
          <button @click="removeItem(index)" class="btn-remove">Hapus</button>
        </li>
      </ul>
      <div class="cart-total">
        <p>Total: <strong>Rp {{ totalPrice.toLocaleString() }}</strong></p>
        <button class="btn-checkout" @click="checkout">Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>Keranjang kosong.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cartItems: []
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
    removeItem(index) {
      this.cartItems.splice(index, 1)
      this.saveCart()
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems))
    },
    checkout() {
      alert("Terima kasih, pesanan Anda sedang diproses.")
      this.cartItems = []
      localStorage.removeItem('cart')
    }
  },
  mounted() {
    this.loadCart()
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fffdf9;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.cart-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #fff3ea;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item-info h3 {
  margin: 0;
}

.btn-remove {
  background: #ff6b6b;
  border: none;
  padding: 0.5rem;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.btn-remove:hover {
  background: #e55050;
}

.cart-total {
  text-align: right;
  margin-top: 1rem;
}

.btn-checkout {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 0.5rem;
  cursor: pointer;
}

.btn-checkout:hover {
  background-color: #218838;
}
</style>
