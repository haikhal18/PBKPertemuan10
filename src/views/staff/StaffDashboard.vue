<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Dashboard Karyawan</h1>
      <p class="dashboard-subtitle">Selamat datang kembali, {{ authStore.user?.username || 'Karyawan' }}! Berikut ringkasan tugas Anda.</p>

      <div class="stats-grid">
        <div class="stat-card">
          <i class="fas fa-clipboard-list stat-icon"></i>
          <div class="stat-info">
            <h3>Pesanan Baru</h3>
            <p class="stat-value">{{ dashboardData.newOrdersCount }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-hourglass-half stat-icon"></i>
          <div class="stat-info">
            <h3>Pesanan Diproses</h3>
            <p class="stat-value">{{ dashboardData.processingOrdersCount }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-calendar-check stat-icon"></i>
          <div class="stat-info">
            <h3>Reservasi Hari Ini</h3>
            <p class="stat-value">{{ dashboardData.todayReservationsCount }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-check-circle stat-icon"></i>
          <div class="stat-info">
            <h3>Pesanan Selesai (Hari Ini)</h3>
            <p class="stat-value">{{ dashboardData.completedTodayOrdersCount }}</p>
          </div>
        </div>
      </div>

      <div class="dashboard-sections">
        <div class="pending-orders card-section">
          <div class="section-header">
            <h2>Pesanan Perlu Penanganan</h2>
            <router-link to="/staff/order-management" class="view-all-link">Lihat Semua Pesanan <i class="fas fa-arrow-right"></i></router-link>
          </div>
          <LoadingSpinner v-if="isLoadingOrders" :isLoading="isLoadingOrders" message="Memuat pesanan..." size="40px" color="#D32F2F" />
          <p v-else-if="pendingOrders.length === 0" class="no-data-message">Tidak ada pesanan baru atau yang sedang diproses.</p>
          <div v-else class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in pendingOrders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.delivery?.fullName || 'N/A' }}</td>
                  <td>{{ formatDateTime(order.orderDate) }}</td>
                  <td><span :class="['status-badge', getStatusClass(order.status)]">{{ formatStatus(order.status) }}</span></td>
                  <td class="action-buttons">
                    <Button type="secondary" size="small" @click="viewOrderDetails(order.id)">
                      <i class="fas fa-eye"></i> Detail
                    </Button>
                    <Button
                      v-if="order.status === 'baru'"
                      type="primary"
                      size="small"
                      @click="updateOrderStatus(order.id, 'diproses')"
                      :disabled="isUpdatingOrder[order.id]"
                    >
                      <i class="fas fa-cog"></i> {{ isUpdatingOrder[order.id] ? 'Proses..' : 'Proses' }}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="today-reservations card-section">
          <div class="section-header">
            <h2>Reservasi Hari Ini</h2>
            <router-link to="/admin/reservation-management" class="view-all-link">Lihat Semua Reservasi <i class="fas fa-arrow-right"></i></router-link>
          </div>
          <LoadingSpinner v-if="isLoadingReservations" :isLoading="isLoadingReservations" message="Memuat reservasi..." size="40px" color="#D32F2F" />
          <p v-else-if="todayReservations.length === 0" class="no-data-message">Tidak ada reservasi untuk hari ini.</p>
          <div v-else class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pemesan</th>
                  <th>Waktu</th>
                  <th>Tamu</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="res in todayReservations" :key="res.id">
                  <td>#{{ res.id }}</td>
                  <td>{{ res.fullName }}</td>
                  <td>{{ formatTime(res.dateTime) }}</td>
                  <td>{{ res.guests }}</td>
                  <td><span :class="['status-badge', getReservationStatusClass(res.status)]">{{ formatReservationStatus(res.status) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, inject } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { fetchAllOrders, updateOrder, fetchAllReservations } from '@/composables/useApi';

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false);
const isSidebarOpen = inject('isSidebarOpen', true);
const isMobile = inject('isMobile', false);

const mainClass = computed(() => {
  return {
    'staff-dashboard': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
    'sidebar-mobile-open': isSidebarOpen && isMobile,
  }
});

const authStore = useAuthStore();
const router = useRouter();

const dashboardData = reactive({
  newOrdersCount: 0,
  processingOrdersCount: 0,
  todayReservationsCount: 0,
  completedTodayOrdersCount: 0,
});

const allOrders = ref([]);
const allReservations = ref([]);

const isLoading = ref(true);
const isLoadingOrders = ref(true);
const isLoadingReservations = ref(true);

const isUpdatingOrder = reactive({});

const pendingOrders = computed(() => {
  return allOrders.value
    .filter(order => ['baru', 'diproses'].includes(order.status.toLowerCase()))
    .sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate))
    .slice(0, 5);
});

const todayReservations = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  return allReservations.value
    .filter(res => {
      const resDateTime = new Date(res.dateTime);
      return resDateTime >= today && resDateTime <= endOfToday && res.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, 5);
});

const loadStaffDashboardData = async () => {
  isLoading.value = true;
  isLoadingOrders.value = true;
  isLoadingReservations.value = true;

  try {
    allOrders.value = await fetchAllOrders();
    allReservations.value = await fetchAllReservations();

    // Hitung statistik dashboard
    dashboardData.newOrdersCount = allOrders.value.filter(order => order.status === 'baru').length;
    dashboardData.processingOrdersCount = allOrders.value.filter(order => order.status === 'diproses').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    dashboardData.todayReservationsCount = allReservations.value.filter(res => {
      const resDateTime = new Date(res.dateTime);
      return resDateTime >= today && resDateTime <= endOfToday && res.status !== 'cancelled';
    }).length;

    dashboardData.completedTodayOrdersCount = allOrders.value.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear() &&
            order.status === 'selesai';
    }).length;

  } catch (error) {
    console.error('Gagal memuat data dashboard karyawan:', error);
    alert('Gagal memuat data dashboard. Silakan coba lagi nanti.');
  } finally {
    isLoading.value = false;
    isLoadingOrders.value = false;
    isLoadingReservations.value = false;
  }
};

const viewOrderDetails = (orderId) => {
  router.push(`/staff/order-management?id=${orderId}`);
};

const updateOrderStatus = async (orderId, newStatus) => {
  isUpdatingOrder[orderId] = true;
  try {
    await updateOrder(orderId, { status: newStatus });
    await loadStaffDashboardData();
  } catch (error) {
    console.error('Gagal memperbarui status pesanan:', error);
    alert('Gagal memperbarui status. Silakan coba lagi.');
  } finally {
    isUpdatingOrder[orderId] = false;
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleDateString('id-ID', options);
};

const formatTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleTimeString('id-ID', options);
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  const statusMap = {
    'baru': 'Baru', 'diproses': 'Diproses', 'selesai': 'Selesai', 'dikirim': 'Dikirim', 'dibatalkan': 'Dibatalkan',
  };
  return statusMap[status.toLowerCase()] || status;
};

const getStatusClass = (status) => {
  if (!status) return '';
  switch (status.toLowerCase()) {
    case 'baru': return 'status-new';
    case 'diproses': return 'status-processing';
    case 'selesai': return 'status-completed';
    case 'dikirim': return 'status-shipped';
    case 'dibatalkan': return 'status-cancelled';
    default: return '';
  }
};

const formatReservationStatus = (status) => {
  if (!status) return 'Unknown';
  const statusMap = {
    'pending': 'Pending', 'confirmed': 'Dikonfirmasi', 'cancelled': 'Dibatalkan', 'completed': 'Selesai',
  };
  return statusMap[status.toLowerCase()] || status;
};

const getReservationStatusClass = (status) => {
  if (!status) return '';
  switch (status.toLowerCase()) {
    case 'pending': return 'status-pending';
    case 'confirmed': return 'status-confirmed';
    case 'cancelled': return 'status-cancelled';
    case 'completed': return 'status-completed';
    default: return '';
  }
};

onMounted(() => {
  loadStaffDashboardData();
});
</script>

<style scoped>
.staff-dashboard {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.staff-dashboard.sidebar-collapsed {
  margin-left: 80px;
}

.staff-dashboard.sidebar-expanded {
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2.8em;
  color: #d32f2f;
  opacity: 0.8;
}

.stat-info h3 {
  margin: 0 0 5px;
  font-size: 1.1em;
  color: #666;
}

.stat-value {
  font-family: 'Open Sans', sans-serif;
  font-size: 2.2em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.dashboard-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.card-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
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
  padding: 50px 0;
  font-style: italic;
  font-size: 1.2em;
}

.table-responsive {
  width: 100%;
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
  border-bottom: 2px solid #d32f2f;
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
  background-color: #fff5f5;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  display: inline-block;
}

.status-new { background-color: #1976d2; }
.status-processing { background-color: #ffa000; }
.status-completed { background-color: #388e3c; }
.status-shipped { background-color: #0288d1; }
.status-cancelled { background-color: #d32f2f; }
.status-pending { background-color: #ffa000; }
.status-confirmed { background-color: #388e3c; }

@media (min-width: 992px) {
  .dashboard-sections {
    display: grid;
    grid-template-columns: 1fr;
  }
  
  .card-section {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .staff-dashboard {
    padding: 20px;
    margin-left: 0 !important;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .section-header h2 {
    font-size: 1.5em;
  }
  
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
}
</style>