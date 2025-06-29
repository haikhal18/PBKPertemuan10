<template>
  <div class="checkout">
    <h1>Checkout</h1>

    <div v-if="items.length === 0" class="empty">
      <p>Keranjang kamu kosong.</p>
      <RouterLink to="/restaurants">Kembali ke restoran</RouterLink>
    </div>

    <div v-else class="checkout-details">
      <ul class="item-list">
        <li v-for="item in items" :key="item.id">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-price">Rp {{ item.price * item.qty }}</div>
          <div class="item-qty">x{{ item.qty }}</div>
        </li>
      </ul>

      <div class="total">
        <p>Total Harga: <strong>Rp {{ totalPrice }}</strong></p>
      </div>

      <button class="checkout-btn" @click="handleCheckout">Bayar Sekarang</button>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export default {
  name: 'Checkout',
  setup() {
    const cart = useCartStore()
    const { items } = storeToRefs(cart)
    const router = useRouter()

    const totalPrice = computed(() =>
      items.value.reduce((total, item) => total + item.price * item.qty, 0)
    )

    const handleCheckout = () => {
      if (items.value.length > 0) {
        alert('Pembayaran berhasil! Terima kasih 😊')
        cart.clearCart()
        router.push('/')
      }
    }

    return {
      items,
      totalPrice,
      handleCheckout
    }
  }
}
</script>

<style scoped>
.checkout {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', sans-serif;
}

.empty {
  text-align: center;
  padding: 2rem;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.item-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid #ddd;
}

.item-name {
  flex: 1;
}

.item-price, .item-qty {
  width: 100px;
  text-align: right;
}

.total {
  margin-top: 1rem;
  text-align: right;
  font-size: 1.1rem;
}

.checkout-btn {
  margin-top: 1.5rem;
  padding: 0.8rem 1.2rem;
  background-color: #ff7f1f;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
}

.checkout-btn:hover {
  background-color: #e86c00;
}
</style>