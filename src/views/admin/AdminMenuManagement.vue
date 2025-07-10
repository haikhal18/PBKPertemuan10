<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Manajemen Menu</h1>
      <p class="dashboard-subtitle">Kelola daftar makanan dan minuman restoran Anda.</p>

      <div class="top-actions">
        <Button type="primary" @click="openAddMenuModal">
          <i class="fas fa-plus-circle"></i> Tambah Menu Baru
        </Button>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari menu..."
          class="search-input"
        />
      </div>

      <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat daftar menu..." size="60px" color="#A00" />

      <p v-else-if="filteredMenus.length === 0 && !isLoading" class="no-data-message">
        {{ searchQuery ? 'Tidak ada menu yang ditemukan untuk pencarian Anda.' : 'Belum ada item menu.' }}
      </p>

      <div v-else class="menu-table-container">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="menuItem in filteredMenus" :key="menuItem.id">
                <td>{{ menuItem.id }}</td>
                <td>
                  <img :src="menuItem.imageUrl || 'https://via.placeholder.com/50x50?text=No+Img'" :alt="menuItem.name" class="menu-thumbnail" />
                </td>
                <td>{{ menuItem.name }}</td>
                <td><span class="category-badge">{{ formatCategory(menuItem.category) }}</span></td>
                <td>Rp {{ menuItem.price ? menuItem.price.toLocaleString('id-ID') : '0' }}</td>
                <td class="description-cell">{{ truncateDescription(menuItem.description) }}</td>
                <td>
                  <Button type="secondary" size="small" @click="openEditMenuModal(menuItem)">
                    <i class="fas fa-edit"></i> Edit
                  </Button>
                  <Button type="danger" size="small" @click="confirmDelete(menuItem.id)">
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
          <h3 class="modal-title">{{ isEditMode ? 'Edit Item Menu' : 'Tambah Item Menu Baru' }}</h3>
        </template>
        <template #body>
          <form @submit.prevent="saveMenu">
            <div class="form-group">
              <label for="menuName">Nama Menu:</label>
              <input type="text" id="menuName" v-model="currentMenu.name" required />
              <p v-if="errors.name" class="validation-error">{{ errors.name }}</p>
            </div>
            <div class="form-group">
              <label for="menuCategory">Kategori:</label>
              <select id="menuCategory" v-model="currentMenu.category" required>
                <option value="">Pilih Kategori</option>
                <option v-for="cat in allCategories" :key="cat" :value="cat">{{ formatCategory(cat) }}</option>
              </select>
              <p v-if="errors.category" class="validation-error">{{ errors.category }}</p>
            </div>
            <div class="form-group">
              <label for="menuPrice">Harga (Rp):</label>
              <input type="number" id="menuPrice" v-model="currentMenu.price" required min="0" />
              <p v-if="errors.price" class="validation-error">{{ errors.price }}</p>
            </div>
            <div class="form-group">
              <label for="menuImageUrl">URL Gambar:</label>
              <input type="text" id="menuImageUrl" v-model="currentMenu.imageUrl" placeholder="http://example.com/image.jpg" />
              <p v-if="errors.imageUrl" class="validation-error">{{ errors.imageUrl }}</p>
              <div v-if="currentMenu.imageUrl" class="image-preview">
                <img :src="currentMenu.imageUrl" alt="Preview" class="preview-img" />
              </div>
            </div>
            <div class="form-group">
              <label for="menuDescription">Deskripsi:</label>
              <textarea id="menuDescription" v-model="currentMenu.description" rows="4"></textarea>
              <p v-if="errors.description" class="validation-error">{{ errors.description }}</p>
            </div>
            <div class="modal-actions">
              <Button type="secondary" @click="closeModal">Batal</Button>
              <Button type="primary" :disabled="isSaving">{{ isSaving ? 'Menyimpan...' : 'Simpan Menu' }}</Button>
            </div>
          </form>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, inject } from 'vue'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { fetchAllMenus, createMenu, updateMenu, deleteMenu } from '@/composables/useApi'

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false)
const isSidebarOpen = inject('isSidebarOpen', true)
const isMobile = inject('isMobile', false)

const mainClass = computed(() => {
  return {
    'admin-menu-management': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
  }
})

const menus = ref([])
const isLoading = ref(true)
const searchQuery = ref('')

const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentMenu = reactive({
  id: null,
  name: '',
  category: '',
  price: 0,
  imageUrl: '',
  description: '',
})
const isSaving = ref(false)
const errors = reactive({
  name: '', category: '', price: '', imageUrl: '', description: '',
})
const allCategories = ref(['makanan', 'minuman', 'dessert', 'lainnya'])

const filteredMenus = computed(() => {
  if (!searchQuery.value) return menus.value
  const query = searchQuery.value.toLowerCase()
  return menus.value.filter(menu =>
    menu.name.toLowerCase().includes(query) ||
    menu.description.toLowerCase().includes(query) ||
    menu.category.toLowerCase().includes(query)
  )
})

const loadMenus = async () => {
  isLoading.value = true
  try {
    menus.value = await fetchAllMenus()
  } catch (err) {
    alert('Gagal memuat menu')
  } finally {
    isLoading.value = false
  }
}

const formatCategory = (category) => {
  return category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
}

const truncateDescription = (desc, limit = 50) => {
  if (!desc) return ''
  return desc.length <= limit ? desc : desc.substring(0, limit) + '...'
}

const openAddMenuModal = () => {
  isEditMode.value = false
  resetCurrentMenu()
  clearErrors()
  isModalOpen.value = true
}

const openEditMenuModal = (item) => {
  isEditMode.value = true
  Object.assign(currentMenu, item)
  clearErrors()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetCurrentMenu()
  clearErrors()
}

const resetCurrentMenu = () => {
  currentMenu.id = null
  currentMenu.name = ''
  currentMenu.category = ''
  currentMenu.price = 0
  currentMenu.imageUrl = ''
  currentMenu.description = ''
}

const clearErrors = () => {
  errors.name = ''
  errors.category = ''
  errors.price = ''
  errors.imageUrl = ''
  errors.description = ''
}

const validateForm = () => {
  clearErrors()
  let isValid = true
  if (!currentMenu.name) { errors.name = 'Nama wajib diisi.'; isValid = false }
  if (!currentMenu.category) { errors.category = 'Kategori wajib diisi.'; isValid = false }
  if (currentMenu.price === null || currentMenu.price < 0) { errors.price = 'Harga tidak valid.'; isValid = false }
  return isValid
}

const saveMenu = async () => {
  if (!validateForm()) return
  isSaving.value = true
  try {
    if (isEditMode.value) {
      await updateMenu(currentMenu.id, currentMenu)
      alert('Menu diperbarui!')
    } else {
      const newId = Math.max(...menus.value.map(m => m.id)) + 1
      await createMenu({ ...currentMenu, id: newId })
      alert('Menu ditambahkan!')
    }
    await loadMenus()
    closeModal()
  } catch (err) {
    alert('Gagal menyimpan menu')
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = async (id) => {
  if (confirm('Yakin ingin menghapus menu ini?')) {
    try {
      await deleteMenu(id)
      await loadMenus()
      alert('Menu dihapus.')
    } catch (err) {
      alert('Gagal menghapus menu')
    }
  }
}

onMounted(() => {
  loadMenus()
})
</script>

<style scoped>
.admin-menu-management {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.admin-menu-management.sidebar-collapsed {
  margin-left: 80px;
}

.admin-menu-management.sidebar-expanded {
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

.no-data-message {
  text-align: center;
  color: #777;
  padding: 50px 0;
  font-style: italic;
  font-size: 1.2em;
}

.menu-table-container {
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

.menu-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.category-badge {
  background-color: #e0f2f7;
  color: #007bb6;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.85em;
  font-weight: 500;
}

.description-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8em;
  color: #d32f2f;
  margin: 0 0 20px 0;
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

.image-preview {
  margin-top: 15px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .admin-menu-management {
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
  
  .search-input {
    max-width: 100%;
    width: 100%;
  }
  
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .menu-thumbnail {
    width: 50px;
    height: 50px;
  }
}
</style>