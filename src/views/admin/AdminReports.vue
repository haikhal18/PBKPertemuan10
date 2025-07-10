<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Laporan & Statistik</h1>
      <p class="dashboard-subtitle">Analisis data operasional restoran Anda.</p>

      <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat laporan..." size="60px" color="#A00" />

      <div v-else class="reports-container">
        <div class="report-card sales-summary-report card-section">
          <h2 class="section-header">Ringkasan Penjualan</h2>
          <div class="report-filters">
            <label for="salesPeriod">Periode Laporan:</label>
            <select id="salesPeriod" v-model="selectedSalesPeriod" @change="calculateSalesSummary">
              <option value="daily">Harian (Hari Ini)</option>
              <option value="weekly">Mingguan (7 Hari Terakhir)</option>
              <option value="monthly">Bulanan (Bulan Ini)</option>
              <option value="yearly">Tahunan (Tahun Ini)</option>
              <option value="all">Semua Waktu</option>
            </select>
          </div>

          <div class="summary-grid">
            <div class="summary-item">
              <h3>Total Pendapatan</h3>
              <p class="value">Rp {{ salesSummary.totalRevenue.toLocaleString('id-ID') }}</p>
            </div>
            <div class="summary-item">
              <h3>Jumlah Pesanan</h3>
              <p class="value">{{ salesSummary.totalOrders }}</p>
            </div>
            <div class="summary-item">
              <h3>Rata-rata Pesanan</h3>
              <p class="value">Rp {{ salesSummary.averageOrderValue.toLocaleString('id-ID') }}</p>
            </div>
            <div class="summary-item">
              <h3>Item Terjual</h3>
              <p class="value">{{ salesSummary.totalItemsSold }}</p>
            </div>
          </div>
        </div>

        <div class="report-card top-menu-report card-section">
          <h2 class="section-header">5 Menu Terlaris</h2>
          <LoadingSpinner v-if="isLoadingTopMenus" :isLoading="isLoadingTopMenus" message="Memuat data..." size="30px" color="#555" />
          <p v-else-if="topSellingMenus.length === 0" class="no-data-message">Belum ada data menu terlaris.</p>
          <div v-else class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Nama Menu</th>
                  <th>Terjual</th>
                  <th>Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(menu, index) in topSellingMenus" :key="menu.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ menu.name }}</td>
                  <td>{{ menu.soldQuantity }}</td>
                  <td>Rp {{ menu.revenue.toLocaleString('id-ID') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="report-card order-status-report card-section">
          <h2 class="section-header">Statistik Status Pesanan</h2>
          <LoadingSpinner v-if="isLoadingStatus" :isLoading="isLoadingStatus" message="Memuat data..." size="30px" color="#555" />
          <p v-else-if="Object.keys(orderStatusSummary).length === 0" class="no-data-message">Belum ada data status pesanan.</p>
          <div v-else class="status-summary-grid">
            <div v-for="(count, status) in orderStatusSummary" :key="status" class="status-item">
              <span :class="['status-circle', getStatusClass(status)]"></span>
              <div class="status-info">
                <h3>{{ formatStatus(status) }}</h3>
                <p class="value">{{ count }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="report-card user-role-report card-section">
          <h2 class="section-header">Pengguna Berdasarkan Role</h2>
          <LoadingSpinner v-if="isLoadingUsers" :isLoading="isLoadingUsers" message="Memuat data..." size="30px" color="#555" />
          <p v-else-if="Object.keys(userRoleSummary).length === 0" class="no-data-message">Belum ada data pengguna.</p>
          <div v-else class="status-summary-grid">
            <div v-for="(count, role) in userRoleSummary" :key="role" class="status-item">
              <span :class="['status-circle', getRoleClass(role)]"></span>
              <div class="status-info">
                <h3>{{ formatRole(role) }}</h3>
                <p class="value">{{ count }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, computed, inject } from 'vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Button from '@/components/common/Button.vue';
import { fetchAllOrders, fetchAllMenus, fetchAllUsers } from '@/composables/useApi';

export default {
  name: 'AdminReports',
  components: {
    LoadingSpinner,
    Button,
  },
  setup() {
    // Sidebar status
    const isSidebarCollapsed = inject('isSidebarCollapsed', false)
    const isSidebarOpen = inject('isSidebarOpen', true)
    const isMobile = inject('isMobile', false)

    const mainClass = computed(() => {
      return {
        'admin-reports': true,
        'sidebar-collapsed': isSidebarCollapsed && !isMobile,
        'sidebar-expanded': !isSidebarCollapsed && !isMobile,
        'sidebar-mobile-open': isSidebarOpen && isMobile,
      }
    })

    const isLoading = ref(true);
    const isLoadingTopMenus = ref(true);
    const isLoadingStatus = ref(true);
    const isLoadingUsers = ref(true);

    const allOrders = ref([]);
    const allMenus = ref([]);
    const allUsers = ref([]);

    const selectedSalesPeriod = ref('monthly');
    const salesSummary = reactive({
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      totalItemsSold: 0,
    });

    const topSellingMenus = ref([]);
    const orderStatusSummary = reactive({});
    const userRoleSummary = reactive({});

    const getStartDateForPeriod = (period) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      switch (period) {
        case 'daily':
          return now;
        case 'weekly':
          return new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)));
        case 'monthly':
          return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'yearly':
          return new Date(now.getFullYear(), 0, 1);
        case 'all':
        default:
          return new Date(0);
      }
    };

    const calculateSalesSummary = () => {
      isLoading.value = true;
      const startDate = getStartDateForPeriod(selectedSalesPeriod.value);
      const relevantOrders = allOrders.value.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && order.status === 'selesai';
      });

      salesSummary.totalRevenue = relevantOrders.reduce((sum, order) => sum + order.total, 0);
      salesSummary.totalOrders = relevantOrders.length;
      salesSummary.averageOrderValue = relevantOrders.length > 0 ? salesSummary.totalRevenue / relevantOrders.length : 0;
      salesSummary.totalItemsSold = relevantOrders.reduce((sum, order) => {
        return sum + (order.items ? order.items.reduce((itemSum, item) => itemSum + item.quantity, 0) : 0);
      }, 0);
      isLoading.value = false;
    };

    const calculateTopSellingMenus = () => {
      isLoadingTopMenus.value = true;
      const menuSales = {};

      allOrders.value.forEach(order => {
        if (order.status === 'selesai' && order.items) {
          order.items.forEach(item => {
            if (!menuSales[item.menuId]) {
              menuSales[item.menuId] = {
                id: item.menuId,
                name: item.name,
                soldQuantity: 0,
                revenue: 0,
              };
            }
            menuSales[item.menuId].soldQuantity += item.quantity;
            menuSales[item.menuId].revenue += item.price * item.quantity;
          });
        }
      });

      topSellingMenus.value = Object.values(menuSales)
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, 5);
      isLoadingTopMenus.value = false;
    };

    const calculateOrderStatusSummary = () => {
      isLoadingStatus.value = true;
      const statusCounts = {};
      allOrders.value.forEach(order => {
        const status = order.status.toLowerCase();
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      Object.keys(orderStatusSummary).forEach(key => delete orderStatusSummary[key]);
      Object.assign(orderStatusSummary, statusCounts);
      isLoadingStatus.value = false;
    };

    const calculateUserRoleSummary = () => {
      isLoadingUsers.value = true;
      const roleCounts = {};
      allUsers.value.forEach(user => {
        const role = user.role.toLowerCase();
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      Object.keys(userRoleSummary).forEach(key => delete userRoleSummary[key]);
      Object.assign(userRoleSummary, roleCounts);
      isLoadingUsers.value = false;
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatStatus = (status) => {
      if (!status) return 'Unknown';
      const statusMap = {
        'baru': 'Baru', 'diproses': 'Diproses', 'selesai': 'Selesai', 'dibatalkan': 'Dibatalkan', 'dikirim': 'Dikirim', 'pending': 'Pending', 'confirmed': 'Dikonfirmasi', 'completed': 'Selesai'
      };
      return statusMap[status.toLowerCase()] || status;
    };

    const getStatusClass = (status) => {
      if (!status) return '';
      switch (status.toLowerCase()) {
        case 'baru': case 'pending': return 'status-new';
        case 'diproses': return 'status-processing';
        case 'selesai': case 'confirmed': case 'completed': return 'status-completed';
        case 'dibatalkan': return 'status-cancelled';
        case 'dikirim': return 'status-shipped';
        default: return '';
      }
    };

    const formatRole = (role) => {
      if (!role) return 'Unknown';
      const roleMap = {
        'admin': 'Admin', 'karyawan': 'Karyawan', 'user': 'Pengguna',
      };
      return roleMap[role.toLowerCase()] || role;
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

    const loadAllInitialData = async () => {
      isLoading.value = true;
      try {
        allOrders.value = await fetchAllOrders();
        allMenus.value = await fetchAllMenus();
        allUsers.value = await fetchAllUsers();

        calculateSalesSummary();
        calculateTopSellingMenus();
        calculateOrderStatusSummary();
        calculateUserRoleSummary();

      } catch (error) {
        console.error('Gagal memuat semua data awal untuk laporan:', error);
        alert('Gagal memuat semua data yang dibutuhkan untuk laporan. Silakan coba lagi nanti.');
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadAllInitialData();
    });

    return {
      mainClass,
      isLoading,
      isLoadingTopMenus,
      isLoadingStatus,
      isLoadingUsers,
      selectedSalesPeriod,
      salesSummary,
      topSellingMenus,
      orderStatusSummary,
      userRoleSummary,
      calculateSalesSummary,
      formatDate,
      formatStatus,
      getStatusClass,
      formatRole,
      getRoleClass,
    };
  },
};
</script>

<style scoped>
.admin-reports {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.admin-reports.sidebar-collapsed {
  margin-left: 80px;
}

.admin-reports.sidebar-expanded {
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

.reports-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.report-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

.section-header {
  font-family: 'Playfair Display', serif;
  font-size: 2em;
  color: #d32f2f;
  margin-top: 0;
  margin-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
}

.report-filters {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.report-filters label {
  font-weight: 600;
  color: #555;
}

.report-filters select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  background-color: white;
  cursor: pointer;
}

.report-filters select:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-item {
  background-color: #fcfcfc;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.summary-item h3 {
  font-size: 1.1em;
  color: #666;
  margin-top: 0;
  margin-bottom: 10px;
}

.summary-item .value {
  font-size: 2em;
  font-weight: bold;
  color: #d32f2f;
  margin: 0;
}

.no-data-message {
  text-align: center;
  color: #777;
  padding: 30px 0;
  font-style: italic;
  font-size: 1.1em;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
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
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
  color: #444;
}

table tbody tr:last-child td {
  border-bottom: none;
}

table tbody tr:hover {
  background-color: #fafafa;
}

.status-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #fcfcfc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.status-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-info h3 {
  font-size: 1em;
  color: #666;
  margin: 0 0 5px;
}

.status-info .value {
  font-size: 1.6em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.status-new { background-color: #007bff; }
.status-processing { background-color: #ffc107; }
.status-completed { background-color: #28a745; }
.status-cancelled { background-color: #dc3545; }
.status-shipped { background-color: #17a2b8; }

.role-admin { background-color: #a00; }
.role-staff { background-color: #20c997; }
.role-user { background-color: #6c757d; }

@media (max-width: 768px) {
  .admin-reports {
    margin-left: 0 !important;
    padding: 20px;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .report-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .section-header {
    font-size: 1.5em;
  }
  
  .summary-grid,
  .status-summary-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  table thead th,
  table tbody td {
    padding: 10px 15px;
  }
}
</style>