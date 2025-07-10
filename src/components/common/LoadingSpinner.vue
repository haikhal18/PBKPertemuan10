<template>
    <div v-if="isLoading" :class="['loading-container', { 'full-screen-overlay': fullScreen }]">
      <div class="spinner" :style="spinnerStyle"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  
  export default {
    name: 'LoadingSpinner', // Nama komponen
  
    props: {
      // Prop untuk mengontrol visibilitas spinner
      isLoading: {
        type: Boolean,
        default: false,
      },
      // Prop untuk menampilkan spinner sebagai overlay layar penuh
      fullScreen: {
        type: Boolean,
        default: false,
      },
      // Prop untuk menambahkan pesan di bawah spinner
      message: {
        type: String,
        default: '',
      },
      // Ukuran spinner (misal: '40px', '2em')
      size: {
        type: String,
        default: '50px',
      },
      // Warna spinner (misal: '#A00', 'blue')
      color: {
        type: String,
        default: '#A00', // Warna aksen utama restoran Anda
      },
      // Ketebalan garis spinner
      thickness: {
        type: String,
        default: '5px',
      },
    },
  
    setup(props) {
      // Computed property untuk dynamic styles
      const spinnerStyle = ref({
        width: props.size,
        height: props.size,
        borderTopColor: props.color,
        borderRightColor: props.color,
        borderBottomColor: props.color,
        borderLeftColor: `${props.color} transparent transparent transparent`, // Memberikan efek putaran
        borderWidth: props.thickness,
      });
  
      // Watcher untuk mengelola overflow body saat fullScreen overlay aktif
      watch(() => props.isLoading, (newVal) => {
        if (props.fullScreen) {
          if (newVal) {
            document.body.style.overflow = 'hidden'; // Mencegah scroll body
          } else {
            document.body.style.overflow = ''; // Mengembalikan scroll body
          }
        }
      });
  
      // Cleanup saat komponen di-unmount
      onUnmounted(() => {
        if (props.fullScreen) {
          document.body.style.overflow = ''; // Pastikan overflow kembali normal
        }
      });
  
      return {
        spinnerStyle,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Kontainer umum untuk spinner dan pesan */
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px; /* Jarak antara spinner dan pesan */
    color: #555; /* Warna teks pesan */
    font-size: 1.1em;
    text-align: center;
  }
  
  /* Spinner itu sendiri */
  .spinner {
    border-radius: 50%;
    animation: spin 0.8s linear infinite; /* Animasi putaran */
    box-sizing: border-box; /* Agar padding/border tidak menambah ukuran */
  }
  
  /* Animasi putaran */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Full-screen overlay */
  .full-screen-overlay {
    position: fixed; /* Menutupi seluruh viewport */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9); /* Latar belakang putih semi-transparan */
    z-index: 2000; /* Pastikan di atas semua elemen lain, termasuk modal */
    display: flex; /* Override default display for centering */
    flex-direction: column; /* Override default flex-direction */
  }
  
  /* Pesan loading */
  .loading-message {
    margin: 0; /* Hapus margin default p */
    font-family: 'Open Sans', sans-serif; /* Pastikan font konsisten */
  }
  </style>