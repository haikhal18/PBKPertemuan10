<script setup>
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';
// Fungsi handleCheckout sudah tidak diperlukan di sini lagi, jadi kita hapus.

const cartStore = useCartStore();
</script>

<template>
  <div class="cart-wrapper">
    <div class="cart-view">
      <h1 class="page-title">🛒 Keranjang Belanja Anda</h1>

      <div v-if="cartStore.totalItems > 0" class="cart-container">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">@ Rp {{ item.price.toLocaleString('id-ID') }}</p>
              <div class="quantity-controls">
                <button @click="cartStore.decreaseQuantity(item.id)" class="quantity-btn">-</button>
                <span class="quantity-display">{{ item.quantity }}</span>
                <button @click="cartStore.increaseQuantity(item.id)" class="quantity-btn">+</button>
              </div>
            </div>
            <div class="item-total">
              <p class="subtotal">Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</p>
              <button @click="cartStore.removeItem(item.id)" class="remove-button" title="Hapus item">
                Hapus
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h2 class="summary-title">Ringkasan Pesanan</h2>
          <div class="summary-line">
            <span>Total Item</span>
            <span>{{ cartStore.totalItems }}</span>
          </div>
          <div class="summary-line total">
            <span>Total Harga</span>
            <span>Rp {{ cartStore.totalPrice.toLocaleString('id-ID') }}</span>
          </div>

          <RouterLink to="/checkout" class="checkout-button">
            Lanjutkan ke Pembayaran
          </RouterLink>

        </div>
      </div>

      <div v-else class="empty-cart">
        <p>Keranjang Anda masih kosong.</p>
        <RouterLink to="/foods" class="back-to-menu-button">
          Mulai Belanja
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* STYLE ANDA TIDAK SAYA UBAH SAMA SEKALI, SESUAI PERMINTAAN */
.cart-wrapper {
  width: 100vw;
  min-height: 100vh;
  background-image: url('@/assets/food-background.jpg'); /* Ganti dengan path yang sesuai */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.cart-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
}

.cart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background-color: var(--color-surface, #fdfdfd);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.item-price {
  margin: 0 0 0.75rem 0;
  color: #888;
  font-size: 0.9rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--color-border, #ccc);
  background-color: #f8f9fa;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-display {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.item-total {
  text-align: right;
}

.subtotal {
  font-weight: bold;
  font-size: 1.1rem;
}

.remove-button {
  background: none;
  border: none;
  color: var(--color-primary, #ff6347);
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding: 0;
}

.cart-summary {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border, #ddd);
  position: sticky;
  top: 2rem;
}

.summary-title {
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-line.total {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.checkout-button {
  display: block; /* Agar RouterLink bisa di-style seperti block */
  text-align: center; /* Agar teks di tengah */
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background-color: var(--color-secondary, #28a745);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  text-decoration: none;
}

.empty-cart {
  text-align: center;
  padding: 4rem 0;
}

.empty-cart p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.back-to-menu-button {
  padding: 0.8rem 2rem;
  background-color: var(--color-primary, #ff6347);
  color: white;
  border-radius: 50px;
  text-decoration: none;
}

/* Responsif */
@media (max-width: 768px) {
  .cart-container {
    grid-template-columns: 1fr;
  }
}
</style>