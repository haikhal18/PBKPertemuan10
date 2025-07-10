<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Manajemen Reservasi</h1>
      <p class="dashboard-subtitle">Kelola semua reservasi meja yang masuk untuk restoran Anda.</p>

      <div class="top-actions">
        <Button type="primary" @click="openAddReservationModal">
          <i class="fas fa-calendar-plus"></i> Tambah Reservasi Baru
        </Button>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari reservasi (nama, tanggal)..."
          class="search-input"
        />
      </div>

      <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat daftar reservasi..." size="60px" color="var(--primary-color)" />

      <p v-else-if="filteredReservations.length === 0 && !isLoading" class="no-data-message">
        {{ searchQuery ? 'Tidak ada reservasi yang ditemukan untuk pencarian Anda.' : 'Belum ada reservasi meja.' }}
      </p>

      <div v-else class="reservation-cards-container">
        <div class="reservation-card" v-for="reservation in sortedReservations" :key="reservation.id">
          <div class="card-header">
            <h3>#{{ reservation.id }} - {{ reservation.fullName }}</h3>
            <span :class="['reservation-status-badge', getStatusClass(reservation.status)]">
              {{ formatStatus(reservation.status) }}
            </span>
          </div>
          
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">Tanggal & Waktu:</span>
              <span class="info-value">{{ formatDateTime(reservation.dateTime) }}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Jumlah Tamu:</span>
              <span class="info-value">{{ reservation.guests }}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Meja:</span>
              <span class="info-value">
                {{ reservation.tableId ? `Meja ${reservation.tableId}` : 'Belum Ditetapkan' }}
              </span>
            </div>
            
            <div class="info-row" v-if="reservation.notes">
              <span class="info-label">Catatan:</span>
              <span class="info-value notes">{{ truncateNotes(reservation.notes) }}</span>
            </div>
          </div>
          
          <div class="card-footer">
            <Button type="secondary" size="small" @click="openEditReservationModal(reservation)">
              <i class="fas fa-edit"></i> Edit
            </Button>
            <Button type="danger" size="small" @click="confirmDelete(reservation.id)">
              <i class="fas fa-trash-alt"></i> Hapus
            </Button>
          </div>
        </div>
      </div>

      <Modal :isVisible="isModalOpen" :showCloseButton="true" @close="closeModal" maxWidth="600px">
        <template #header>
          <h3 class="modal-title">{{ isEditMode ? 'Edit Reservasi' : 'Tambah Reservasi Baru' }}</h3>
        </template>
        <template #body>
          <form @submit.prevent="saveReservation">
            <div class="form-group">
              <label for="fullName">Nama Pemesan:</label>
              <input type="text" id="fullName" v-model="currentReservation.fullName" required>
              <p v-if="errors.fullName" class="validation-error">{{ errors.fullName }}</p>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="currentReservation.email" required>
              <p v-if="errors.email" class="validation-error">{{ errors.email }}</p>
            </div>
            <div class="form-group">
              <label for="phone">Nomor Telepon:</label>
              <input type="tel" id="phone" v-model="currentReservation.phone" required>
              <p v-if="errors.phone" class="validation-error">{{ errors.phone }}</p>
            </div>
            <div class="form-group">
              <label for="dateTime">Tanggal & Waktu:</label>
              <input type="datetime-local" id="dateTime" v-model="currentReservation.dateTime" required>
              <p v-if="errors.dateTime" class="validation-error">{{ errors.dateTime }}</p>
            </div>
            <div class="form-group">
              <label for="guests">Jumlah Tamu:</label>
              <input type="number" id="guests" v-model="currentReservation.guests" required min="1">
              <p v-if="errors.guests" class="validation-error">{{ errors.guests }}</p>
            </div>
            <div class="form-group">
              <label for="status">Status Reservasi:</label>
              <select id="status" v-model="currentReservation.status" required>
                <option value="pending">Pending</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="cancelled">Dibatalkan</option>
                <option value="completed">Selesai</option>
              </select>
              <p v-if="errors.status" class="validation-error">{{ errors.status }}</p>
            </div>
            
            <div class="form-group" v-if="currentReservation.status === 'confirmed'">
              <label for="tableId">Meja Ditetapkan:</label>
              <select id="tableId" v-model="currentReservation.tableId">
                <option :value="null">-- Belum Ditetapkan --</option>
                <option v-for="table in availableTablesForCurrentReservation" :key="table.id" :value="table.id">
                  Meja {{ table.number }} (Kapasitas: {{ table.capacity }})
                </option>
              </select>
              <p v-if="errors.tableId" class="validation-error">{{ errors.tableId }}</p>
            </div>

            <div class="form-group">
              <label for="notes">Catatan Tambahan (opsional):</label>
              <textarea id="notes" v-model="currentReservation.notes" rows="3"></textarea>
              <p v-if="errors.notes" class="validation-error">{{ errors.notes }}</p>
            </div>
            <div class="modal-actions">
              <Button type="secondary" @click="closeModal">Batal</Button>
              <Button type="primary" :disabled="isSaving">{{ isSaving ? 'Menyimpan...' : 'Simpan Reservasi' }}</Button>
            </div>
          </form>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, inject } from 'vue';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Modal from '@/components/common/Modal.vue';
import { fetchAllReservations, createReservation, updateReservation, deleteReservation, fetchAllTables, updateTable, fetchReservationById } from '@/composables/useApi';
import { useValidation } from '@/composables/useValidation';

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false)
const isSidebarOpen = inject('isSidebarOpen', true)
const isMobile = inject('isMobile', false)

const mainClass = computed(() => {
  return {
    'admin-reservation-management': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
    'sidebar-mobile-open': isSidebarOpen && isMobile,
  }
})

const reservations = ref([]);
const tables = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

const isModalOpen = ref(false);
const isEditMode = ref(false);
const currentReservation = reactive({
  id: null,
  fullName: '',
  email: '',
  phone: '',
  dateTime: '',
  guests: 1,
  status: 'pending',
  notes: '',
  tableId: null,
});
const isSaving = ref(false);
const { errors, validateRequired, validateEmail, validatePositiveNumber, clearError, clearErrors } = useValidation();

// Filter reservasi berdasarkan pencarian
const filteredReservations = computed(() => {
  if (!searchQuery.value) {
    return reservations.value;
  }
  const query = searchQuery.value.toLowerCase();
  return reservations.value.filter(res =>
    res.fullName.toLowerCase().includes(query) ||
    res.email.toLowerCase().includes(query) ||
    res.phone.toLowerCase().includes(query) ||
    (res.dateTime && res.dateTime.toLowerCase().includes(query)) ||
    res.notes.toLowerCase().includes(query) ||
    (res.tableId && res.tableId.toString().includes(query))
  );
});

// Mengurutkan reservasi dari yang terbaru/terdekat
const sortedReservations = computed(() => {
  return [...filteredReservations.value].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
});

// Mengambil semua reservasi dan meja dari API
const loadReservationsAndTables = async () => {
  isLoading.value = true;
  try {
    reservations.value = await fetchAllReservations();
    tables.value = await fetchAllTables();
  } catch (error) {
    console.error('Gagal memuat data:', error);
    alert('Gagal memuat data reservasi atau meja. Silakan coba lagi nanti.');
  } finally {
    isLoading.value = false;
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleDateString('id-ID', options);
};

const truncateNotes = (notes, limit = 50) => {
  if (!notes) return '';
  if (notes.length <= limit) return notes;
  return notes.substring(0, limit) + '...';
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Dikonfirmasi',
    'cancelled': 'Dibatalkan',
    'completed': 'Selesai',
  };
  return statusMap[status.toLowerCase()] || status;
};

const getStatusClass = (status) => {
  if (!status) return '';
  switch (status.toLowerCase()) {
    case 'pending': return 'status-pending';
    case 'confirmed': return 'status-confirmed';
    case 'completed': return 'status-completed';
    case 'cancelled': return 'status-cancelled';
    default: return '';
  }
};

const openAddReservationModal = () => {
  isEditMode.value = false;
  resetCurrentReservation();
  clearErrors();
  isModalOpen.value = true;
};

const openEditReservationModal = (reservationItem) => {
  isEditMode.value = true;
  const dt = new Date(reservationItem.dateTime);
  reservationItem.dateTime = dt.toISOString().slice(0, 16);
  Object.assign(currentReservation, reservationItem);
  clearErrors();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetCurrentReservation();
  clearErrors();
};

const resetCurrentReservation = () => {
  currentReservation.id = null;
  currentReservation.fullName = '';
  currentReservation.email = '';
  currentReservation.phone = '';
  currentReservation.dateTime = '';
  currentReservation.guests = 1;
  currentReservation.status = 'pending';
  currentReservation.notes = '';
  currentReservation.tableId = null;
};

const validateForm = () => {
  clearErrors();
  let isValid = true;
  isValid = validateRequired(currentReservation.fullName, 'fullName', 'Nama pemesan wajib diisi.') && isValid;
  isValid = validateEmail(currentReservation.email, 'email') && isValid;
  isValid = validateRequired(currentReservation.phone, 'phone', 'Nomor telepon wajib diisi.') && isValid;
  isValid = validateRequired(currentReservation.dateTime, 'dateTime', 'Tanggal & Waktu wajib diisi.') && isValid;
  isValid = validatePositiveNumber(currentReservation.guests, 'guests', 1, 'Jumlah tamu minimal 1.') && isValid;
  isValid = validateRequired(currentReservation.status, 'status', 'Status wajib diisi.') && isValid;
  
  if (currentReservation.dateTime && new Date(currentReservation.dateTime) < new Date() && !isEditMode.value) {
      errors.dateTime = 'Reservasi tidak bisa dibuat di masa lalu.';
      isValid = false;
  }

  return isValid;
};

const saveReservation = async () => {
  if (!validateForm()) {
    return;
  }

  isSaving.value = true;
  try {
    let response;
    const payload = { ...currentReservation };
    if (!payload.tableId) {
        delete payload.tableId;
    }

    if (isEditMode.value) {
      const oldReservation = reservations.value.find(r => r.id === currentReservation.id);
      if (oldReservation && oldReservation.tableId && oldReservation.tableId !== currentReservation.tableId) {
          await updateTable(oldReservation.tableId, { status: 'available', reservedBy: null, currentReservationId: null });
      }
      response = await updateReservation(currentReservation.id, payload);
    } else {
      response = await createReservation(payload);
    }

    if (response.status === 'confirmed' && response.tableId) {
        await updateTable(response.tableId, {
            status: 'reserved',
            reservedBy: response.fullName,
            currentReservationId: response.id
        });
    } else if (response.status !== 'confirmed' && response.tableId) {
        await updateTable(response.tableId, { status: 'available', reservedBy: null, currentReservationId: null });
        await updateReservation(response.id, { tableId: null });
    }

    alert('Reservasi berhasil disimpan!');
    await loadReservationsAndTables();
    closeModal();
  } catch (error) {
    console.error('Gagal menyimpan reservasi:', error);
    alert('Terjadi kesalahan saat menyimpan reservasi. Silakan coba lagi.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (id) => {
  if (!confirm('Anda yakin ingin menghapus reservasi ini?')) return;

  isSaving.value = true;
  try {
    const reservationToDelete = reservations.value.find(r => r.id === id);

    if (reservationToDelete?.tableId) {
      await updateTable(reservationToDelete.tableId, {
        status: 'available',
        reservedBy: null,
        currentReservationId: null,
      });
    }

    await deleteReservation(id);
    alert('Reservasi berhasil dihapus!');
    await loadReservationsAndTables();
  } catch (error) {
    console.error('Gagal menghapus reservasi:', error);
    alert('Terjadi kesalahan saat menghapus reservasi. Silakan coba lagi.');
  } finally {
    isSaving.value = false;
  }
};

const availableTablesForCurrentReservation = computed(() => {
  const guests = currentReservation.guests;
  const currentTableId = currentReservation.tableId;

  return tables.value
    .filter(table =>
      (table.status === 'available' && table.capacity >= guests) ||
      table.id === currentTableId
    )
    .sort((a, b) => a.number - b.number);
});

onMounted(() => {
  loadReservationsAndTables();
});
</script>

<style scoped>
.admin-reservation-management {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.admin-reservation-management.sidebar-collapsed {
  margin-left: 80px;
}

.admin-reservation-management.sidebar-expanded {
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
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.search-input:focus {
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

.reservation-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.reservation-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reservation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-body {
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  line-height: 1.4;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #555;
  min-width: 100px;
  margin-right: 10px;
}

.info-value {
  flex: 1;
  color: #444;
}

.notes {
  white-space: pre-line;
}

.card-footer {
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.reservation-status-badge {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-pending { background-color: #ffc107; color: #333; }
.status-confirmed { background-color: #28a745; }
.status-cancelled { background-color: #dc3545; }
.status-completed { background-color: #007bff; }

/* Modal Styles */
.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8em;
  color: #d32f2f;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.form-group textarea {
  min-height: 100px;
}

.validation-error {
  color: #d32f2f;
  font-size: 0.85em;
  margin-top: 5px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .admin-reservation-management {
    margin-left: 0 !important;
    padding: 20px;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .top-actions {
    flex-direction: column;
  }
  
  .search-input {
    max-width: 100%;
    width: 100%;
  }
  
  .reservation-cards-container {
    grid-template-columns: 1fr;
  }
}
</style>