<template>
  <div class="register-container">
    <div class="register-card">
      <div class="header-section">
        <div class="logo-circle">
          <i class="fas fa-utensils"></i>
        </div>
        <h1>Daftar Member</h1>
        <p class="welcome-text">Bergabunglah untuk pengalaman kuliner eksklusif</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <div class="input-with-icon">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              required 
              placeholder="Nama lengkap"
              class="input-field"
            >
          </div>
        </div>

        <div class="form-group">
          <div class="input-with-icon">
            <i class="fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required 
              placeholder="Alamat email"
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
              placeholder="Kata sandi (min. 6 karakter)"
              class="input-field"
            >
          </div>
        </div>

        <div class="form-group">
          <div class="input-with-icon">
            <i class="fas fa-lock"></i>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required 
              placeholder="Konfirmasi kata sandi"
              class="input-field"
            >
          </div>
        </div>

        <button type="submit" class="register-btn">
          <i class="fas fa-user-plus"></i> Daftar Sekarang
        </button>

        <div class="terms-text">
          Dengan mendaftar, Anda menyetujui <a href="#">Syarat & Ketentuan</a> kami
        </div>
      </form>

      <div class="login-section">
        <p>Sudah punya akun? <router-link to="/login" class="login-link">Masuk disini</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.showToast("error", "Kata sandi tidak cocok!");
        return;
      }

      if (this.password.length < 6) {
        this.showToast("error", "Password harus minimal 6 karakter");
        return;
      }

      try {
        const check = await fetch(`http://localhost:3000/users?email=${this.email}`);
        const existing = await check.json();
        
        if (existing.length > 0) {
          this.showToast("warning", "Email sudah terdaftar!");
          return;
        }

        const newUser = {
          name: this.name,
          email: this.email,
          password: this.password,
          role: "user" // Default role as user
        };

        const res = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (!res.ok) throw new Error("Gagal mendaftarkan user");

        const createdUser = await res.json();

        const profileKey = `profile_${createdUser.id}`;
        const profile = {
          name: this.name,
          email: this.email,
          phone: '',
          joinDate: new Date().toISOString(),
          rewardsPoints: 0 // Add rewards system for restaurant
        };
        localStorage.setItem(profileKey, JSON.stringify(profile));

        this.showToast("success", "Registrasi berhasil! Silakan login.");
        this.$router.push("/login");
        
      } catch (error) {
        console.error("Registration error:", error);
        this.showToast("error", "Terjadi kesalahan saat registrasi");
      }
    },
    showToast(type, message) {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  }
};
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

.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
              url('../assets/restoran.jpg') no-repeat center center;
  background-size: cover;
  padding: 20px;
}

.register-card {
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

.header-section {
  text-align: center;
  padding: 40px 20px 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: rgb(255, 145, 0);
  position: relative;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: rgb(255, 255, 255);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 15px rgb(0, 0, 0);
}

.logo-circle i {
  font-size: 36px;
  color: var(--primary-color);
}

.header-section h1 {
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

.register-form {
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

.input-field::placeholder {
  color: #aaa;
}

.register-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  color: rgb(255, 145, 0);
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.register-btn:hover {
  background: linear-gradient(to right, var(--primary-dark), var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.register-btn i {
  margin-right: 8px;
}

.terms-text {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: var(--dark-gray);
}

.terms-text a {
  color: var(--primary-color);
  text-decoration: none;
}

.terms-text a:hover {
  text-decoration: underline;
}

.login-section {
  text-align: center;
  padding: 20px 25px 30px;
  font-size: 15px;
  color: var(--dark-gray);
  border-top: 1px solid #eee;
}

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.login-link:hover {
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
}

.toast i {
  margin-right: 10px;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
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
  .register-card {
    margin: 10px;
    border-radius: 12px;
  }
  
  .header-section h1 {
    font-size: 24px;
  }
  
  .register-form {
    padding: 25px 20px;
  }
  
  .logo-circle {
    width: 70px;
    height: 70px;
  }
}
</style>