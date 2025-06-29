<template>
    <div class="card">
      <img :src="restaurant.image" :alt="restaurant.name" class="card-img" />
  
      <div class="card-body">
        <h2 class="card-title">{{ restaurant.name }}</h2>
        <p class="card-address">{{ restaurant.address }}</p>
        <p class="card-desc">{{ restaurant.description }}</p>
  
        <RouterLink :to="`/restoran/${restaurant.id}`" class="btn-detail">
          🍽 Lihat Detail
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    restaurant: {
      type: Object,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: transform 0.2s ease;
    width: 100%;
    max-width: 300px;
  }
  
  .card:hover {
    transform: translateY(-5px);
  }
  
  .card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .card-address {
    color: #555;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .card-desc {
    color: #777;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  
  .btn-detail {
    display: inline-block;
    background-color: #ff7f1f;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
  }
  </style>