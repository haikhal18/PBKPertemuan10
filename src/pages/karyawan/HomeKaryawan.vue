<template>
    <div class="home-penjual max-w-4xl mx-auto mt-10 p-4">
      <h1 class="text-3xl font-bold mb-6">Selamat datang, Penjual!</h1>
  
      <p class="mb-4 text-gray-700">
        Di dashboard ini, kamu bisa mengelola restoran dan menu yang kamu miliki.
      </p>
  
      <div class="flex flex-col md:flex-row gap-4">
        <router-link
          to="/karyawan/restoran-saya"
          class="btn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-center"
        >
          Kelola Restoran Saya
        </router-link>
  
        <router-link
          to="/karyawan/tambah-restoran"
          class="btn bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 text-center"
        >
          Tambah Restoran Baru
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  // Bisa tambahkan logic jika perlu, tapi untuk home sederhana tidak wajib
  </script>
  
  <style scoped>
  .home-penjual {
    background-color: #fff8f2;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }
  
  .btn {
    font-weight: 600;
    transition: background-color 0.3s ease;
  }
  </style>
  