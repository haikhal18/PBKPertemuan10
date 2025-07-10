<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Manajemen Pengguna</h1>
      <p class="dashboard-subtitle">Kelola akun pengguna dan hak akses di sistem Anda.</p>

      <div class="top-actions">
        <Button type="primary" @click="openAddUserModal">
          <i class="fas fa-user-plus"></i> Tambah Pengguna Baru
        </Button>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari pengguna..."
          class="search-input"
        />
      </div>

      <LoadingSpinner v-if="isLoading" :isLoading="isLoading" message="Memuat daftar pengguna..." size="60px" color="#D32F2F" />

      <p v-else-if="filteredUsers.length === 0 && !isLoading" class="no-data-message">
        {{ searchQuery ? 'Tidak ada pengguna yang ditemukan.' : 'Belum ada pengguna.' }}
      </p>

      <div v-else class="user-table-container">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td><span :class="['role-badge', getRoleClass(user.role)]">{{ formatRole(user.role) }}</span></td>
                <td class="action-buttons">
                  <Button type="secondary" size="small" @click="openEditUserModal(user)">
                    <i class="fas fa-edit"></i> Edit
                  </Button>
                  <Button
                    type="danger"
                    size="small"
                    @click="confirmDelete(user.id)"
                    :disabled="authStore.user.id === user.id || user.role === 'admin'"
                  >
                    <i class="fas fa-trash-alt"></i> Hapus
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal :isVisible="isModalOpen" :showCloseButton="true" @close="closeModal" maxWidth="600px">
        <template #header>
          <h3 class="modal-title">{{ isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}</h3>
        </template>
        <template #body>
          <form @submit.prevent="saveUser">
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" v-model="currentUser.username" required :disabled="isEditMode">
              <p v-if="errors.username" class="validation-error">{{ errors.username }}</p>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="currentUser.email" required>
              <p v-if="errors.email" class="validation-error">{{ errors.email }}</p>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="currentUser.password" :required="!isEditMode">
              <p class="password-note" v-if="isEditMode">Kosongkan jika tidak ingin mengubah password</p>
              <p v-if="errors.password" class="validation-error">{{ errors.password }}</p>
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <select id="role" v-model="currentUser.role" required>
                <option value="user">Pelanggan</option>
                <option value="karyawan">Karyawan</option>
                <option value="admin">Admin</option>
              </select>
              <p v-if="errors.role" class="validation-error">{{ errors.role }}</p>
            </div>
            <div class="modal-actions">
              <Button type="secondary" @click="closeModal">Batal</Button>
              <Button type="primary" :disabled="isSaving">{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</Button>
            </div>
          </form>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, inject } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Modal from '@/components/common/Modal.vue';
import { fetchAllUsers, createUser, updateUser, deleteUser } from '@/composables/useApi';

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false);
const isSidebarOpen = inject('isSidebarOpen', true);
const isMobile = inject('isMobile', false);

const mainClass = computed(() => {
  return {
    'admin-user-management': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
    'sidebar-mobile-open': isSidebarOpen && isMobile,
  }
});

const authStore = useAuthStore();
const users = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

const isModalOpen = ref(false);
const isEditMode = ref(false);
const currentUser = reactive({
  id: null,
  username: '',
  email: '',
  password: '',
  role: 'user',
});
const isSaving = ref(false);
const errors = reactive({
  username: '', email: '', password: '', role: '',
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  );
});

const loadUsers = async () => {
  isLoading.value = true;
  try {
    users.value = await fetchAllUsers();
  } catch (error) {
    console.error('Gagal memuat pengguna:', error);
    alert('Gagal memuat daftar pengguna. Silakan coba lagi nanti.');
  } finally {
    isLoading.value = false;
  }
};

const formatRole = (role) => {
  const roleNames = {
    'admin': 'Admin',
    'karyawan': 'Karyawan',
    'user': 'Pelanggan'
  };
  return roleNames[role] || role;
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

const openAddUserModal = () => {
  isEditMode.value = false;
  resetCurrentUser();
  clearErrors();
  isModalOpen.value = true;
};

const openEditUserModal = (userItem) => {
  isEditMode.value = true;
  Object.assign(currentUser, { ...userItem, password: '' });
  clearErrors();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetCurrentUser();
  clearErrors();
};

const resetCurrentUser = () => {
  currentUser.id = null;
  currentUser.username = '';
  currentUser.email = '';
  currentUser.password = '';
  currentUser.role = 'user';
};

const clearErrors = () => {
  errors.username = '';
  errors.email = '';
  errors.password = '';
  errors.role = '';
};

const validateForm = () => {
  clearErrors();
  let isValid = true;
  
  if (!currentUser.username) { 
    errors.username = 'Username wajib diisi.'; 
    isValid = false; 
  }
  
  if (!currentUser.email) {
    errors.email = 'Email wajib diisi.'; 
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(currentUser.email)) {
    errors.email = 'Format email tidak valid.'; 
    isValid = false;
  }
  
  if (!isEditMode.value && !currentUser.password) {
    errors.password = 'Password wajib diisi.'; 
    isValid = false;
  } else if (currentUser.password && currentUser.password.length < 6) {
    errors.password = 'Password minimal 6 karakter.'; 
    isValid = false;
  }
  
  if (!currentUser.role) { 
    errors.role = 'Role wajib diisi.'; 
    isValid = false; 
  }

  return isValid;
};

const saveUser = async () => {
  if (!validateForm()) return;

  isSaving.value = true;
  try {
    const userPayload = { ...currentUser };
    if (isEditMode.value && !userPayload.password) {
      delete userPayload.password;
    }

    if (isEditMode.value) {
      await updateUser(userPayload.id, userPayload);
      alert('Pengguna berhasil diperbarui!');
    } else {
      await createUser(userPayload);
      alert('Pengguna berhasil ditambahkan!');
    }
    await loadUsers();
    closeModal();
  } catch (error) {
    console.error('Gagal menyimpan pengguna:', error);
    alert('Terjadi kesalahan. Username/email mungkin sudah terdaftar.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (id) => {
  if (authStore.user.id === id) {
    alert('Anda tidak bisa menghapus akun sendiri!');
    return;
  }

  const userToDelete = users.value.find(u => u.id === id);
  if (userToDelete?.role === 'admin') {
    alert('Tidak bisa menghapus admin lain!');
    return;
  }

  if (confirm('Anda yakin ingin menghapus pengguna ini?')) {
    try {
      await deleteUser(id);
      alert('Pengguna berhasil dihapus!');
      await loadUsers();
    } catch (error) {
      console.error('Gagal menghapus pengguna:', error);
      alert('Terjadi kesalahan saat menghapus pengguna.');
    }
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.admin-user-management {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.admin-user-management.sidebar-collapsed {
  margin-left: 80px;
}

.admin-user-management.sidebar-expanded {
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

.user-table-container {
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

.role-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  display: inline-block;
}

.role-admin { 
  background-color: #d32f2f;
  box-shadow: 0 2px 4px rgba(211, 47, 47, 0.2);
}
.role-staff { 
  background-color: #388e3c;
  box-shadow: 0 2px 4px rgba(56, 142, 60, 0.2);
}
.role-user { 
  background-color: #1976d2;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
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
.form-group select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  outline: none;
}

.password-note {
  font-size: 0.85em;
  color: #777;
  margin-top: 5px;
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
  .admin-user-management {
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
  
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
}
</style>