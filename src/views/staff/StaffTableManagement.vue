<template>
    <div :class="mainClass">
      <div class="content-card">
        <div class="header-section">
          <h1 class="dashboard-title">Manajemen Meja</h1>
          <p class="dashboard-subtitle">Kelola status meja di restoran Anda.</p>
          <button @click="loadTables" class="refresh-button" :disabled="isLoading">
            <i class="refresh-icon"></i> Segarkan Data
          </button>
        </div>
  
        <div class="table-management-container">
          <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat meja..." size="60px" color="#D32F2F" />
  
          <div v-else class="tables-section">
            <div class="tables-controls">
              <div class="status-legend">
                <span v-for="(status, key) in statusOptions" :key="key" 
                      :class="['legend-item', getStatusClass(key)]">
                  {{ status }}
                </span>
              </div>
              <div class="search-filter">
                <input type="text" v-model="searchQuery" placeholder="Cari meja..." class="search-input">
                <select v-model="statusFilter" class="filter-select">
                  <option value="">Semua Status</option>
                  <option v-for="(status, key) in statusOptions" :key="key" :value="key">{{ status }}</option>
                </select>
              </div>
            </div>
  
            <p v-if="filteredTables.length === 0" class="no-data-message">
              Tidak ada meja yang sesuai dengan kriteria pencarian.
            </p>
  
            <div v-else class="tables-grid">
              <div v-for="table in filteredTables" :key="table.id" class="table-card">
                <div class="table-header">
                  <h3>Meja {{ table.number }}</h3>
                  <span :class="['status-badge', getStatusClass(table.status)]">
                    {{ formatStatus(table.status) }}
                  </span>
                </div>
                <div class="table-body">
                  <p>Kapasitas: <strong>{{ table.capacity }} orang</strong></p>
                  <p v-if="table.currentOccupancy !== null">Terisi: <strong>{{ table.currentOccupancy }} orang</strong></p>
                  <p v-if="table.reservedBy">Dipesan oleh: <strong>{{ table.reservedBy }}</strong></p>
                  <p v-if="table.notes">Catatan: <em>{{ table.notes }}</em></p>
                </div>
                <div class="table-actions">
                  <label :for="'status-' + table.id" class="status-label">Ubah Status:</label>
                  <select 
                    :id="'status-' + table.id" 
                    v-model="table.status" 
                    @change="updateTableStatus(table.id, table.status)" 
                    :disabled="isUpdatingTable[table.id]"
                    class="status-select"
                  >
                    <option v-for="(status, key) in statusOptions" :key="key" :value="key">{{ status }}</option>
                  </select>
                  <LoadingSpinner v-if="isUpdatingTable[table.id]" :isLoading="isUpdatingTable[table.id]" size="20px" color="#555" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, reactive, inject } from 'vue';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import { fetchAllTables, updateTable } from '@/composables/useApi';
  
  // Sidebar status
  const isSidebarCollapsed = inject('isSidebarCollapsed', false);
  const isSidebarOpen = inject('isSidebarOpen', true);
  const isMobile = inject('isMobile', false);
  
  const mainClass = computed(() => {
    return {
      'staff-table-management': true,
      'sidebar-collapsed': isSidebarCollapsed && !isMobile,
      'sidebar-expanded': !isSidebarCollapsed && !isMobile,
      'sidebar-mobile-open': isSidebarOpen && isMobile,
    }
  });
  
  // Data state
  const tables = ref([]);
  const isLoading = ref(true);
  const isUpdatingTable = reactive({});
  const searchQuery = ref('');
  const statusFilter = ref('');
  
  // Status options
  const statusOptions = {
    available: 'Tersedia',
    occupied: 'Ditempati',
    reserved: 'Dipesan',
    cleaning: 'Sedang Dibersihkan'
  };
  
  // Computed properties
  const sortedTables = computed(() => {
    return [...tables.value].sort((a, b) => a.number - b.number);
  });
  
  const filteredTables = computed(() => {
    let result = sortedTables.value;
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(table => 
        table.number.toString().includes(query) || 
        (table.notes && table.notes.toLowerCase().includes(query)) ||
        (table.reservedBy && table.reservedBy.toLowerCase().includes(query))
      );
    }
    
    if (statusFilter.value) {
      result = result.filter(table => table.status === statusFilter.value);
    }
    
    return result;
  });
  
  // Methods
  const loadTables = async () => {
    isLoading.value = true;
    try {
      tables.value = await fetchAllTables();
    } catch (error) {
      console.error('Gagal memuat meja:', error);
      alert('Gagal memuat data meja. Silakan coba lagi nanti.');
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateTableStatus = async (tableId, newStatus) => {
    isUpdatingTable[tableId] = true;
    try {
      await updateTable(tableId, { status: newStatus });
      // Only update the specific table instead of reloading all
      const tableIndex = tables.value.findIndex(t => t.id === tableId);
      if (tableIndex !== -1) {
        tables.value[tableIndex].status = newStatus;
      }
    } catch (error) {
      console.error('Gagal memperbarui status meja:', error);
      alert('Gagal memperbarui status meja. Silakan coba lagi.');
    } finally {
      isUpdatingTable[tableId] = false;
    }
  };
  
  const formatStatus = (status) => {
    return statusOptions[status?.toLowerCase()] || status || 'Unknown';
  };
  
  const getStatusClass = (status) => {
    return `status-${status?.toLowerCase()}` || '';
  };
  
  // Lifecycle hooks
  onMounted(() => {
    loadTables();
  });
  </script>
  
  <style scoped>
  .staff-table-management {
    padding: 30px;
    min-height: 100vh;
    background-color: #f8f9fa;
    transition: margin-left 0.3s ease;
  }
  
  .staff-table-management.sidebar-collapsed {
    margin-left: 80px;
  }
  
  .staff-table-management.sidebar-expanded {
    margin-left: 250px;
  }
  
  .content-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    padding: 30px;
  }
  
  .header-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .dashboard-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    color: #d32f2f;
    margin-bottom: 0.5rem;
    width: 100%;
  }
  
  .dashboard-subtitle {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1rem;
    width: 100%;
  }
  
  .refresh-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 0.9em;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }
  
  .refresh-button:hover {
    background-color: #eee;
    border-color: #ccc;
  }
  
  .refresh-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .refresh-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' /%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .table-management-container {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .tables-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 15px;
  }
  
  .status-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .legend-item {
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.85em;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }
  
  .search-filter {
    display: flex;
    gap: 10px;
  }
  
  .search-input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9em;
    min-width: 200px;
  }
  
  .filter-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9em;
    cursor: pointer;
  }
  
  .no-data-message {
    text-align: center;
    color: #777;
    padding: 50px 0;
    font-style: italic;
    font-size: 1.2em;
  }
  
  .tables-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  
  .table-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 20px;
    border: 1px solid #eee;
    transition: all 0.3s ease;
  }
  
  .table-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #ddd;
  }
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .table-header h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4em;
    color: #d32f2f;
    margin: 0;
  }
  
  .table-body {
    margin-bottom: 15px;
  }
  
  .table-body p {
    margin-bottom: 8px;
    color: #555;
    font-size: 0.95em;
  }
  
  .table-body p:last-child {
    margin-bottom: 0;
  }
  
  .status-badge {
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.85em;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }
  
  .status-available { background-color: #388e3c; }
  .status-occupied { background-color: #d32f2f; }
  .status-reserved { background-color: #ffa000; color: #333; }
  .status-cleaning { background-color: #1976d2; }
  
  .table-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 15px;
    border-top: 1px dashed #eee;
    position: relative;
  }
  
  .status-label {
    font-weight: 600;
    color: #444;
    font-size: 0.9em;
    white-space: nowrap;
  }
  
  .status-select {
    flex-grow: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9em;
    background-color: white;
    cursor: pointer;
  }
  
  .status-select:focus {
    border-color: #d32f2f;
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
    outline: none;
  }
  
  @media (max-width: 768px) {
    .staff-table-management {
      padding: 20px;
      margin-left: 0 !important;
    }
    
    .content-card {
      padding: 20px;
    }
    
    .tables-controls {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .search-filter {
      width: 100%;
    }
    
    .search-input {
      flex-grow: 1;
      min-width: auto;
    }
    
    .tables-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .table-header h3 {
      font-size: 1.3em;
    }
  }
  
  @media (max-width: 480px) {
    .table-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .status-select {
      width: 100%;
    }
  }
  </style>