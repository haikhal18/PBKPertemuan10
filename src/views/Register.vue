<template>
    <div class="register-page">
      <h2>Daftar Akun</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nama Lengkap</label>
          <input type="text" id="name" v-model="name" required />
        </div>
  
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
  
        <div class="form-group">
          <label for="password">Kata Sandi</label>
          <input type="password" id="password" v-model="password" required />
        </div>
  
        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Kata Sandi</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
          />
        </div>
  
        <button type="submit" class="btn">Daftar</button>
      </form>
  
      <p class="login-link">
        Sudah punya akun?
        <router-link to="/login">Masuk di sini</router-link>
      </p>
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
        confirmPassword: "",
      };
    },
    methods: {
      handleRegister() {
        if (this.password !== this.confirmPassword) {
          alert("Kata sandi tidak cocok!");
          return;
        }
  
        // Simulasi penyimpanan data
        alert("Registrasi berhasil! Silakan login.");
        this.$router.push("/login");
      },
    },
  };
  </script>
  
  <style scoped>
  .register-page {
    max-width: 450px;
    margin: 4rem auto;
    padding: 2rem;
    background-color: #fff0ea;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .register-page h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .btn {
    background-color: #ff6347;
    color: white;
    padding: 0.75rem;
    width: 100%;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #e5533d;
  }
  
  .login-link {
    text-align: center;
    margin-top: 1rem;
  }
  </style>
  