<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-circle">
          <i class="fas fa-utensils"></i>
        </div>
        <h1>Selamat Datang Kembali</h1>
        <p class="welcome-text">Masuk untuk melanjutkan petualangan kuliner Anda</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <div class="input-with-icon">
            <i class="fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required 
              placeholder="Alamat email Anda"
              class="input-field"
            >
          </div>
        </div>

        <div class="form-group">
          <div class="input-with-icon">
            <i class="fas fa-lock"></i>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required 
              placeholder="Kata sandi Anda"
              class="input-field"
            >
          </div>
        </div>

        <div class="forgot-password">
          <router-link to="/forgot-password">Lupa kata sandi?</router-link>
        </div>

        <button type="submit" class="login-btn">
          <i class="fas fa-sign-in-alt"></i> Masuk Sekarang
        </button>

        <div class="social-login">
          <p>Atau masuk dengan</p>
          <div class="social-icons">
            <button type="button" class="social-btn google">
              <i class="fab fa-google"></i>
            </button>
            <button type="button" class="social-btn facebook">
              <i class="fab fa-facebook-f"></i>
            </button>
          </div>
        </div>
      </form>

      <div class="register-section">
        <p>Belum punya akun? <router-link to="/register" class="register-link">Daftar sekarang</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        this.showToast('error', 'Email dan kata sandi wajib diisi!')
        return
      }

      try {
        const response = await fetch(`http://localhost:3000/users?email=${this.email}`)
        const users = await response.json()

        if (users.length === 0) {
          this.showToast('warning', 'Email belum terdaftar!')
          return
        }

        const user = users[0]

        if (user.password === this.password) {
          const authStore = useAuthStore()
          authStore.setUser(user)
          localStorage.setItem('user', JSON.stringify(user))
          
          this.showToast('success', 'Login berhasil!')
          
          // Redirect based on role
          const redirectPath = user.role === 'admin' ? '/admin' 
                          : user.role === 'karyawan' ? '/karyawan' 
                          : '/'
          this.$router.push(redirectPath)

        } else {
          this.showToast('error', 'Kata sandi salah!')
        }
      } catch (error) {
        console.error('Login error:', error)
        this.showToast('error', 'Terjadi kesalahan saat login')
      }
    },
    showToast(type, message) {
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
      toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' 
                         : type === 'error' ? 'fa-times-circle' 
                         : 'fa-exclamation-circle'}></i>
        ${message}
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.classList.add('fade-out')
        setTimeout(() => toast.remove(), 300)
      }, 3000)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --primary-color: #FF6B35;
  --primary-dark: #E55624;
  --primary-light: #FF9E6D;
  --secondary-color: #FFF3EE;
  --text-color: #333;
  --light-gray: #f8f8f8;
  --dark-gray: #555;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
              url('../assets/restaurant-bg.jpg') no-repeat center center;
  background-size: cover;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
  text-align: center;
  padding: 40px 20px 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 3px solid white;
}

.logo-circle i {
  font-size: 36px;
  color: var(--primary-color);
}

.login-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.welcome-text {
  font-size: 15px;
  opacity: 0.9;
  font-weight: 300;
}

.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  font-size: 16px;
}

.input-field {
  width: 100%;
  padding: 14px 15px 14px 45px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;
  background-color: var(--light-gray);
}

.input-field:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  outline: none;
  background-color: white;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.login-btn:hover {
  background: linear-gradient(to right, var(--primary-dark), var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.login-btn i {
  margin-right: 8px;
}

.social-login {
  text-align: center;
  margin-bottom: 20px;
}

.social-login p {
  color: var(--dark-gray);
  margin-bottom: 15px;
  font-size: 14px;
  position: relative;
}

.social-login p::before,
.social-login p::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #e0e0e0;
}

.social-login p::before {
  left: 0;
}

.social-login p::after {
  right: 0;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-btn.google {
  background: #DB4437;
  color: white;
}

.social-btn.facebook {
  background: #4267B2;
  color: white;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.register-section {
  text-align: center;
  padding: 20px 25px 30px;
  font-size: 15px;
  color: var(--dark-gray);
  border-top: 1px solid #eee;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.register-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 25px;
  right: 25px;
  padding: 14px 22px;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast i {
  font-size: 18px;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
  to { opacity: 0; }
}

.toast.fade-out {
  animation: fadeOut 0.3s ease-out forwards;
}

.toast-error {
  background-color: #FF5252;
}

.toast-warning {
  background-color: #FFB74D;
  color: #333;
}

.toast-success {
  background-color: #4CAF50;
}

/* Responsive */
@media (max-width: 576px) {
  .login-card {
    margin: 10px;
    border-radius: 12px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .login-form {
    padding: 25px 20px;
  }
  
  .logo-circle {
    width: 70px;
    height: 70px;
  }
}
</style>