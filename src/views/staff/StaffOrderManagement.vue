<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Manajemen Pesanan</h1>
      <p class="dashboard-subtitle">Pantau dan kelola pesanan pelanggan dari status baru hingga selesai.</p>

      <div class="top-actions">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari pesanan (ID, pelanggan)..."
          class="search-input"
        />
        <select v-model="selectedStatusFilter" class="status-filter-select">
          <option value="all">Semua Pesanan Aktif</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai (Hari Ini)</option>
          <option value="dikirim">Dikirim (Hari Ini)</option>
        </select>
      </div>

      <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat daftar pesanan..." size="60px" color="#D32F2F" />

      <p v-else-if="filteredOrders.length === 0 && !isLoading" class="no-data-message">
        {{ searchQuery || selectedStatusFilter !== 'all' ? 'Tidak ada pesanan yang ditemukan untuk kriteria ini.' : 'Belum ada pesanan aktif.' }}
      </p>

      <div v-else class="order-table-container">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Tanggal Pesanan</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in sortedOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.delivery?.fullName || 'N/A' }}</td>
                <td>{{ formatDateTime(order.orderDate) }}</td>
                <td>Rp {{ order.total.toLocaleString('id-ID') }}</td>
                <td><span :class="['status-badge', getStatusClass(order.status)]">{{ formatStatus(order.status) }}</span></td>
                <td class="action-buttons">
                  <Button type="secondary" size="small" @click="openOrderDetailModal(order)">
                    <i class="fas fa-eye"></i> Detail
                  </Button>
                  <Button
                    v-if="order.status === 'baru'"
                    type="primary"
                    size="small"
                    @click="updateOrderStatus(order.id, 'diproses')"
                    :disabled="isUpdatingOrder[order.id]"
                  >
                    <i class="fas fa-cog"></i> {{ isUpdatingOrder[order.id] ? 'Proses...' : 'Proses' }}
                  </Button>
                  <Button
                    v-else-if="order.status === 'diproses'"
                    type="primary"
                    size="small"
                    @click="updateOrderStatus(order.id, 'selesai')"
                    :disabled="isUpdatingOrder[order.id]"
                  >
                    <i class="fas fa-check"></i> {{ isUpdatingOrder[order.id] ? 'Selesai...' : 'Selesai' }}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal :isVisible="isModalOpen" :showCloseButton="true" @close="closeModal" maxWidth="700px">
        <template #header>
          <h3 class="modal-title">Detail Pesanan #{{ currentOrder.id }}</h3>
        </template>
        <template #body>
          <div class="order-detail-content">
            <div class="detail-section">
              <h4>Ringkasan Pesanan:</h4>
              <p><strong>Tanggal:</strong> {{ formatDateTime(currentOrder.orderDate) }}</p>
              <p><strong>Total:</strong> Rp {{ currentOrder.total?.toLocaleString('id-ID') }}</p>
              <p><strong>Status Saat Ini:</strong> <span :class="['status-badge', getStatusClass(currentOrder.status)]">{{ formatStatus(currentOrder.status) }}</span></p>
            </div>

            <div class="detail-section">
              <h4>Detail Pelanggan & Pengiriman:</h4>
              <p><strong>Nama:</strong> {{ currentOrder.delivery?.fullName }}</p>
              <p><strong>Telepon:</strong> {{ currentOrder.delivery?.phone }}</p>
              <p><strong>Alamat:</strong> {{ currentOrder.delivery?.address }}</p>
              <p v-if="currentOrder.delivery?.notes"><strong>Catatan:</strong> {{ currentOrder.delivery.notes }}</p>
            </div>

            <div class="detail-section">
              <h4>Item Pesanan:</h4>
              <ul class="order-items-list">
                <li v-for="item in currentOrder.items" :key="item.menuId">
                  <span>{{ item.name }} x {{ item.quantity }}</span>
                  <span>Rp {{ (item.price * item.quantity)?.toLocaleString('id-ID') }}</span>
                </li>
              </ul>
            </div>

            <div class="detail-section">
              <h4>Ubah Status Pesanan:</h4>
              <div class="form-group">
                <select id="orderStatus" v-model="currentOrder.status" class="status-select-form">
                  <option value="baru">Baru</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="dikirim">Dikirim</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="modal-actions">
            <Button type="secondary" @click="closeModal">Tutup</Button>
            <Button type="primary" :disabled="isSavingStatus" @click="updateOrderStatusFromModal">
              {{ isSavingStatus ? 'Menyimpan...' : 'Simpan Status' }}
            </Button>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Modal from '@/components/common/Modal.vue';
import { fetchAllOrders, updateOrder } from '@/composables/useApi';

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false);
const isSidebarOpen = inject('isSidebarOpen', true);
const isMobile = inject('isMobile', false);

const mainClass = computed(() => {
  return {
    'staff-order-management': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
    'sidebar-mobile-open': isSidebarOpen && isMobile,
  }
});

const authStore = useAuthStore();
const route = useRoute();

// Data state
const orders = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const selectedStatusFilter = ref('all');
const isModalOpen = ref(false);
const isSavingStatus = ref(false);
const isUpdatingOrder = reactive({});

const currentOrder = reactive({
  id: null,
  delivery: { fullName: '', phone: '', address: '', notes: '' },
  items: [],
  total: 0,
  status: '',
  orderDate: '',
  paymentMethod: '',
});

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter by status
  if (selectedStatusFilter.value !== 'all') {
    if (selectedStatusFilter.value === 'selesai' || selectedStatusFilter.value === 'dikirim') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return order.status.toLowerCase() === selectedStatusFilter.value.toLowerCase() &&
               orderDate.getDate() === today.getDate() &&
               orderDate.getMonth() === today.getMonth() &&
               orderDate.getFullYear() === today.getFullYear();
      });
    } else {
      filtered = filtered.filter(order => order.status.toLowerCase() === selectedStatusFilter.value.toLowerCase());
    }
  } else {
    filtered = filtered.filter(order => ['baru', 'diproses', 'dikirim'].includes(order.status.toLowerCase()));
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.id.toString().includes(query) ||
      (order.delivery?.fullName?.toLowerCase().includes(query) || '') ||
      order.orderDate.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const sortedOrders = computed(() => {
  const orderPriorities = { 'baru': 1, 'diproses': 2, 'dikirim': 3 };
  return [...filteredOrders.value].sort((a, b) => {
    const priorityA = orderPriorities[a.status.toLowerCase()] || 99;
    const priorityB = orderPriorities[b.status.toLowerCase()] || 99;
    return priorityA !== priorityB ? priorityA - priorityB : new Date(a.orderDate) - new Date(b.orderDate);
  });
});

// Methods
const loadOrders = async () => {
  isLoading.value = true;
  try {
    orders.value = await fetchAllOrders();
    checkRouteForOrder();
  } catch (error) {
    console.error('Gagal memuat pesanan:', error);
    alert('Gagal memuat daftar pesanan. Silakan coba lagi nanti.');
  } finally {
    isLoading.value = false;
  }
};

const checkRouteForOrder = () => {
  if (route.query.id && orders.value.length > 0) {
    const orderToOpen = orders.value.find(order => order.id.toString() === route.query.id);
    if (orderToOpen) openOrderDetailModal(orderToOpen);
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleDateString('id-ID', options);
};

const formatStatus = (status) => {
  const statusMap = {
    'baru': 'Baru', 'diproses': 'Diproses', 'selesai': 'Selesai', 
    'dikirim': 'Dikirim', 'dibatalkan': 'Dibatalkan',
  };
  return statusMap[status?.toLowerCase()] || status || 'Unknown';
};

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'baru': return 'status-new';
    case 'diproses': return 'status-processing';
    case 'selesai': return 'status-completed';
    case 'dikirim': return 'status-shipped';
    case 'dibatalkan': return 'status-cancelled';
    default: return '';
  }
};

const openOrderDetailModal = (orderItem) => {
  Object.assign(currentOrder, { ...orderItem });
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetCurrentOrder();
};

const resetCurrentOrder = () => {
  Object.assign(currentOrder, {
    id: null,
    delivery: { fullName: '', phone: '', address: '', notes: '' },
    items: [],
    total: 0,
    status: '',
    orderDate: '',
    paymentMethod: '',
  });
};

const updateOrderStatus = async (orderId, newStatus) => {
  isUpdatingOrder[orderId] = true;
  try {
    await updateOrder(orderId, { status: newStatus });
    await loadOrders();
  } catch (error) {
    console.error('Gagal memperbarui status pesanan:', error);
    alert('Gagal memperbarui status. Silakan coba lagi.');
  } finally {
    isUpdatingOrder[orderId] = false;
  }
};

const updateOrderStatusFromModal = async () => {
  isSavingStatus.value = true;
  try {
    await updateOrder(currentOrder.id, { status: currentOrder.status });
    await loadOrders();
    closeModal();
  } catch (error) {
    console.error('Gagal memperbarui status pesanan:', error);
    alert('Gagal memperbarui status. Silakan coba lagi.');
  } finally {
    isSavingStatus.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.staff-order-management {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.staff-order-management.sidebar-collapsed {
  margin-left: 80px;
}

.staff-order-management.sidebar-expanded {
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

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.search-input {
  flex-grow: 1;
  max-width: 300px;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  outline: none;
}

.status-filter-select {
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  background-color: white;
  cursor: pointer;
}

.status-filter-select:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  outline: none;
}

.no-data-message {
  text-align: center;
  color: #777;
  padding: 50px 0;
  font-style: italic;
  font-size: 1.2em;
}

.order-table-container {
  margin-top: 20px;
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
.status-processing { background-color: #ffa000; color: #333; }
.status-completed { background-color: #388e3c; }
.status-shipped { background-color: #0288d1; }
.status-cancelled { background-color: #d32f2f; }

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8em;
  color: #d32f2f;
  margin: 0 0 20px 0;
  text-align: center;
}

.order-detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
}

.order-detail-content h4 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 15px;
}

.order-detail-content p {
  margin-bottom: 8px;
  color: #555;
}

.order-detail-content strong {
  color: #333;
}

.order-items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.order-items-list li:last-child {
  border-bottom: none;
}

.status-select-form {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.status-select-form:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .staff-order-management {
    padding: 20px;
    margin-left: 0 !important;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .top-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-input,
  .status-filter-select {
    max-width: 100%;
    width: 100%;
  }
  
  table thead th,
  table tbody td {
    padding: 10px 15px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>