<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Kata Sandi</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit" class="btn">Masuk</button>
    </form>

    <p class="register-link">
      Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      // Contoh validasi sederhana
      if (this.email === 'user@example.com' && this.password === 'password') {
        alert('Login berhasil!');
        this.$router.push('/'); // redirect ke home
      } else {
        alert('Email atau kata sandi salah!');
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: #fff0ea;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-page h2 {
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

.register-link {
  text-align: center;
  margin-top: 1rem;
}
</style>
