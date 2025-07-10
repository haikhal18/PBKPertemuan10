<template>
    <div class="auth-view">
      <section class="auth-container">
        <LoadingSpinner v-if="isLoading" :isLoading="isLoading" :fullScreen="true" message="Memproses..." />
  
        <div class="auth-box">
          <h2 class="auth-title">{{ isRegisterMode ? 'Daftar Akun Baru' : 'Masuk ke Akun Anda' }}</h2>
          <p class="auth-subtitle">
            {{ isRegisterMode ? 'Gabung sekarang dan nikmati kemudahan pemesanan!' : 'Akses dashboard Anda untuk mengelola pesanan dan lainnya.' }}
          </p>
  
          <form v-if="!isRegisterMode" @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label for="login-username">Username:</label>
              <input type="text" id="login-username" v-model="loginForm.username" required autocomplete="username">
            </div>
            <div class="form-group">
              <label for="login-password">Password:</label>
              <input type="password" id="login-password" v-model="loginForm.password" required autocomplete="current-password">
            </div>
            <p v-if="loginError" class="error-message">{{ loginError }}</p>
            <Button type="primary" :disabled="isLoading">Masuk</Button>
          </form>
  
          <form v-else @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group">
              <label for="register-username">Username:</label>
              <input type="text" id="register-username" v-model="registerForm.username" required>
              <p v-if="usernameError" class="validation-error">{{ usernameError }}</p>
            </div>
            <div class="form-group">
              <label for="register-email">Email:</label>
              <input type="email" id="register-email" v-model="registerForm.email" required>
              <p v-if="emailError" class="validation-error">{{ emailError }}</p>
            </div>
            <div class="form-group">
              <label for="register-password">Password:</label>
              <input type="password" id="register-password" v-model="registerForm.password" required>
              <p v-if="passwordError" class="validation-error">{{ passwordError }}</p>
            </div>
            <div class="form-group">
              <label for="register-confirm-password">Konfirmasi Password:</label>
              <input type="password" id="register-confirm-password" v-model="registerForm.confirmPassword" required>
              <p v-if="confirmPasswordError" class="validation-error">{{ confirmPasswordError }}</p>
            </div>
            <p v-if="registerError" class="error-message">{{ registerError }}</p>
            <Button type="primary" :disabled="isLoading">Daftar</Button>
          </form>
  
          <div class="auth-toggle">
            <p v-if="!isRegisterMode">Belum punya akun? <a href="#" @click.prevent="toggleMode">Daftar di sini.</a></p>
            <p v-else>Sudah punya akun? <a href="#" @click.prevent="toggleMode">Masuk di sini.</a></p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, reactive, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from '@/components/common/Button.vue';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import { useAuthStore } from '@/stores/auth'; // Pastikan path benar
  import { registerUser } from '@/composables/useApi'; // Asumsi ada fungsi registerUser
  
  export default {
    name: 'AuthView',
    components: {
      Button,
      LoadingSpinner,
    },
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
  
      const isRegisterMode = ref(false); // Mengontrol apakah mode login atau register
  
      // Data Form Login
      const loginForm = reactive({
        username: '',
        password: '',
      });
      const loginError = ref('');
  
      // Data Form Register
      const registerForm = reactive({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      const usernameError = ref('');
      const emailError = ref('');
      const passwordError = ref('');
      const confirmPasswordError = ref('');
      const registerError = ref('');
  
      const isLoading = ref(false); // Global loading state for forms
  
      // Watchers for real-time validation (Register Form)
      watch(() => registerForm.username, (newVal) => {
        if (newVal.length < 3 && newVal.length > 0) {
          usernameError.value = 'Username minimal 3 karakter.';
        } else {
          usernameError.value = '';
        }
      });
  
      watch(() => registerForm.email, (newVal) => {
        if (newVal && !/\S+@\S+\.\S+/.test(newVal)) {
          emailError.value = 'Format email tidak valid.';
        } else {
          emailError.value = '';
        }
      });
  
      watch(() => registerForm.password, (newVal) => {
        if (newVal.length < 6 && newVal.length > 0) {
          passwordError.value = 'Password minimal 6 karakter.';
        } else {
          passwordError.value = '';
        }
        // Re-validate confirm password if password changes
        if (registerForm.confirmPassword && registerForm.confirmPassword !== newVal) {
          confirmPasswordError.value = 'Konfirmasi password tidak cocok.';
        } else if (registerForm.confirmPassword) {
          confirmPasswordError.value = '';
        }
      });
  
      watch(() => registerForm.confirmPassword, (newVal) => {
        if (newVal && newVal !== registerForm.password) {
          confirmPasswordError.value = 'Konfirmasi password tidak cocok.';
        } else {
          confirmPasswordError.value = '';
        }
      });
  
      // Toggle antara mode login dan register
      const toggleMode = () => {
        isRegisterMode.value = !isRegisterMode.value;
        // Clear all form data and errors when toggling mode
        Object.assign(loginForm, { username: '', password: '' });
        loginError.value = '';
        Object.assign(registerForm, { username: '', email: '', password: '', confirmPassword: '' });
        usernameError.value = '';
        emailError.value = '';
        passwordError.value = '';
        confirmPasswordError.value = '';
        registerError.value = '';
      };
  
      // Handle Login Logic
      const handleLogin = async () => {
        isLoading.value = true;
        loginError.value = '';
        try {
          const user = await authStore.login(loginForm.username, loginForm.password);
          // Arahkan user sesuai rolenya
          if (user.role === 'admin') {
            router.push('/admin');
          } else if (user.role === 'karyawan') {
            router.push('/staff');
          } else { // default ke user atau home
            router.push('/');
          }
        } catch (error) {
          console.error('Login error:', error);
          loginError.value = error.message || 'Login gagal. Periksa username dan password Anda.';
        } finally {
          isLoading.value = false;
        }
      };
  
      // Handle Register Logic
      const handleRegister = async () => {
        // Basic validation
        if (usernameError.value || emailError.value || passwordError.value || confirmPasswordError.value ||
            !registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
          registerError.value = 'Mohon lengkapi form dengan benar.';
          return;
        }
        if (registerForm.password !== registerForm.confirmPassword) {
          registerError.value = 'Konfirmasi password tidak cocok.';
          return;
        }
  
        isLoading.value = true;
        registerError.value = '';
        try {
          const newUser = {
            username: registerForm.username,
            email: registerForm.email,
            password: registerForm.password, // Dalam aplikasi nyata, password harus di-hash di backend
            role: 'user', // Default role untuk pendaftaran adalah 'user'
          };
          const response = await registerUser(newUser); // Panggil API untuk registrasi
          console.log('Registrasi berhasil:', response);
          alert('Registrasi berhasil! Silakan login dengan akun Anda.');
          toggleMode(); // Kembali ke mode login setelah registrasi berhasil
        } catch (error) {
          console.error('Registrasi gagal:', error);
          registerError.value = error.message || 'Registrasi gagal. Username atau email mungkin sudah terdaftar.';
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        isRegisterMode,
        toggleMode,
        loginForm,
        loginError,
        handleLogin,
        registerForm,
        usernameError,
        emailError,
        passwordError,
        confirmPasswordError,
        registerError,
        handleRegister,
        isLoading,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Variabel CSS, konsisten dengan base.css */
  :root {
    --primary-color: #a00;
    --secondary-color: #f0f0f0;
    --text-dark: #333;
    --text-light: #f0f0f0;
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Open Sans', sans-serif;
  }
  
  .auth-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5; /* Latar belakang abu-abu muda */
    font-family: var(--font-body);
    color: var(--text-dark);
  }
  
  .auth-container {
    padding: 40px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px; /* Lebar maksimal form */
    text-align: center;
    position: relative; /* Untuk positioning loading spinner overlay */
  }
  
  .auth-title {
    font-family: var(--font-heading);
    font-size: 2.2em;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  
  .auth-subtitle {
    font-size: 1.1em;
    color: #666;
    margin-bottom: 30px;
  }
  
  .auth-form {
    margin-top: 30px;
    text-align: left; /* Biar label dan input rata kiri */
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
  }
  
  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group input[type="password"] {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1em;
    font-family: var(--font-body);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box; /* Pastikan padding tidak menambah lebar */
  }
  
  .form-group input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(170, 0, 0, 0.1);
    outline: none;
  }
  
  .validation-error {
    color: #dc3545; /* Merah untuk error */
    font-size: 0.85em;
    margin-top: 5px;
    text-align: left;
  }
  
  .error-message {
    color: #dc3545;
    font-size: 1em;
    margin-top: -10px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 500;
  }
  
  .auth-form .btn {
    width: 100%;
    padding: 15px; /* Tombol lebih besar */
    font-size: 1.1em;
    margin-top: 10px;
  }
  
  .auth-toggle {
    margin-top: 30px;
    font-size: 0.95em;
    color: #666;
  }
  
  .auth-toggle a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
  }
  
  .auth-toggle a:hover {
    text-decoration: underline;
  }
  
  /* Media Queries */
  @media (max-width: 500px) {
    .auth-container {
      margin: 20px;
      padding: 30px;
    }
    .auth-title {
      font-size: 1.8em;
    }
    .auth-subtitle {
      font-size: 1em;
    }
  }
  </style>