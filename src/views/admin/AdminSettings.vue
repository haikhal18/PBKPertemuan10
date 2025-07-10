<template>
  <div :class="mainClass">
    <div class="content-card">
      <h1 class="dashboard-title">Pengaturan Sistem</h1>
      <p class="dashboard-subtitle">Kelola pengaturan umum dan konfigurasi aplikasi restoran Anda.</p>

      <div class="settings-sections">
        <div class="settings-card">
          <h2 class="section-header">Informasi Restoran</h2>
          <form @submit.prevent="saveGeneralSettings">
            <div class="form-group">
              <label for="restaurantName">Nama Restoran:</label>
              <input type="text" id="restaurantName" v-model="settings.restaurantName" required>
            </div>
            <div class="form-group">
              <label for="address">Alamat:</label>
              <textarea id="address" v-model="settings.address" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label for="phone">Nomor Telepon:</label>
              <input type="tel" id="phone" v-model="settings.phone" required>
            </div>
            <div class="form-group">
              <label for="email">Email Kontak:</label>
              <input type="email" id="email" v-model="settings.email" required>
            </div>
            <div class="form-actions">
              <Button type="primary" :disabled="isSavingGeneral">
                {{ isSavingGeneral ? 'Menyimpan...' : 'Simpan Informasi' }}
              </Button>
            </div>
            <p v-if="generalMessage" :class="['form-status-message', generalStatusClass]">{{ generalMessage }}</p>
          </form>
        </div>

        <div class="settings-card">
          <h2 class="section-header">Jam Operasional</h2>
          <form @submit.prevent="saveOperationalSettings">
            <div class="form-group">
              <label for="openingTime">Waktu Buka (Setiap Hari):</label>
              <input type="time" id="openingTime" v-model="settings.openingTime" required>
            </div>
            <div class="form-group">
              <label for="closingTime">Waktu Tutup (Setiap Hari):</label>
              <input type="time" id="closingTime" v-model="settings.closingTime" required>
            </div>
            <div class="form-group">
              <label for="deliveryEnabled">Aktifkan Pengiriman:</label>
              <input type="checkbox" id="deliveryEnabled" v-model="settings.deliveryEnabled">
            </div>
            <div class="form-actions">
              <Button type="primary" :disabled="isSavingOperational">
                {{ isSavingOperational ? 'Menyimpan...' : 'Simpan Operasional' }}
              </Button>
            </div>
            <p v-if="operationalMessage" :class="['form-status-message', operationalStatusClass]">{{ operationalMessage }}</p>
          </form>
        </div>

        <div class="settings-card">
          <h2 class="section-header">Ubah Password Admin</h2>
          <form @submit.prevent="changeAdminPassword">
            <div class="form-group">
              <label for="currentPassword">Password Saat Ini:</label>
              <input type="password" id="currentPassword" v-model="passwordForm.currentPassword" required>
            </div>
            <div class="form-group">
              <label for="newPassword">Password Baru:</label>
              <input type="password" id="newPassword" v-model="passwordForm.newPassword" required>
            </div>
            <div class="form-group">
              <label for="confirmNewPassword">Konfirmasi Password Baru:</label>
              <input type="password" id="confirmNewPassword" v-model="passwordForm.confirmNewPassword" required>
            </div>
            <div class="form-actions">
              <Button type="primary" :disabled="isChangingPassword">
                {{ isChangingPassword ? 'Mengubah...' : 'Ubah Password' }}
              </Button>
            </div>
            <p v-if="passwordMessage" :class="['form-status-message', passwordStatusClass]">{{ passwordMessage }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject } from 'vue'; 
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useAuthStore } from '@/stores/auth';
import { fetchSettings, updateSettings, updateUser } from '@/composables/useApi';

// Sidebar status
const isSidebarCollapsed = inject('isSidebarCollapsed', false)
const isSidebarOpen = inject('isSidebarOpen', true)
const isMobile = inject('isMobile', false)

const mainClass = computed(() => {
  return {
    'admin-settings': true,
    'sidebar-collapsed': isSidebarCollapsed && !isMobile,
    'sidebar-expanded': !isSidebarCollapsed && !isMobile,
    'sidebar-mobile-open': isSidebarOpen && isMobile,
  }
})

const authStore = useAuthStore();

const settings = reactive({
  restaurantName: 'Nama Restoran Anda',
  address: 'Jl. Contoh No. 123, Pekanbaru',
  phone: '+6281234567890',
  email: 'info@namarestoran.com',
  openingTime: '10:00',
  closingTime: '22:00',
  deliveryEnabled: true,
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const isSavingGeneral = ref(false);
const isSavingOperational = ref(false);
const isChangingPassword = ref(false);

const generalMessage = ref('');
const generalStatusClass = ref('');
const operationalMessage = ref('');
const operationalStatusClass = ref('');
const passwordMessage = ref('');
const passwordStatusClass = ref('');

const loadSettings = async () => {
  try {
    const fetchedSettings = await fetchSettings(1);
    Object.assign(settings, fetchedSettings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }
};

const saveGeneralSettings = async () => {
  isSavingGeneral.value = true;
  generalMessage.value = '';
  generalStatusClass.value = '';
  try {
    await updateSettings(1, {
      restaurantName: settings.restaurantName,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
    });
    generalMessage.value = 'Informasi restoran berhasil disimpan!';
    generalStatusClass.value = 'success';
  } catch (error) {
    console.error('Failed to save general settings:', error);
    generalMessage.value = 'Gagal menyimpan informasi restoran.';
    generalStatusClass.value = 'error';
  } finally {
    isSavingGeneral.value = false;
  }
};

const saveOperationalSettings = async () => {
  isSavingOperational.value = true;
  operationalMessage.value = '';
  operationalStatusClass.value = '';
  try {
    await updateSettings(1, {
      openingTime: settings.openingTime,
      closingTime: settings.closingTime,
      deliveryEnabled: settings.deliveryEnabled,
    });
    operationalMessage.value = 'Jam operasional berhasil disimpan!';
    operationalStatusClass.value = 'success';
  } catch (error) {
    console.error('Failed to save operational settings:', error);
    operationalMessage.value = 'Gagal menyimpan jam operasional.';
    operationalStatusClass.value = 'error';
  } finally {
    isSavingOperational.value = false;
  }
};

const changeAdminPassword = async () => {
  isChangingPassword.value = true;
  passwordMessage.value = '';
  passwordStatusClass.value = '';

  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    passwordMessage.value = 'Password baru dan konfirmasi password tidak cocok.';
    passwordStatusClass.value = 'error';
    isChangingPassword.value = false;
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    passwordMessage.value = 'Password baru minimal 6 karakter.';
    passwordStatusClass.value = 'error';
    isChangingPassword.value = false;
    return;
  }

  try {
    const adminUser = authStore.user;
    if (!adminUser || adminUser.role !== 'admin') {
        throw new Error('Anda bukan admin atau belum login.');
    }

    const currentAdminData = (await fetchUsersById(adminUser.id));
    if (currentAdminData.password !== passwordForm.currentPassword) {
        throw new Error('Password saat ini salah.');
    }

    await updateUser(adminUser.id, { password: passwordForm.newPassword });

    passwordMessage.value = 'Password berhasil diubah!';
    passwordStatusClass.value = 'success';
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmNewPassword = '';
  } catch (error) {
    console.error('Failed to change password:', error);
    passwordMessage.value = error.message || 'Gagal mengubah password. Silakan coba lagi.';
    passwordStatusClass.value = 'error';
  } finally {
    isChangingPassword.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.admin-settings {
  padding: 30px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.admin-settings.sidebar-collapsed {
  margin-left: 80px;
}

.admin-settings.sidebar-expanded {
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

.settings-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

.section-header {
  font-family: 'Playfair Display', serif;
  font-size: 1.8em;
  color: #d32f2f;
  margin-top: 0;
  margin-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
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

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="time"],
.form-group input[type="password"],
.form-group textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
  transform: scale(1.2);
  cursor: pointer;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  outline: none;
}

.form-actions {
  margin-top: 25px;
  text-align: right;
}

.form-status-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
}

.form-status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .admin-settings {
    margin-left: 0 !important;
    padding: 20px;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .settings-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .section-header {
    font-size: 1.5em;
    margin-bottom: 15px;
  }
  
  .form-actions {
    text-align: center;
  }
}
</style>