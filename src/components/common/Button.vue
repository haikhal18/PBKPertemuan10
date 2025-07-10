<template>
    <button :class="['btn', `btn-${type}`, { 'btn-disabled': disabled }]" :disabled="disabled" @click="handleClick">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: 'Button', // Nama komponen untuk debugging Vue Devtools
  
    props: {
      // Prop 'type' untuk menentukan gaya tombol (misal: primary, secondary, danger)
      type: {
        type: String,
        default: 'primary', // Nilai default jika tidak diberikan
        validator: (value) => ['primary', 'secondary', 'danger', 'text'].includes(value),
        // Validator memastikan nilai type selalu salah satu dari yang diizinkan
      },
      // Prop 'disabled' untuk menonaktifkan tombol
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  
    methods: {
      // Metode yang akan dipanggil saat tombol diklik
      handleClick(event) {
        // Emit event 'click' ke parent komponen
        // Ini memungkinkan parent untuk mendengarkan event @click dari Button.vue
        this.$emit('click', event);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Base styles untuk semua tombol */
  .btn {
    padding: 12px 24px; /* Padding yang lebih besar untuk kesan premium */
    border: none;
    border-radius: 8px; /* Border-radius yang sedikit lebih besar */
    cursor: pointer;
    font-family: 'Open Sans', sans-serif; /* Menggunakan font global atau font kustom */
    font-size: 1em; /* Ukuran font relatif */
    font-weight: 600; /* Sedikit lebih tebal */
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, opacity 0.3s ease;
    white-space: nowrap; /* Mencegah teks tombol patah baris */
  }
  
  /* --- Tipe Tombol --- */
  
  /* Primary Button (Warna utama restoran, misal merah marun atau emas gelap) */
  .btn-primary {
    background-color: #A00; /* Contoh warna merah marun */
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sedikit shadow untuk kedalaman */
  }
  
  .btn-primary:hover:not(.btn-disabled) {
    background-color: #800; /* Warna sedikit lebih gelap saat hover */
  }
  
  /* Secondary Button (Warna sekunder, misal abu-abu terang atau krem) */
  .btn-secondary {
    background-color: #f0f0f0; /* Contoh abu-abu terang */
    color: #333;
    border: 1px solid #ddd;
  }
  
  .btn-secondary:hover:not(.btn-disabled) {
    background-color: #e0e0e0;
    border-color: #ccc;
  }
  
  /* Danger Button (Warna merah untuk aksi berbahaya seperti hapus) */
  .btn-danger {
    background-color: #dc3545; /* Merah standar */
    color: white;
  }
  
  .btn-danger:hover:not(.btn-disabled) {
    background-color: #c82333;
  }
  
  /* Text Button (Tombol tanpa background, hanya teks) */
  .btn-text {
    background-color: transparent;
    color: #333; /* Warna teks gelap */
    padding: 8px 16px; /* Padding lebih kecil */
  }
  
  .btn-text:hover:not(.btn-disabled) {
    text-decoration: underline;
    color: #555;
  }
  
  
  /* --- State Tombol --- */
  
  /* Disabled state */
  .btn-disabled {
    opacity: 0.6; /* Membuat tombol terlihat sedikit transparan */
    cursor: not-allowed; /* Kursor 'not-allowed' */
    box-shadow: none; /* Hilangkan shadow saat disabled */
  }
  
  </style>