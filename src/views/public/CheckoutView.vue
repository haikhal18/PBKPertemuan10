<template>
    <div class="checkout-view">
      <section class="checkout-hero">
        <div class="checkout-hero-content">
          <h1 class="checkout-hero-title">Selesaikan Pesanan Anda</h1>
          <p class="checkout-hero-subtitle">Isi detail pengiriman dan pembayaran untuk mengonfirmasi.</p>
        </div>
      </section>
  
      <section class="checkout-content">
        <LoadingSpinner v-if="isLoading" :isLoading="isLoading" :fullScreen="true" message="Memproses pesanan Anda..." />
  
        <div v-else-if="cartStore.totalItems === 0" class="empty-checkout">
          <i class="fas fa-shopping-basket empty-checkout-icon"></i>
          <p class="empty-checkout-message">Keranjang Anda kosong!</p>
          <p class="empty-checkout-suggestion">Tidak ada yang bisa di-checkout. Ayo, <router-link to="/menu">lihat menu kami</router-link> dan mulai pesan makanan lezat.</p>
          <Button type="primary" @click="goToMenu">Lihat Menu</Button>
        </div>
  
        <div v-else class="checkout-form-container">
          <div class="checkout-stepper">
            <div :class="['step', { 'active': currentStep >= 1 }]">1. Pengiriman</div>
            <div :class="['step', { 'active': currentStep >= 2 }]">2. Pembayaran</div>
            <div :class="['step', { 'active': currentStep >= 3 }]">3. Konfirmasi</div>
          </div>
  
          <div v-show="currentStep === 1" class="checkout-section delivery-details">
            <h3 class="section-title">Detail Pengiriman</h3>
            <form @submit.prevent="nextStep">
              <div class="form-group">
                <label for="fullName">Nama Lengkap:</label>
                <input type="text" id="fullName" v-model="deliveryDetails.fullName" required>
              </div>
              <div class="form-group">
                <label for="phone">Nomor Telepon:</label>
                <input type="tel" id="phone" v-model="deliveryDetails.phone" required>
              </div>
              <div class="form-group">
                <label for="address">Alamat Pengiriman:</label>
                <textarea id="address" v-model="deliveryDetails.address" rows="3" required></textarea>
              </div>
              <div class="form-group">
                <label for="notes">Catatan Tambahan (opsional):</label>
                <textarea id="notes" v-model="deliveryDetails.notes" rows="2"></textarea>
              </div>
              <Button type="primary" class="form-next-btn">Lanjutkan ke Pembayaran</Button>
            </form>
          </div>
  
          <div v-show="currentStep === 2" class="checkout-section payment-method">
            <h3 class="section-title">Metode Pembayaran</h3>
            <div class="form-group">
              <label>Pilih Metode:</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="paymentDetails.method" value="cash" required>
                  Tunai saat Pengiriman (COD)
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="paymentDetails.method" value="transfer" required>
                  Transfer Bank (Verifikasi Manual)
                </label>
                </div>
            </div>
            <div v-if="paymentDetails.method === 'transfer'" class="bank-transfer-info">
              <p>Silakan transfer ke rekening:</p>
              <p><strong>Bank BCA - 1234567890 (a/n Nama Restoran)</strong></p>
              <p>Sertakan ID Pesanan Anda sebagai catatan transfer.</p>
            </div>
            <div class="checkout-navigation">
              <Button type="secondary" @click="prevStep">Kembali</Button>
              <Button type="primary" @click="nextStep">Lanjutkan ke Konfirmasi</Button>
            </div>
          </div>
  
          <div v-show="currentStep === 3" class="checkout-section order-summary">
            <h3 class="section-title">Konfirmasi Pesanan</h3>
            <div class="summary-details">
              <h4>Detail Pengiriman:</h4>
              <p><strong>Nama:</strong> {{ deliveryDetails.fullName }}</p>
              <p><strong>Telepon:</strong> {{ deliveryDetails.phone }}</p>
              <p><strong>Alamat:</strong> {{ deliveryDetails.address }}</p>
              <p v-if="deliveryDetails.notes"><strong>Catatan:</strong> {{ deliveryDetails.notes }}</p>
  
              <h4 style="margin-top: 20px;">Metode Pembayaran:</h4>
              <p>{{ paymentDetails.method === 'cash' ? 'Tunai saat Pengiriman (COD)' : 'Transfer Bank' }}</p>
  
              <h4 style="margin-top: 20px;">Item Pesanan:</h4>
              <ul class="summary-items-list">
                <li v-for="item in cartStore.items" :key="item.menuId">
                  <span>{{ item.name }} x {{ item.quantity }}</span>
                  <span>Rp {{(item.price * item.quantity).toLocaleString('id-ID') }}</span>
                </li>
              </ul>
  
              <div class="final-total">
                <span>Total Akhir:</span>
                <span>Rp {{ cartStore.totalPrice.toLocaleString('id-ID') }}</span>
              </div>
            </div>
            <div class="checkout-navigation">
              <Button type="secondary" @click="prevStep">Kembali</Button>
              <Button type="primary" @click="placeOrder">Buat Pesanan</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from '@/components/common/Button.vue';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import { useCartStore } from '@/stores/cart';
  import { useAuthStore } from '@/stores/auth'; // Untuk mendapatkan userId
  import { createOrder } from '@/composables/useApi'; // Fungsi untuk mengirim pesanan ke API
  
  export default {
    name: 'CheckoutView',
    components: {
      Button,
      LoadingSpinner,
    },
    setup() {
      const router = useRouter();
      const cartStore = useCartStore();
      const authStore = useAuthStore();
  
      const isLoading = ref(false); // Untuk loading spinner saat memproses pesanan
      const currentStep = ref(1); // Mengontrol langkah checkout (1: pengiriman, 2: pembayaran, 3: konfirmasi)
  
      const deliveryDetails = reactive({
        fullName: authStore.user?.username || '', // Pre-fill jika user login
        phone: '',
        address: '',
        notes: '',
      });
  
      const paymentDetails = reactive({
        method: 'cash', // Default COD
      });
  
      // Redirect ke keranjang jika keranjang kosong saat masuk halaman checkout
      onMounted(() => {
        if (cartStore.totalItems === 0) {
          alert('Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
          router.push('/cart');
        }
      });
  
      const nextStep = () => {
        // Validasi sederhana sebelum maju ke step berikutnya
        if (currentStep.value === 1) {
          if (!deliveryDetails.fullName || !deliveryDetails.phone || !deliveryDetails.address) {
            alert('Mohon lengkapi semua detail pengiriman!');
            return;
          }
        }
        currentStep.value++;
      };
  
      const prevStep = () => {
        currentStep.value--;
      };
  
      const placeOrder = async () => {
        isLoading.value = true; // Aktifkan loading spinner full screen
        try {
          const orderData = {
            userId: authStore.user?.id, // ID pengguna dari Pinia auth store
            items: cartStore.items.map(item => ({
              menuId: item.menuId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            delivery: { ...deliveryDetails },
            paymentMethod: paymentDetails.method,
            total: cartStore.totalPrice,
            status: 'baru', // Status awal pesanan
            orderDate: new Date().toISOString(), // Waktu pesanan dibuat
          };
  
          const response = await createOrder(orderData); // Panggil API untuk membuat pesanan
          console.log('Pesanan berhasil dibuat:', response);
  
          cartStore.clearCart(); // Kosongkan keranjang setelah pesanan berhasil
          alert('Pesanan Anda berhasil dibuat! ID Pesanan: ' + response.id);
          router.push('/my-orders'); // Arahkan ke halaman status pesanan atau halaman sukses
        } catch (error) {
          console.error('Gagal membuat pesanan:', error);
          alert('Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.');
        } finally {
          isLoading.value = false; // Nonaktifkan loading spinner
        }
      };
  
      const goToMenu = () => {
        router.push('/menu');
      };
  
      return {
        cartStore,
        isLoading,
        currentStep,
        deliveryDetails,
        paymentDetails,
        nextStep,
        prevStep,
        placeOrder,
        goToMenu,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Variabel CSS, konsisten dengan base.css atau hero sections lainnya */
  :root {
    --primary-color: #a00;
    --secondary-color: #f0f0f0;
    --text-dark: #333;
    --text-light: #f0f0f0;
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Open Sans', sans-serif;
  }
  
  .checkout-view {
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  /* --- Checkout Hero Section --- */
  .checkout-hero {
    position: relative;
    width: 100%;
    height: 35vh; /* Tinggi hero yang ringkas */
    background-image: url('@/assets/img/checkout-hero-bg.jpg'); /* Ganti dengan gambar latar belakang checkout */
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
  
  .checkout-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  .checkout-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 20px;
  }
  
  .checkout-hero-title {
    font-family: var(--font-heading);
    font-size: 3em;
    margin-bottom: 10px;
    line-height: 1.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .checkout-hero-subtitle {
    font-size: 1.1em;
    margin-top: 0;
  }
  
  /* --- Checkout Content Section --- */
  .checkout-content {
    padding: 60px 20px;
    max-width: 900px; /* Lebar konten checkout yang lebih fokus */
    margin: 0 auto;
  }
  
  /* Empty Checkout State (sama seperti CartView) */
  .empty-checkout {
    text-align: center;
    padding: 80px 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  .empty-checkout-icon {
    font-size: 4em;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .empty-checkout-message {
    font-size: 1.8em;
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
  }
  
  .empty-checkout-suggestion {
    font-size: 1.1em;
    color: #777;
    margin-bottom: 30px;
  }
  
  .empty-checkout-suggestion a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
  }
  
  .empty-checkout-suggestion a:hover {
    text-decoration: underline;
  }
  
  /* Checkout Form Container */
  .checkout-form-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 30px;
  }
  
  /* Progress Stepper */
  .checkout-stepper {
    display: flex;
    justify-content: space-around;
    margin-bottom: 40px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .step {
    padding: 10px 20px;
    font-weight: 600;
    color: #bbb;
    position: relative;
    transition: color 0.3s ease;
  }
  
  .step.active {
    color: var(--primary-color);
  }
  
  .step::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -15px;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
  
  .step.active::after {
    width: 100%; /* Garis bawah penuh saat aktif */
  }
  
  /* Form Sections */
  .checkout-section {
    margin-bottom: 30px;
  }
  
  .section-title {
    font-family: var(--font-heading);
    font-size: 1.8em;
    color: var(--primary-color);
    margin-bottom: 25px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
  }
  
  .form-group input[type="text"],
  .form-group input[type="tel"],
  .form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1em;
    font-family: var(--font-body);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box; /* Pastikan padding tidak menambah lebar */
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(170, 0, 0, 0.1);
    outline: none;
  }
  
  .form-next-btn {
    margin-top: 20px;
    width: 100%;
  }
  
  /* Radio Group for Payment Method */
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px 0;
  }
  
  .radio-option {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 1.05em;
    color: #444;
  }
  
  .radio-option input[type="radio"] {
    /* Customize radio button if needed */
    transform: scale(1.2); /* Sedikit lebih besar */
  }
  
  .bank-transfer-info {
    background-color: #f0f8ff; /* Warna latar belakang info bank */
    border: 1px solid #cceeff;
    border-radius: 8px;
    padding: 20px;
    margin-top: 25px;
    color: #336699;
  }
  
  .bank-transfer-info p {
    margin: 0 0 8px;
  }
  .bank-transfer-info p:last-child {
    margin-bottom: 0;
  }
  
  /* Navigation Buttons at Bottom of Each Step */
  .checkout-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    gap: 15px;
  }
  
  /* Order Summary */
  .summary-details {
    background-color: #fcfcfc;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 25px;
  }
  
  .summary-details h4 {
    font-family: var(--font-body); /* Gunakan font body untuk sub-judul ringkasan */
    font-size: 1.15em;
    color: var(--primary-color);
    margin-bottom: 15px;
  }
  
  .summary-details p {
    margin-bottom: 8px;
    color: #555;
  }
  
  .summary-details strong {
    color: var(--text-dark);
  }
  
  .summary-items-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px;
    border-top: 1px dashed #eee;
    padding-top: 15px;
  }
  
  .summary-items-list li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 1.05em;
    color: #444;
  }
  
  .final-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.5em;
    font-weight: bold;
    color: var(--primary-color);
    border-top: 2px solid var(--primary-color);
    padding-top: 20px;
    margin-top: 20px;
  }
  
  /* --- Media Queries --- */
  @media (max-width: 768px) {
    .checkout-hero {
      height: 25vh;
    }
    .checkout-hero-title {
      font-size: 2.2em;
    }
    .checkout-hero-subtitle {
      font-size: 0.9em;
    }
    .checkout-content {
      padding: 30px 15px;
    }
    .checkout-form-container {
      padding: 20px;
    }
    .checkout-stepper {
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.9em;
    }
    .step {
      padding: 8px 10px;
      width: auto;
      text-align: center;
    }
    .step::after {
      bottom: -10px;
    }
    .section-title {
      font-size: 1.5em;
    }
    .form-next-btn, .checkout-navigation .btn {
      width: 100%;
      margin-top: 10px; /* Jarak antar tombol di mobile */
    }
    .checkout-navigation {
      flex-direction: column;
    }
  }
  
  @media (max-width: 480px) {
    .checkout-hero-title {
      font-size: 2em;
    }
    .checkout-hero-subtitle {
      font-size: 0.8em;
    }
  }
  </style>