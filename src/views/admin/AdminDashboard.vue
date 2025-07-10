<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Dashboard Admin</h1>
      <p class="dashboard-subtitle">Selamat datang kembali, {{ authStore.user?.username || 'Admin' }}! Berikut ringkasan aktivitas terkini.</p>

      <!-- Stats Cards - Horizontal Layout -->
      <div class="stats-grid">
        <div class="stat-card">
          <i class="fas fa-utensils stat-icon"></i>
          <div class="stat-info">
            <h3>Total Menu</h3>
            <p class="stat-value">{{ dashboardData.totalMenus }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-users stat-icon"></i>
          <div class="stat-info">
            <h3>Total Pengguna</h3>
            <p class="stat-value">{{ dashboardData.totalUsers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-clipboard-list stat-icon"></i>
          <div class="stat-info">
            <h3>Pesanan Baru</h3>
            <p class="stat-value">{{ dashboardData.newOrdersCount }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-money-bill-wave stat-icon"></i>
          <div class="stat-info">
            <h3>Total Pendapatan (Bln Ini)</h3>
            <p class="stat-value">Rp {{ dashboardData.monthlyRevenue.toLocaleString('id-ID') }}</p>
          </div>
        </div>
      </div>

      <!-- Latest Orders Section -->
      <div class="card-section">
        <div class="section-header">
          <h2>Pesanan Terbaru</h2>
          <router-link to="/admin/order-management" class="view-all-link">Lihat Semua Pesanan <i class="fas fa-arrow-right"></i></router-link>
        </div>
        <LoadingSpinner v-if="isLoadingOrders" :isLoading="isLoadingOrders" message="Memuat pesanan..." size="40px" color="#555" />
        <p v-else-if="latestOrders.length === 0" class="no-data-message">Tidak ada pesanan terbaru.</p>
        <div v-else class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in latestOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.delivery?.fullName || 'N/A' }}</td>
                <td>{{ formatDate(order.orderDate) }}</td>
                <td>Rp {{ order.total.toLocaleString('id-ID') }}</td>
                <td><span :class="['order-status-badge', getStatusClass(order.status)]">{{ formatStatus(order.status) }}</span></td>
                <td>
                  <Button type="secondary" size="small" @click="viewOrderDetails(order.id)">Detail</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Latest Users Section -->
      <div class="card-section">
        <div class="section-header">
          <h2>Pengguna Terbaru</h2>
          <router-link to="/admin/user-management" class="view-all-link">Lihat Semua Pengguna <i class="fas fa-arrow-right"></i></router-link>
        </div>
        <LoadingSpinner v-if="isLoadingUsers" :isLoading="isLoadingUsers" message="Memuat pengguna..." size="40px" color="#555" />
        <p v-else-if="latestUsers.length === 0" class="no-data-message">Tidak ada pengguna terbaru.</p>
        <div v-else class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in latestUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td><span :class="['role-badge', getRoleClass(user.role)]">{{ user.role }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { fetchAllOrders, fetchAllUsers, fetchAllMenus } from '@/composables/useApi';

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false);
const isSidebarOpen = inject('isSidebarOpen', true);
const isMobile = inject('isMobile', false);

const mainClass = computed(() => {
  return {
    'admin-dashboard': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
    'sidebar-mobile-open': isSidebarOpen && isMobile,
  }
});

const authStore = useAuthStore();
const router = useRouter();

const dashboardData = reactive({
  totalMenus: 0,
  totalUsers: 0,
  newOrdersCount: 0,
  monthlyRevenue: 0,
});

const latestOrders = ref([]);
const latestUsers = ref([]);

const isLoadingOrders = ref(true);
const isLoadingUsers = ref(true);
const isLoadingStats = ref(true);

const loadDashboardData = async () => {
  isLoadingStats.value = true;
  isLoadingOrders.value = true;
  isLoadingUsers.value = true;

  try {
    const menus = await fetchAllMenus();
    dashboardData.totalMenus = menus.length;

    const users = await fetchAllUsers();
    dashboardData.totalUsers = users.length;
    latestUsers.value = users.filter(u => u.role !== 'admin').sort((a,b) => b.id - a.id).slice(0, 5);
    isLoadingUsers.value = false;

    const orders = await fetchAllOrders();
    dashboardData.newOrdersCount = orders.filter(order => order.status === 'baru').length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    dashboardData.monthlyRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear && order.status === 'selesai';
      })
      .reduce((sum, order) => sum + order.total, 0);

    latestOrders.value = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
    isLoadingOrders.value = false;

  } catch (error) {
    console.error('Gagal memuat data dashboard:', error);
    alert('Gagal memuat data dashboard. Silakan coba lagi.');
  } finally {
    isLoadingStats.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  const statusMap = {
    'baru': 'Baru', 'diproses': 'Diproses', 'selesai': 'Selesai', 'dibatalkan': 'Dibatalkan', 'dikirim': 'Dikirim',
  };
  return statusMap[status.toLowerCase()] || status;
};

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

const getRoleClass = (role) => {
    if (!role) return '';
    switch (role.toLowerCase()) {
        case 'admin': return 'role-admin';
        case 'karyawan': return 'role-staff';
        case 'user': return 'role-user';
        default: return '';
    }
};

const viewOrderDetails = (orderId) => {
  router.push(`/admin/order-management?id=${orderId}`);
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.admin-dashboard {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.admin-dashboard.sidebar-collapsed {
  margin-left: 80px;
}

.admin-dashboard.sidebar-expanded {
  margin-left: 250px;
}

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 30px;
}

.dashboard-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  color: #d32f2f;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.stats-grid {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  min-width: 220px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2em;
  color: #d32f2f;
  opacity: 0.9;
}

.stat-info h3 {
  margin: 0 0 5px;
  font-size: 1em;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 1.8em;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.card-section {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.section-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8em;
  color: #d32f2f;
  margin: 0;
}

.view-all-link {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 0.95em;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s ease;
}

.view-all-link:hover {
  color: #d32f2f;
}

.no-data-message {
  text-align: center;
  color: #777;
  padding: 30px 0;
  font-style: italic;
  font-size: 1.1em;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
}

table thead th {
  background-color: #f5f5f5;
  text-align: left;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  color: #555;
}

table tbody td {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  color: #444;
}

table tbody tr:last-child td {
  border-bottom: none;
}

table tbody tr:hover {
  background-color: #fafafa;
}

.order-status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
  display: inline-block;
}

.status-new { background-color: #1976d2; }
.status-processing { background-color: #ff9800; color: #333; }
.status-completed { background-color: #4caf50; }
.status-cancelled { background-color: #f44336; }
.status-shipped { background-color: #00acc1; }

.role-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
  display: inline-block;
}

.role-admin { background-color: #d32f2f; }
.role-staff { background-color: #009688; }
.role-user { background-color: #607d8b; }

@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    display: grid;
  }
  
  .stat-card {
  /* Ukuran saat ini */
  min-width: 220px; /* Ubah nilai ini untuk memperkecil lebar minimum */
  padding: 10px; /* Kurangi padding untuk memperkecil ukuran */
}
}

@media (max-width: 768px) {
  .admin-dashboard {
    margin-left: 0 !important;
    padding: 20px;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  table th, table td {
    padding: 10px 15px;
  }
}
</style>