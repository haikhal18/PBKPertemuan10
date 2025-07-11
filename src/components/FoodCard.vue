<script setup>
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth'; // 1. Impor auth store
import { useRouter } from 'vue-router'; // 2. Impor router untuk navigasi

// Mendefinisikan props
const props = defineProps({
  food: {
    type: Object,
    required: true
  }
});

// Mengakses store dan router
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

/**
 * (DIPERBARUI) Fungsi yang akan dipanggil ketika tombol diklik.
 */
function addToCart() {
  // 3. Periksa apakah pengguna sudah login
  if (authStore.isLoggedIn) {
    // Jika ya, tambahkan item ke keranjang
    cartStore.addItem(props.food);
    alert(`${props.food.name} berhasil ditambahkan ke keranjang!`);
  } else {
    // Jika tidak, beri peringatan dan arahkan ke halaman login
    alert('Anda harus login terlebih dahulu untuk menambahkan item ke keranjang.');
    router.push('/login');
  }
}
</script>

<template>
  <div class="food-card">
    <img :src="food.image" :alt="food.name" class="food-image">
    <div class="food-details">
      <h3 class="food-name">{{ food.name }}</h3>
      <p class="food-description">{{ food.description }}</p>
      <p class="food-price">Rp {{ food.price.toLocaleString('id-ID') }}</p>
    </div>
    <button @click="addToCart" class="add-to-cart-btn">
      Tambah ke Keranjang
    </button>
  </div>
</template>

<style scoped>
/* Style tidak perlu diubah, tetap sama seperti sebelumnya */
.food-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
}

.food-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.food-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.food-details {
  padding: 1rem;
  flex-grow: 1;
}

.food-name {
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
}

.food-description {
  font-size: 0.9rem;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  min-height: 40px;
}

.food-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

.add-to-cart-btn {
  display: block;
  width: calc(100% - 2rem);
  margin: 0 1rem 1rem 1rem;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: var(--color-primary-dark);
}
</style>