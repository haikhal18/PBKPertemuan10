<template>
    <div :class="['card', { 'card-hover': hoverEffect }]">
      <div v-if="$slots.header" class="card-header">
        <slot name="header"></slot>
      </div>
      <div v-if="imageUrl" class="card-image-container">
        <img :src="imageUrl" :alt="imageAlt" class="card-image" />
      </div>
      <div class="card-body">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" class="card-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Card', // Nama komponen
  
    props: {
      // URL gambar untuk ditampilkan di dalam kartu (opsional)
      imageUrl: {
        type: String,
        default: '',
      },
      // Teks alternatif untuk gambar (penting untuk aksesibilitas)
      imageAlt: {
        type: String,
        default: 'Card image',
      },
      // Apakah kartu memiliki efek hover (misal: sedikit naik atau bayangan)
      hoverEffect: {
        type: Boolean,
        default: false,
      },
    },
  };
  </script>
  
  <style scoped>
  .card {
    background-color: white;
    border-radius: 12px; /* Border-radius yang lebih besar untuk kesan premium */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08); /* Bayangan lembut untuk kedalaman */
    overflow: hidden; /* Penting agar border-radius berlaku pada gambar */
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transisi untuk efek hover */
    border: 1px solid rgba(0, 0, 0, 0.05); /* Sedikit border sangat tipis */
  }
  
  /* Efek hover untuk kartu */
  .card-hover:hover {
    transform: translateY(-5px); /* Sedikit naik saat di-hover */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Bayangan lebih kuat saat di-hover */
  }
  
  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    color: #333;
  }
  
  .card-image-container {
    width: 100%;
    padding-top: 66.66%; /* Rasio aspek 3:2 (tinggi 66.66% dari lebar) */
    position: relative;
    overflow: hidden;
  }
  
  .card-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Memastikan gambar menutupi area tanpa terdistorsi */
    display: block;
  }
  
  .card-body {
    padding: 20px; /* Padding yang nyaman untuk konten */
    flex-grow: 1; /* Agar body mengisi ruang jika tidak ada footer */
    color: #444;
    line-height: 1.6;
  }
  
  .card-footer {
    padding: 16px 20px;
    border-top: 1px solid #eee;
    background-color: #f9f9f9; /* Sedikit latar belakang untuk footer */
  }
  </style>