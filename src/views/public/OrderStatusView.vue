<template>
    <div class="order-status-view">
      <section class="status-hero">
        <div class="status-hero-content">
          <h1 class="status-hero-title">Status Pesanan Anda</h1>
          <p class="status-hero-subtitle">Pantau progres pesanan Anda secara real-time.</p>
        </div>
      </section>
  
      <section class="status-content">
        <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat pesanan Anda..." size="60px" color="#A00" />
  
        <div v-else-if="orders.length === 0" class="empty-orders">
          <i class="fas fa-box-open empty-orders-icon"></i>
          <p class="empty-orders-message">Anda belum memiliki pesanan.</p>
          <p class="empty-orders-suggestion">Mari mulai petualangan kuliner Anda! <router-link to="/menu">Pesan sekarang</router-link>.</p>
          <Button type="primary" @click="goToMenu">Lihat Menu</Button>
        </div>
  
        <div v-else class="orders-list">
          <div v-for="order in sortedOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <h3>Pesanan #{{ order.id }}</h3>
              <span :class="['order-status', getStatusClass(order.status)]">{{ formatStatus(order.status) }}</span>
            </div>
            <div class="order-body">
              <p><strong>Tanggal Pesanan:</strong> {{ formatDate(order.orderDate) }}</p>
              <p><strong>Total Harga:</strong> Rp {{ order.total.toLocaleString('id-ID') }}</p>
              <p class="order-item-count">
                Jumlah Item: {{ order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 'N/A' }}
              </p>
  
              <button class="toggle-details-btn" @click="toggleDetails(order.id)">
                {{ expandedOrderId === order.id ? 'Sembunyikan Detail' : 'Lihat Detail Item' }}
                <i :class="['fas', expandedOrderId === order.id ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </button>
  
              <div v-if="expandedOrderId === order.id" class="order-details-expanded">
                <h4>Detail Item:</h4>
                <ul class="item-list">
                  <li v-for="item in order.items" :key="item.menuId">
                    <span>{{ item.name }} x {{ item.quantity }}</span>
                    <span>Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
                  </li>
                </ul>
                <h4>Detail Pengiriman:</h4>
                <p>Nama: {{ order.delivery?.fullName }}</p>
                <p>Alamat: {{ order.delivery?.address }}</p>
                <p>Telepon: {{ order.delivery?.phone }}</p>
                <p v-if="order.delivery?.notes">Catatan: {{ order.delivery.notes }}</p>
                <p>Metode Pembayaran: {{ order.paymentMethod === 'cash' ? 'Tunai (COD)' : 'Transfer Bank' }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from '@/components/common/Button.vue';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import { useAuthStore } from '@/stores/auth'; // Untuk mendapatkan userId
  import { fetchOrdersByUserId } from '@/composables/useApi'; // Fungsi untuk mengambil pesanan user
  
  export default {
    name: 'OrderStatusView',
    components: {
      Button,
      LoadingSpinner,
    },
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
  
      const orders = ref([]); // State untuk menyimpan daftar pesanan
      const isLoading = ref(true); // State untuk loading spinner
      const expandedOrderId = ref(null); // Untuk mengontrol detail pesanan yang diperluas
  
      // Redirect jika user tidak login
      onMounted(() => {
        if (!authStore.isAuthenticated || !authStore.user?.id) {
          alert('Anda harus login untuk melihat status pesanan.');
          router.push('/auth');
          return; // Hentikan eksekusi lebih lanjut
        }
        loadUserOrders(authStore.user.id);
      });
  
      // Mengambil pesanan user dari API
      const loadUserOrders = async (userId) => {
        isLoading.value = true;
        try {
          const response = await fetchOrdersByUserId(userId);
          orders.value = response;
        } catch (error) {
          console.error('Gagal memuat pesanan:', error);
          alert('Gagal memuat daftar pesanan Anda. Silakan coba lagi nanti.');
        } finally {
          isLoading.value = false;
        }
      };
  
      // Mengurutkan pesanan dari yang terbaru
      const sortedOrders = computed(() => {
        return [...orders.value].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      });
  
      // Fungsi untuk memformat tanggal
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
      };
  
      // Fungsi untuk memformat status (misal: "baru" menjadi "Baru")
      const formatStatus = (status) => {
        if (!status) return 'Unknown';
        const statusMap = {
          'baru': 'Baru',
          'diproses': 'Diproses',
          'selesai': 'Selesai',
          'dibatalkan': 'Dibatalkan',
          'dikirim': 'Dikirim', // Contoh status tambahan
        };
        return statusMap[status.toLowerCase()] || status;
      };
  
      // Fungsi untuk menentukan kelas CSS berdasarkan status
      const getStatusClass = (status) => {
        if (!status) return '';
        switch (status.toLowerCase()) {
          case 'baru': return 'status-new';
          case 'diproses': return 'status-processing';
          case 'selesai': return 'status-completed';
          case 'dibatalkan': return 'status-cancelled';
          case 'dikirim': return 'status-shipped';
          default: return '';
        }
      };
  
      // Toggle detail pesanan
      const toggleDetails = (orderId) => {
        expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId;
      };
  
      const goToMenu = () => {
        router.push('/menu');
      };
  
      return {
        orders,
        isLoading,
        expandedOrderId,
        sortedOrders,
        formatDate,
        formatStatus,
        getStatusClass,
        toggleDetails,
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
  
  .order-status-view {
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  /* --- Status Hero Section --- */
  .status-hero {
    position: relative;
    width: 100%;
    height: 35vh; /* Tinggi hero yang ringkas */
    background-image: url('@/assets/img/status-hero-bg.jpg'); /* Ganti dengan gambar latar belakang status */
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
  
  .status-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  .status-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 20px;
  }
  
  .status-hero-title {
    font-family: var(--font-heading);
    font-size: 3em;
    margin-bottom: 10px;
    line-height: 1.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .status-hero-subtitle {
    font-size: 1.1em;
    margin-top: 0;
  }
  
  /* --- Status Content Section --- */
  .status-content {
    padding: 60px 20px;
    max-width: 900px; /* Lebar konten utama */
    margin: 0 auto;
  }
  
  /* Empty Orders State */
  .empty-orders {
    text-align: center;
    padding: 80px 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  .empty-orders-icon {
    font-size: 4em;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .empty-orders-message {
    font-size: 1.8em;
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
  }
  
  .empty-orders-suggestion {
    font-size: 1.1em;
    color: #777;
    margin-bottom: 30px;
  }
  
  .empty-orders-suggestion a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
  }
  
  .empty-orders-suggestion a:hover {
    text-decoration: underline;
  }
  
  /* Orders List */
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 25px; /* Jarak antar kartu pesanan */
  }
  
  .order-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: 25px;
    transition: transform 0.2s ease;
  }
  
  .order-card:hover {
    transform: translateY(-3px); /* Efek hover ringan */
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
  
  .order-header h3 {
    font-family: var(--font-heading);
    font-size: 1.5em;
    color: var(--primary-color);
    margin: 0;
  }
  
  .order-status {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }
  
  /* Status Colors */
  .order-status.status-new {
    background-color: #007bff; /* Biru */
  }
  .order-status.status-processing {
    background-color: #ffc107; /* Kuning */
    color: #333; /* Teks gelap untuk latar kuning */
  }
  .order-status.status-completed {
    background-color: #28a745; /* Hijau */
  }
  .order-status.status-cancelled {
    background-color: #dc3545; /* Merah */
  }
  .order-status.status-shipped {
    background-color: #17a2b8; /* Cyan */
  }
  
  .order-body p {
    margin-bottom: 8px;
    color: #555;
    font-size: 1em;
  }
  
  .order-item-count {
    font-size: 0.95em;
    color: #777;
    margin-top: 15px;
  }
  
  .toggle-details-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s ease;
  }
  
  .toggle-details-btn:hover {
    color: darken(var(--primary-color), 10%); /* Jika pakai SCSS */
    color: #800; /* Jika pakai Vanilla CSS */
  }
  
  .order-details-expanded {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed #eee;
    animation: fadeIn 0.4s ease-out; /* Animasi fade-in saat detail muncul */
  }
  
  .order-details-expanded h4 {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 10px;
  }
  
  .item-list {
    list-style: none;
    padding: 0;
    margin: 0 0 15px;
  }
  
  .item-list li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 0.95em;
    color: #444;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* --- Media Queries --- */
  @media (max-width: 768px) {
    .status-hero {
      height: 25vh;
    }
    .status-hero-title {
      font-size: 2.2em;
    }
    .status-hero-subtitle {
      font-size: 0.9em;
    }
    .status-content {
      padding: 30px 15px;
    }
    .order-card {
      padding: 20px;
    }
    .order-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    .order-header h3 {
      font-size: 1.3em;
    }
    .order-status {
      width: fit-content; /* Agar badge tidak terlalu lebar */
    }
    .toggle-details-btn {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .status-hero-title {
      font-size: 2em;
    }
    .status-hero-subtitle {
      font-size: 0.8em;
    }
    .empty-orders-message {
      font-size: 1.5em;
    }
  }
  </style>