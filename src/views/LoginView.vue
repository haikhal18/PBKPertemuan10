<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const credentials = ref({ email: '', password: '' });

const handleLogin = () => {
  if (!credentials.value.email || !credentials.value.password) {
    alert('Email dan password tidak boleh kosong.');
    return;
  }
  authStore.login(credentials.value);
};
</script>

<template>
  <div class="login-page-container">
    <div class="login-card">
      <div class="card-header">
        <h1 class="title">Selamat Datang!</h1>
        <p class="subtitle">Silakan masuk untuk melanjutkan</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Alamat Email</label>
          <input 
            type="email" 
            v-model="credentials.email" 
            id="email" 
            placeholder="contoh@email.com"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            v-model="credentials.password" 
            id="password" 
            placeholder="••••••••"
            required
          >
        </div>
        
        <button type="submit" class="submit-button">Login</button>
      </form>
      
      <div class="card-footer">
        <p>Belum punya akun? 
          <RouterLink to="/register" class="register-link">Daftar di sini</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Kontainer utama untuk meletakkan kartu di tengah halaman */
.login-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px); /* Adjust height considering navbar/footer */
  background-color: var(--color-background);
}

/* Gaya untuk kartu login */
.login-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--color-surface);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
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

/* Gaya untuk form dan elemennya */
.login-form {
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

/* Gaya untuk footer kartu */
.card-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
}

.register-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>