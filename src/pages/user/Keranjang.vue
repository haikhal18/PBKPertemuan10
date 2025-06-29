<template>
    <div class="cart-page">
      <h2>🛒 Keranjang Belanja</h2>
  
      <div v-if="cartItems.length === 0" class="empty-cart">
        Keranjang Anda kosong.
      </div>
  
      <div v-else class="cart-items">
        <div
          v-for="(item, index) in cartItems"
          :key="index"
          class="cart-item"
        >
          <img :src="item.image" alt="Makanan" class="item-image" />
          <div class="item-info">
            <h4>{{ item.name }}</h4>
            <p>Rp {{ item.price.toLocaleString() }}</p>
          </div>
          <button @click="removeItem(item.id)" class="remove-btn">❌</button>
        </div>
  
        <div class="cart-summary">
          <p>Total: <strong>Rp {{ totalPrice.toLocaleString() }}</strong></p>
          <button @click="checkout" class="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useCartStore } from '@/stores/cartStore'
  import { useRouter } from 'vue-router'
  
  const cartStore = useCartStore()
  const router = useRouter()
  
  const cartItems = computed(() => cartStore.items)
  
  const totalPrice = computed(() =>
    cartStore.items.reduce((total, item) => total + item.price, 0)
  )
  
  const removeItem = (id) => {
    cartStore.removeItem(id)
  }
  
  const checkout = () => {
    alert('Terima kasih! Pesanan Anda akan diproses.')
    cartStore.clearCart()
    router.push('/')
  }
  </script>
  
  <style scoped>
  .cart-page {
    max-width: 700px;
    margin: 3rem auto;
    padding: 1.5rem;
    background: #fffefc;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .cart-page h2 {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .empty-cart {
    text-align: center;
    font-size: 1.1rem;
    color: #777;
  }
  
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff4e6;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .item-info {
    flex: 1;
    margin-left: 1rem;
  }
  
  .remove-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem;
    cursor: pointer;
  }
  
  .cart-summary {
    margin-top: 2rem;
    text-align: right;
  }
  
  .checkout-btn {
    background: #ff7f1f;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
  }
  </style>
  