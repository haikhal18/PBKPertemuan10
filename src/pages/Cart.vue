<template>
  <div class="cart-container">
    <h2>Keranjang Belanja</h2>

    <div v-if="items.length === 0" class="empty-cart">
      Keranjang kosong. Silakan tambahkan makanan terlebih dahulu.
    </div>

    <div v-else>
      <ul class="cart-list">
        <li v-for="item in items" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>Harga: Rp {{ item.price.toLocaleString() }}</p>
            <p>Jumlah: {{ item.qty }}</p>
            <p>Total: Rp {{ (item.price * item.qty).toLocaleString() }}</p>
            <button @click="removeItem(item.id)" class="remove-btn">Hapus</button>
          </div>
        </li>
      </ul>

      <div class="cart-total">
        <h3>Total Harga: Rp {{ total.toLocaleString() }}</h3>
        <button class="checkout-btn" @click="checkout">Checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export default {
  name: 'Cart',
  setup() {
    const cartStore = useCartStore()
    const { items, total } = storeToRefs(cartStore)

    const removeItem = (id) => {
      cartStore.removeItem(id)
    }

    const checkout = () => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        alert('Anda harus login untuk checkout.')
        return
      }

      if (items.value.length === 0) {
        alert('Keranjang masih kosong.')
        return
      }

      alert('Pesanan berhasil diproses!')
      cartStore.clearCart()
    }

    return {
      items,
      total,
      removeItem,
      checkout
    }
  }
}
</script>

<style scoped>
/* (CSS tidak berubah, tetap seperti sebelumnya) */
.cart-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  color: #ff7f1f;
  margin-bottom: 2rem;
}

.empty-cart {
  text-align: center;
  color: #999;
  font-style: italic;
}

.cart-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  gap: 1rem;
  background-color: #fff;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cart-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0;
  color: #ff7f1f;
}

.item-info p {
  margin: 0.3rem 0;
  color: #333;
}

.remove-btn {
  margin-top: 0.5rem;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #d93030;
}

.cart-total {
  text-align: right;
  margin-top: 2rem;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.checkout-btn:hover {
  background-color: #1e7e34;
}
</style>