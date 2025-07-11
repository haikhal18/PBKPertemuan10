<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const isRegistering = ref(false); // State untuk loading

/**
 * Menangani proses registrasi dengan pembuatan ID manual.
 */
const handleRegister = async () => {
  if (isRegistering.value) return; // Mencegah klik ganda

  // Validasi password
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Password dan Konfirmasi Password tidak cocok!');
    return;
  }

  isRegistering.value = true;
  try {
    // 1. Ambil semua user untuk mencari ID tertinggi
    const response = await axios.get('http://localhost:3000/users');
    const users = response.data;

    // 2. Cari ID tertinggi. Ubah id string ke angka untuk perbandingan.
    const maxId = users.reduce((max, user) => {
      // Hanya proses ID yang merupakan angka valid
      const currentId = parseInt(user.id, 10);
      return !isNaN(currentId) && currentId > max ? currentId : max;
    }, 0);

    // 3. Buat ID baru dan ubah kembali ke string agar konsisten
    const newId = String(maxId + 1);

    // 4. Siapkan data pengguna baru DENGAN ID yang sudah kita buat
    const newUserData = {
      id: newId, // <- Menyertakan ID yang sudah kita buat
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      role: 'user'
    };

    // 5. Kirim data ke API menggunakan metode POST
    await axios.post('http://localhost:3000/users', newUserData);

    alert('Registrasi berhasil! Silakan login dengan akun Anda.');
    router.push('/login');

  } catch (error) {
    console.error('Registrasi gagal:', error);
    alert('Terjadi kesalahan saat mendaftar. Mohon coba lagi.');
  } finally {
    isRegistering.value = false;
  }
};
</script>

<template>
  <div class="register-page-container">
    <div class="register-card">
      <div class="card-header">
        <h1 class="title">Buat Akun Baru</h1>
        <p class="subtitle">ID akan dibuat secara otomatis dan aman</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nama Lengkap</label>
          <input 
            type="text" 
            v-model="formData.name" 
            id="name" 
            placeholder="Nama Anda"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="email">Alamat Email</label>
          <input 
            type="email" 
            v-model="formData.email" 
            id="email" 
            placeholder="contoh@email.com"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            v-model="formData.password" 
            id="password" 
            placeholder="••••••••"
            required
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Password</label>
          <input 
            type="password" 
            v-model="formData.confirmPassword" 
            id="confirmPassword" 
            placeholder="••••••••"
            required
          >
        </div>
        
        <button type="submit" class="submit-button" :disabled="isRegistering">
          {{ isRegistering ? 'Mendaftar...' : 'Daftar' }}
        </button>
      </form>
      
      <div class="card-footer">
        <p>Sudah punya akun? 
          <RouterLink to="/login" class="login-link">Masuk di sini</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  background-color: var(--color-background);
}

.register-card {
  width: 100%;
  max-width: 450px;
  background-color: var(--color-surface);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.subtitle {
  margin-top: 0.5rem;
  color: var(--color-text);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 99, 71, 0.2);
}

.submit-button {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: var(--color-primary-dark);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.card-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
}

.login-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>