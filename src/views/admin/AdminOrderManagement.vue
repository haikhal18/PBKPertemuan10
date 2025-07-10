<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Manajemen Pesanan</h1>
      <p class="dashboard-subtitle">Kelola dan pantau semua pesanan yang masuk ke restoran Anda.</p>

      <div class="top-actions">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari pesanan (ID, pelanggan)..."
          class="search-input"
        />
        <select v-model="selectedStatusFilter" class="status-filter-select">
          <option value="all">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
          <option value="dikirim">Dikirim</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat daftar pesanan..." size="60px" color="#A00" />

      <p v-else-if="filteredOrders.length === 0 && !isLoading" class="no-data-message">
        {{ searchQuery || selectedStatusFilter !== 'all' ? 'Tidak ada pesanan yang ditemukan untuk kriteria ini.' : 'Belum ada pesanan.' }}
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
                <td><span :class="['order-status-badge', getStatusClass(order.status)]">{{ formatStatus(order.status) }}</span></td>
                <td>
                  <Button type="secondary" size="small" @click="openOrderDetailModal(order)">
                    <i class="fas fa-info-circle"></i> Detail
                  </Button>
                  <Button type="danger" size="small" @click="confirmDelete(order.id)">
                    <i class="fas fa-trash-alt"></i> Hapus
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
            <h4>Informasi Pelanggan</h4>
            <p><strong>Nama:</strong> {{ currentOrder.delivery.fullName }}</p>
            <p><strong>Telepon:</strong> {{ currentOrder.delivery.phone || 'N/A' }}</p>
            <p><strong>Alamat:</strong> {{ currentOrder.delivery.address || 'N/A' }}</p>
            <p><strong>Catatan:</strong> {{ currentOrder.delivery.notes || 'Tidak ada catatan' }}</p>

            <h4>Detail Pesanan</h4>
            <ul class="order-items-list">
              <li v-for="(item, index) in currentOrder.items" :key="index">
                <span>{{ item.quantity }}x {{ item.name }}</span>
                <span>Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
              </li>
            </ul>
            <p><strong>Total:</strong> Rp {{ currentOrder.total.toLocaleString('id-ID') }}</p>
            <p><strong>Metode Pembayaran:</strong> {{ currentOrder.paymentMethod || 'N/A' }}</p>
            <p><strong>Tanggal Pesanan:</strong> {{ formatDateTime(currentOrder.orderDate) }}</p>

            <h4>Status Pesanan</h4>
            <form @submit.prevent="updateOrderStatus">
              <select v-model="currentOrder.status" class="status-select-form">
                <option value="baru">Baru</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="dikirim">Dikirim</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
              <div class="modal-actions">
                <Button type="secondary" @click="closeModal">Tutup</Button>
                <Button type="primary" :disabled="isSavingStatus">
                  {{ isSavingStatus ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch, inject } from 'vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Modal from '@/components/common/Modal.vue'
import { fetchAllOrders, updateOrder, deleteOrder } from '@/composables/useApi'
import { useRoute } from 'vue-router'

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false)
const isSidebarOpen = inject('isSidebarOpen', true)
const isMobile = inject('isMobile', false)

const mainClass = computed(() => {
  return {
    'admin-order-management': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
    'sidebar-mobile-open': isSidebarOpen && isMobile,
  }
})

const route = useRoute()
const orders = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedStatusFilter = ref('all')

const isModalOpen = ref(false)
const currentOrder = reactive({
  id: null,
  delivery: { fullName: '', phone: '', address: '', notes: '' },
  items: [],
  total: 0,
  status: '',
  orderDate: '',
  paymentMethod: '',
})
const isSavingStatus = ref(false)

const filteredOrders = computed(() => {
  let filtered = orders.value

  if (selectedStatusFilter.value !== 'all') {
    filtered = filtered.filter(order => 
      order?.status?.toLowerCase() === selectedStatusFilter.value.toLowerCase()
    )
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => {
      if (!order) return false
      
      const idMatch = order.id?.toString().toLowerCase().includes(query) || false
      const nameMatch = order.delivery?.fullName?.toLowerCase().includes(query) || false
      const dateMatch = order.orderDate?.toLowerCase().includes(query) || false
      
      return idMatch || nameMatch || dateMatch
    })
  }
  
  return filtered
})

const sortedOrders = computed(() => {
  return [...filteredOrders.value].sort((a, b) => {
    const dateA = a.orderDate ? new Date(a.orderDate) : 0
    const dateB = b.orderDate ? new Date(b.orderDate) : 0
    return dateB - dateA
  })
})

const loadOrders = async () => {
  isLoading.value = true
  try {
    orders.value = await fetchAllOrders()
  } catch (error) {
    console.error('Gagal memuat pesanan:', error)
    alert('Gagal memuat daftar pesanan. Silakan coba lagi nanti.')
  } finally {
    isLoading.value = false
  }
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A'
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateTimeString).toLocaleDateString('id-ID', options)
  } catch {
    return dateTimeString
  }
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  const statusMap = {
    'baru': 'Baru', 
    'diproses': 'Diproses', 
    'selesai': 'Selesai', 
    'dikirim': 'Dikirim', 
    'dibatalkan': 'Dibatalkan',
  }
  return statusMap[status.toLowerCase()] || status
}

const getStatusClass = (status) => {
  if (!status) return ''
  switch (status.toLowerCase()) {
    case 'baru': return 'status-new'
    case 'diproses': return 'status-processing'
    case 'selesai': return 'status-completed'
    case 'dikirim': return 'status-shipped'
    case 'dibatalkan': return 'status-cancelled'
    default: return ''
  }
}

const openOrderDetailModal = (orderItem) => {
  if (!orderItem) return
  
  Object.assign(currentOrder, { 
    ...orderItem,
    delivery: orderItem.delivery || { fullName: '', phone: '', address: '', notes: '' },
    items: orderItem.items || [],
    status: orderItem.status || ''
  })
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetCurrentOrder()
}

const resetCurrentOrder = () => {
  currentOrder.id = null
  currentOrder.delivery = { fullName: '', phone: '', address: '', notes: '' }
  currentOrder.items = []
  currentOrder.total = 0
  currentOrder.status = ''
  currentOrder.orderDate = ''
  currentOrder.paymentMethod = ''
}

const updateOrderStatus = async () => {
  if (!currentOrder.id) return
  
  isSavingStatus.value = true
  try {
    await updateOrder(currentOrder.id, { status: currentOrder.status })
    alert('Status pesanan berhasil diperbarui!')
    await loadOrders()
    closeModal()
  } catch (error) {
    console.error('Gagal memperbarui status pesanan:', error)
    alert('Terjadi kesalahan saat memperbarui status pesanan. Silakan coba lagi.')
  } finally {
    isSavingStatus.value = false
  }
}

const confirmDelete = async (id) => {
  if (!id || !confirm('Anda yakin ingin menghapus pesanan ini? Aksi ini tidak dapat dibatalkan.')) return
  
  try {
    await deleteOrder(id)
    alert('Pesanan berhasil dihapus!')
    await loadOrders()
  } catch (error) {
    console.error('Gagal menghapus pesanan:', error)
    alert('Terjadi kesalahan saat menghapus pesanan. Silakan coba lagi.')
  }
}

watch(() => route.query.id, (orderId) => {
  if (orderId && orders.value.length > 0) {
    const orderToOpen = orders.value.find(order => order?.id?.toString() === orderId)
    if (orderToOpen) {
      openOrderDetailModal(orderToOpen)
    } else {
      console.warn(`Order with ID ${orderId} not found.`)
    }
  } else if (!orderId && isModalOpen.value) {
    closeModal()
  }
}, { immediate: true })

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.admin-order-management {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.admin-order-management.sidebar-collapsed {
  margin-left: 80px;
}

.admin-order-management.sidebar-expanded {
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
  margin-bottom: 2rem;
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
  border-bottom: 1px solid #e0e0e0;
  color: #555;
}

table tbody td {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  color: #444;
  vertical-align: middle;
}

table tbody tr:last-child td {
  border-bottom: none;
}

table tbody tr:hover {
  background-color: #fafafa;
}

.order-status-badge {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  display: inline-block;
}

.order-status-badge.status-new { background-color: #007bff; }
.order-status-badge.status-processing { background-color: #ffc107; color: #333; }
.order-status-badge.status-completed { background-color: #28a745; }
.order-status-badge.status-shipped { background-color: #17a2b8; }
.order-status-badge.status-cancelled { background-color: #dc3545; }

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8em;
  color: #d32f2f;
  margin: 0 0 20px 0;
  text-align: center;
}

.order-detail-content h4 {
  font-size: 1.2em;
  margin-bottom: 10px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 5px;
}

.order-items-list {
  list-style: none;
  padding: 0;
  margin: 0 0 15px;
}

.order-items-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.status-select-form {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .admin-order-management {
    margin-left: 0 !important;
    padding: 20px;
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
  
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>