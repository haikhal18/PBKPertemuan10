<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const deliveryAddress = ref({
  name: '',
  phone: '',
  address: ''
});
const selectedPayment = ref('COD');

onMounted(() => {
  if (authStore.isLoggedIn) {
    deliveryAddress.value.name = authStore.user.name;
  }
});

const confirmOrder = () => {
  if (!deliveryAddress.value.name || !deliveryAddress.value.phone || !deliveryAddress.value.address) {
    alert('Harap isi semua detail alamat pengiriman.');
    return;
  }

  const orderSummary = `
    Pesanan berhasil dibuat!
    ---------------------------
    Penerima: ${deliveryAddress.value.name}
    Telepon: ${deliveryAddress.value.phone}
    Alamat: ${deliveryAddress.value.address}
    ---------------------------
    Metode Pembayaran: ${selectedPayment.value}
    Total Belanja: Rp ${cartStore.totalPrice.toLocaleString('id-ID')}
    ---------------------------
    Terima kasih telah berbelanja!
  `;

  alert(orderSummary);
  cartStore.clearCart();
  router.push('/');
};
</script>

<template>
  <div class="checkout-view">
    <div class="checkout-container">
      <h1>Proses Checkout</h1>

      <div class="checkout-section">
        <h2>Alamat Pengiriman</h2>
        <form class="address-form">
          <div class="form-group">
            <label for="name">Nama Penerima</label>
            <input type="text" id="name" v-model="deliveryAddress.name" required>
          </div>
          <div class="form-group">
            <label for="phone">Nomor Telepon</label>
            <input type="tel" id="phone" v-model="deliveryAddress.phone" required>
          </div>
          <div class="form-group">
            <label for="address">Alamat Lengkap</label>
            <textarea id="address" v-model="deliveryAddress.address" rows="4" required></textarea>
          </div>
        </form>
      </div>

      <div class="checkout-section">
        <h2>Metode Pembayaran</h2>
        <div class="payment-options">
          <label class="payment-option">
            <input type="radio" name="payment" value="COD" v-model="selectedPayment">
            <div class="option-card">COD (Bayar di Tempat)</div>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="Transfer Bank" v-model="selectedPayment">
            <div class="option-card">Transfer Bank</div>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="QRIS" v-model="selectedPayment">
            <div class="option-card">QRIS</div>
          </label>
        </div>
      </div>
      
      <div class="summary-section">
        <div class="total-price">
          <span>Total Pembayaran:</span>
          <strong>Rp {{ cartStore.totalPrice.toLocaleString('id-ID') }}</strong>
        </div>
        <button @click="confirmOrder" class="confirm-button">Konfirmasi Pesanan</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-view {
  background-image: url('@/assets/food-background.jpg'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 4rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.checkout-container {
  background-color: rgba(255, 255, 255, 0.96); /* Semi-transparan untuk tetap terlihat elegan */
  padding: 2.5rem;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.checkout-section {
  margin-bottom: 2.5rem;
}
h1, h2 {
  margin-bottom: 1rem;
  color: #333;
}
.address-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.form-group input, .form-group textarea {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #fff;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
.payment-option input[type="radio"] {
  display: none;
}
.option-card {
  padding: 1.5rem 1rem;
  border: 2px solid #ccc;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fefefe;
}
.payment-option input[type="radio"]:checked + .option-card {
  border-color: #ff6347;
  background-color: #fff0e6;
  box-shadow: 0 0 0 2px #ff6347;
}

.summary-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ccc;
  text-align: right;
}
.total-price {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.total-price span {
  color: #444;
}
.total-price strong {
  font-size: 1.5rem;
  color: #ff6347;
  margin-left: 1rem;
}
.confirm-button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.confirm-button:hover {
  background-color: #e5533d;
}
</style>
