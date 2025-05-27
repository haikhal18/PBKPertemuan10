<template>
    <div class="profile-page">
      <h2>Profil Pengguna</h2>
  
      <form @submit.prevent="saveProfile" class="profile-form">
        <label>Nama Lengkap</label>
        <input v-model="name" type="text" required />
  
        <label>Email</label>
        <input v-model="email" type="email" required />
  
        <label>Nomor HP</label>
        <input v-model="phone" type="text" required />
  
        <button type="submit" class="btn-save">Simpan</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Profile',
    data() {
      return {
        name: '',
        email: '',
        phone: ''
      }
    },
    methods: {
      loadProfile() {
        const savedProfile = localStorage.getItem('profile')
        if (savedProfile) {
          const data = JSON.parse(savedProfile)
          this.name = data.name
          this.email = data.email
          this.phone = data.phone
        }
      },
      saveProfile() {
        const profile = {
          name: this.name,
          email: this.email,
          phone: this.phone
        }
        localStorage.setItem('profile', JSON.stringify(profile))
        alert('Profil berhasil disimpan.')
      }
    },
    mounted() {
      this.loadProfile()
    }
  }
  </script>
  
  <style scoped>
  .profile-page {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fdfdfd;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  label {
    font-weight: bold;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .btn-save {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .btn-save:hover {
    background-color: #45a049;
  }
  </style>
  