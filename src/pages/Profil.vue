<template>
  <div class="profile-container">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="avatar-container">
        <img :src="avatarUrl" alt="User Avatar" class="avatar" @click="triggerFileInput">
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleAvatarUpload" 
          accept="image/*"
          style="display: none"
        >
        <button class="edit-avatar-btn" @click="triggerFileInput">
          <i class="fas fa-camera"></i>
        </button>
      </div>
      <h1>{{ name || 'Pengguna' }}</h1>
      <p class="email">{{ email }}</p>
    </div>

    <!-- Profile Form -->
    <div class="profile-form-container">
      <form @submit.prevent="saveProfile" class="profile-form">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <div class="input-container">
            <i class="fas fa-user"></i>
            <input 
              v-model="name" 
              type="text" 
              placeholder="Masukkan nama lengkap"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <div class="input-container">
            <i class="fas fa-envelope"></i>
            <input 
              v-model="email" 
              type="email" 
              readonly
              class="readonly-input"
            >
          </div>
        </div>

        <div class="form-group">
          <label>Nomor Telepon</label>
          <div class="input-container">
            <i class="fas fa-phone"></i>
            <input 
              v-model="phone" 
              type="tel" 
              placeholder="Masukkan nomor telepon"
              required
              pattern="[0-9]{10,13}"
              title="Masukkan nomor telepon yang valid (10-13 digit)"
            >
          </div>
        </div>

        <div class="form-group">
          <label>Alamat</label>
          <div class="input-container">
            <i class="fas fa-map-marker-alt"></i>
            <textarea 
              v-model="address" 
              placeholder="Masukkan alamat lengkap"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn">
            <i class="fas fa-save"></i> Simpan Perubahan
          </button>
          <button type="button" class="logout-btn" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i> Keluar
          </button>
        </div>
      </form>
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccess" class="notification success">
      <i class="fas fa-check-circle"></i>
      <span>Profil berhasil diperbarui!</span>
      <button @click="showSuccess = false" class="close-notification">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const name = ref('')
    const email = ref('')
    const phone = ref('')
    const address = ref('')
    const avatarUrl = ref('https://via.placeholder.com/150?text=Avatar')
    const showSuccess = ref(false)
    const fileInput = ref(null)

    const loadProfile = () => {
      const user = authStore.user
      if (!user) {
        router.push('/login')
        return
      }

      email.value = user.email

      // Load from localStorage
      const savedProfile = localStorage.getItem(`profile_${user.id}`)
      if (savedProfile) {
        const data = JSON.parse(savedProfile)
        name.value = data.name || ''
        phone.value = data.phone || ''
        address.value = data.address || ''
        avatarUrl.value = data.avatarUrl || 'https://via.placeholder.com/150?text=Avatar'
      }
    }

    const saveProfile = () => {
      const user = authStore.user
      if (!user) return

      const profile = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        avatarUrl: avatarUrl.value,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile))
      showSuccess.value = true
      setTimeout(() => showSuccess.value = false, 3000)
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleAvatarUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return

      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        avatarUrl.value = e.target.result
      }
      reader.readAsDataURL(file)
    }

    const handleLogout = () => {
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        authStore.logout()
        router.push('/login')
      }
    }

    onMounted(() => {
      loadProfile()
    })

    return {
      name,
      email,
      phone,
      address,
      avatarUrl,
      showSuccess,
      fileInput,
      saveProfile,
      triggerFileInput,
      handleAvatarUpload,
      handleLogout
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ff7f1f;
  cursor: pointer;
  transition: transform 0.3s;
}

.avatar:hover {
  transform: scale(1.05);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #ff7f1f;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-avatar-btn:hover {
  background: #e6731c;
}

.profile-header h1 {
  font-size: 1.8rem;
  margin: 0.5rem 0 0.2rem;
  color: #333;
}

.email {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.profile-form-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.input-container {
  position: relative;
}

.input-container i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.input-container input,
.input-container textarea {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  transition: border 0.3s;
}

.input-container textarea {
  padding: 0.8rem 1rem;
  min-height: 100px;
}

.input-container input:focus,
.input-container textarea:focus {
  border-color: #ff7f1f;
  outline: none;
}

.readonly-input {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-btn {
  flex: 1;
  background: #ff7f1f;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.save-btn:hover {
  background: #e6731c;
}

.logout-btn {
  flex: 1;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: #c0392b;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #2ecc71;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

.notification i {
  font-size: 1.2rem;
}

.close-notification {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 1rem;
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .profile-form-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .save-btn,
  .logout-btn {
    width: 100%;
  }
}
</style>