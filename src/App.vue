<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App', // Nama komponen root
  // Tidak ada komponen lain yang diimpor langsung di sini
  // karena App.vue hanya merender layout melalui <router-view>
};
</script>

<style>
/* CSS Global untuk elemen #app dan body */
/* Variabel CSS dan reset sudah didefinisikan di base.css */

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', sans-serif; /* Pastikan font dasar konsisten */
  color: #333;
  overflow-x: hidden; /* Mencegah scroll horizontal yang tidak diinginkan */
  scroll-behavior: smooth; /* Untuk smooth scrolling link anchor */
  /* background-color: #f8f9fa; Jika ingin background keseluruhan di sini */
}

#app {
  /*
    Secara default di main.js kita menyembunyikan #app sampai semua dimuat.
    Kemudian main.js akan mengubahnya menjadi display: block;
  */
  display: none; /* Sembunyikan #app sampai diaktifkan oleh main.js */
  min-height: 100vh; /* Pastikan elemen #app memiliki tinggi minimum penuh viewport */
  display: flex; /* Aktifkan flexbox untuk menampung layout jika diperlukan */
  flex-direction: column; /* Atur arah flex menjadi kolom */
}

</style>