<template>
    <div class="cart-view">
      <section class="cart-hero">
        <div class="cart-hero-content">
          <h1 class="cart-hero-title">Keranjang Belanja Anda</h1>
          <p class="cart-hero-subtitle">Periksa pesanan Anda sebelum melanjutkan.</p>
        </div>
      </section>
  
      <section class="cart-content">
        <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat keranjang..." size="60px" color="#A00" />
  
        <div v-else-if="cartStore.totalItems === 0" class="empty-cart">
          <i class="fas fa-shopping-basket empty-cart-icon"></i>
          <p class="empty-cart-message">Keranjang Anda masih kosong!</p>
          <p class="empty-cart-suggestion">Ayo, <router-link to="/menu">lihat menu kami</router-link> dan mulai pesan makanan lezat.</p>
          <Button type="primary" @click="goToMenu">Lihat Menu</Button>
        </div>
  
        <div v-else class="cart-summary-container">
          <div class="cart-items">
            <div v-for="item in cartStore.items" :key="item.menuId" class="cart-item-card">
              <div class="item-image">
                <img :src="item.imageUrl || 'https://via.placeholder.com/100x100?text=Food'" :alt="item.name" />
              </div>
              <div class="item-details">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-price">Rp {{ item.price.toLocaleString('id-ID') }}</p>
              </div>
              <div class="item-quantity-controls">
                <Button type="secondary" size="small" @click="updateQuantity(item.menuId, item.quantity - 1)" :disabled="item.quantity <= 1">-</Button>
                <span class="item-quantity">{{ item.quantity }}</span>
                <Button type="secondary" size="small" @click="updateQuantity(item.menuId, item.quantity + 1)">+</Button>
              </div>
              <div class="item-subtotal">
                <p>Rp {{(item.price * item.quantity).toLocaleString('id-ID') }}</p>
              </div>
              <div class="item-actions">
                <Button type="danger" size="small" @click="removeItem(item.menuId)">
                  <i class="fas fa-trash-alt"></i>
                </Button>
              </div>
            </div>
          </div>
  
          <div class="cart-total-box">
            <h3>Ringkasan Pesanan</h3>
            <div class="total-row">
              <span>Jumlah Item:</span>
              <span>{{ cartStore.totalItems }}</span>
            </div>
            <div class="total-row large-text">
              <span>Total Harga:</span>
              <span>Rp {{ cartStore.totalPrice.toLocaleString('id-ID') }}</span>
            </div>
            <Button type="primary" style="width: 100%; margin-top: 20px;" @click="proceedToCheckout">Lanjutkan ke Checkout</Button>
            <Button type="text" style="width: 100%; margin-top: 10px;" @click="clearCart">Bersihkan Keranjang</Button>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from '@/components/common/Button.vue'; // Pastikan path benar
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'; // Pastikan path benar
  import { useCartStore } from '@/stores/cart'; // Pastikan path benar
  
  export default {
    name: 'CartView',
    components: {
      Button,
      LoadingSpinner,
    },
    setup() {
      const router = useRouter();
      const cartStore = useCartStore();
      const isLoading = ref(false); // Di halaman keranjang, loading biasanya cepat karena data dari store
  
      // Simulasi loading jika ada proses asinkron saat memuat keranjang (misal, refresh dari local storage)
      onMounted(() => {
        isLoading.value = true;
        // Dalam kasus nyata, mungkin ada logic untuk memuat ulang keranjang dari server/local storage
        // Misalnya: cartStore.loadCartFromStorage();
        setTimeout(() => {
          isLoading.value = false;
        }, 300); // Simulasi waktu loading singkat
      });
  
      const updateQuantity = (menuId, newQuantity) => {
        cartStore.updateItemQuantity(menuId, newQuantity);
      };
  
      const removeItem = (menuId) => {
        if (confirm('Yakin ingin menghapus item ini dari keranjang?')) {
          cartStore.removeItem(menuId);
        }
      };
  
      const clearCart = () => {
        if (confirm('Yakin ingin mengosongkan seluruh keranjang?')) {
          cartStore.clearCart();
        }
      };
  
      const proceedToCheckout = () => {
        if (cartStore.totalItems === 0) {
          alert('Keranjang Anda kosong! Silakan tambahkan item terlebih dahulu.');
          return;
        }
        router.push('/checkout'); // Navigasi ke halaman checkout
      };
  
      const goToMenu = () => {
        router.push('/menu');
      };
  
      return {
        cartStore,
        isLoading,
        updateQuantity,
        removeItem,
        clearCart,
        proceedToCheckout,
        goToMenu,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Variabel CSS, konsisten dengan base.css atau HomeView/MenuView */
  :root {
    --primary-color: #a00;
    --secondary-color: #f0f0f0;
    --text-dark: #333;
    --text-light: #f0f0f0;
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Open Sans', sans-serif;
  }
  
  .cart-view {
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  /* --- Cart Hero Section --- */
  .cart-hero {
    position: relative;
    width: 100%;
    height: 35vh; /* Tinggi hero yang lebih ringkas */
    background-image: url('@/assets/img/cart-hero-bg.jpg'); /* Ganti dengan gambar latar belakang keranjang */
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    overflow: hidden;
  }
  
  .cart-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  .cart-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 20px;
  }
  
  .cart-hero-title {
    font-family: var(--font-heading);
    font-size: 3em;
    margin-bottom: 10px;
    line-height: 1.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .cart-hero-subtitle {
    font-size: 1.1em;
    margin-top: 0;
  }
  
  /* --- Cart Content Section --- */
  .cart-content {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Empty Cart State */
  .empty-cart {
    text-align: center;
    padding: 80px 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  .empty-cart-icon {
    font-size: 4em;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .empty-cart-message {
    font-size: 1.8em;
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
  }
  
  .empty-cart-suggestion {
    font-size: 1.1em;
    color: #777;
    margin-bottom: 30px;
  }
  
  .empty-cart-suggestion a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
  }
  
  .empty-cart-suggestion a:hover {
    text-decoration: underline;
  }
  
  /* Cart Summary Container (grid for items and total) */
  .cart-summary-container {
    display: grid;
    grid-template-columns: 2fr 1fr; /* Item list (2/3) and total box (1/3) */
    gap: 30px; /* Jarak antar kolom */
    align-items: start; /* Pastikan item di top */
  }
  
  /* Cart Items List */
  .cart-items {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden; /* Untuk border-radius */
  }
  
  .cart-item-card {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }
  
  .cart-item-card:last-child {
    border-bottom: none; /* Hapus border bawah pada item terakhir */
  }
  
  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0; /* Mencegah gambar mengecil */
    margin-right: 15px;
  }
  
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .item-details {
    flex-grow: 1; /* Mengisi ruang yang tersedia */
  }
  
  .item-name {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0 0 5px;
  }
  
  .item-price {
    font-size: 0.9em;
    color: #777;
    margin: 0;
  }
  
  .item-quantity-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 20px; /* Jarak dari detail dan subtotal */
  }
  
  .item-quantity {
    font-weight: 600;
    min-width: 25px;
    text-align: center;
  }
  
  .item-subtotal {
    font-weight: bold;
    font-size: 1.1em;
    color: var(--primary-color);
    margin-left: auto; /* Dorong ke kanan */
    flex-shrink: 0;
    min-width: 100px;
    text-align: right;
  }
  
  .item-actions {
    margin-left: 15px;
  }
  
  /* Cart Total Box */
  .cart-total-box {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: 25px;
    position: sticky; /* Sticky sidebar */
    top: 100px; /* Jarak dari atas (sesuaikan dengan tinggi header) */
  }
  
  .cart-total-box h3 {
    font-family: var(--font-heading);
    font-size: 1.6em;
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: 25px;
    text-align: center;
  }
  
  .total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 1.05em;
    color: #555;
  }
  
  .total-row span:first-child {
    font-weight: 500;
  }
  
  .total-row.large-text {
    font-size: 1.3em;
    font-weight: bold;
    color: var(--text-dark);
    border-top: 1px solid #eee;
    padding-top: 15px;
    margin-top: 15px;
  }
  
  /* Media Queries */
  @media (max-width: 992px) {
    .cart-summary-container {
      grid-template-columns: 1fr; /* Satu kolom di tablet/mobile */
    }
    .cart-total-box {
      position: static; /* Hilangkan sticky di mobile */
      margin-top: 30px;
    }
  }
  
  @media (max-width: 768px) {
    .cart-hero {
      height: 25vh;
    }
    .cart-hero-title {
      font-size: 2.2em;
    }
    .cart-hero-subtitle {
      font-size: 0.9em;
    }
    .cart-content {
      padding: 30px 15px;
    }
    .cart-item-card {
      flex-wrap: wrap; /* Item akan wrap di layar sangat kecil */
      padding: 10px 15px;
    }
    .item-image {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    .item-details {
      margin-right: 10px;
    }
    .item-name {
      font-size: 1em;
    }
    .item-quantity-controls {
      margin: 10px 0; /* Berada di baris baru */
      width: 100%;
      justify-content: center;
    }
    .item-subtotal {
      width: 100%;
      text-align: center;
      margin-top: 10px;
      order: 4; /* Pindahkan ke bagian bawah */
    }
    .item-actions {
      width: 100%;
      text-align: center;
      margin-left: 0;
      order: 5; /* Pindahkan ke bagian paling bawah */
    }
  }
  </style>