<template>
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="handleClickOutside">
        <div class="modal-container" :style="{ maxWidth: maxWidth }">
          <div v-if="$slots.header" class="modal-header">
            <slot name="header"></slot>
            <button v-if="showCloseButton" class="modal-close-button" @click="closeModal">
              &times; </button>
          </div>
  
          <div class="modal-body">
            <slot></slot>
          </div>
  
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'Modal', // Nama komponen untuk debugging
  
    props: {
      // Prop untuk mengontrol visibilitas modal
      isVisible: {
        type: Boolean,
        default: false,
      },
      // Prop untuk menentukan apakah modal bisa ditutup dengan klik di luar area modal
      closeOnClickOutside: {
        type: Boolean,
        default: true,
      },
      // Prop untuk menentukan apakah tombol silang (x) harus ditampilkan
      showCloseButton: {
        type: Boolean,
        default: true,
      },
      // Prop untuk mengatur lebar maksimum modal (contoh: '500px', '80%')
      maxWidth: {
        type: String,
        default: '600px',
      },
    },
  
    watch: {
      // Watcher untuk mengelola overflow body saat modal muncul/sembunyi
      isVisible(newVal) {
        if (newVal) {
          document.body.style.overflow = 'hidden'; // Mencegah scroll body saat modal terbuka
        } else {
          document.body.style.overflow = ''; // Mengembalikan scroll body
        }
      },
    },
  
    methods: {
      // Metode untuk menutup modal
      closeModal() {
        // Emit event 'close' ke parent komponen
        this.$emit('close');
      },
      // Metode yang dipanggil saat overlay diklik (jika closeOnClickOutside true)
      handleClickOutside() {
        if (this.closeOnClickOutside) {
          this.closeModal();
        }
      },
    },
  
    // Lifecycle hook untuk membersihkan overflow saat komponen dihancurkan
    beforeUnmount() {
      document.body.style.overflow = '';
    },
  };
  </script>
  
  <style scoped>
  /* Overlay Latar Belakang Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Latar belakang semi-transparan gelap */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Pastikan modal di atas konten lain */
  }
  
  /* Kontainer Modal */
  .modal-container {
    background-color: white;
    border-radius: 12px; /* Border-radius yang elegan */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25); /* Bayangan yang menonjol */
    width: 90%; /* Lebar responsif */
    max-height: 90vh; /* Tinggi maksimum */
    overflow-y: auto; /* Scrollable jika kontennya panjang */
    display: flex;
    flex-direction: column;
    position: relative; /* Penting untuk posisi tombol close */
  }
  
  /* Header Modal (slot bernama 'header') */
  .modal-header {
    padding: 20px 25px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.3em;
    font-weight: 600;
    color: #333;
  }
  
  /* Tombol Tutup Modal */
  .modal-close-button {
    background: none;
    border: none;
    font-size: 2em; /* Ukuran 'x' yang besar */
    cursor: pointer;
    color: #888;
    padding: 0; /* Hapus padding default browser */
    line-height: 1; /* Pastikan 'x' berada di tengah */
    transition: color 0.2s ease;
  }
  
  .modal-close-button:hover {
    color: #333;
  }
  
  /* Body Modal (slot default) */
  .modal-body {
    padding: 25px;
    flex-grow: 1; /* Mengisi ruang yang tersisa */
    line-height: 1.6;
    color: #444;
  }
  
  /* Footer Modal (slot bernama 'footer') */
  .modal-footer {
    padding: 20px 25px;
    border-top: 1px solid #eee;
    background-color: #f9f9f9; /* Sedikit latar belakang untuk footer */
    display: flex;
    justify-content: flex-end; /* Tombol biasanya di kanan */
    gap: 10px; /* Jarak antar tombol di footer */
  }
  
  /* --- Transisi Modal --- */
  /* Nama transisi 'modal-fade' sesuai dengan <transition name="modal-fade"> */
  
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease; /* Transisi untuk overlay */
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  
  /* Transisi untuk modal-container (opsional, bisa digabungkan) */
  .modal-fade-enter-active .modal-container,
  .modal-fade-leave-active .modal-container {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  
  .modal-fade-enter-from .modal-container {
    transform: translateY(-20px); /* Muncul dari atas */
    opacity: 0;
  }
  
  .modal-fade-leave-to .modal-container {
    transform: translateY(20px); /* Menghilang ke bawah */
    opacity: 0;
  }
  
  /* Media Queries untuk Responsivitas */
  @media (max-width: 768px) {
    .modal-container {
      width: 95%; /* Lebih lebar di layar kecil */
      max-width: none; /* Hilangkan max-width di layar kecil */
    }
  }
  </style>