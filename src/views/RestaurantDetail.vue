<template>
    <div class="restaurant-detail">
      <div v-if="restaurant">
        <h2>{{ restaurant.name }}</h2>
        <img :src="restaurant.image" alt="Foto restoran" />
        <p class="desc">{{ restaurant.description }}</p>
  
        <h3>Menu</h3>
        <ul class="menu-list">
          <li v-for="(item, index) in restaurant.menu" :key="index">
            <strong>{{ item.name }}</strong> - Rp {{ item.price.toLocaleString() }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Restoran tidak ditemukan.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RestaurantDetail',
    data() {
      return {
        restaurant: null,
        allRestaurants: [
          {
            id: 1,
            name: 'Pizza Mantap',
            description: 'Pizza oven kayu ala Italia.',
            image: 'https://source.unsplash.com/600x300/?pizza,restaurant',
            menu: [
              { name: 'Pizza Margherita', price: 50000 },
              { name: 'Pizza Pepperoni', price: 60000 },
            ]
          },
          {
            id: 2,
            name: 'Nasi Goreng Legend',
            description: 'Spesialis nasi goreng pedas kampung.',
            image: 'https://source.unsplash.com/600x300/?nasi-goreng,restaurant',
            menu: [
              { name: 'Nasi Goreng Spesial', price: 30000 },
              { name: 'Nasi Goreng Seafood', price: 35000 },
            ]
          },
          {
            id: 3,
            name: 'Sate Madura Pak Slamet',
            description: 'Sate ayam dan kambing, bumbu kacang khas.',
            image: 'https://source.unsplash.com/600x300/?sate,restaurant',
            menu: [
              { name: 'Sate Ayam', price: 25000 },
              { name: 'Sate Kambing', price: 30000 },
            ]
          }
        ]
      }
    },
    created() {
      const restaurantId = parseInt(this.$route.params.id)
      this.restaurant = this.allRestaurants.find(r => r.id === restaurantId)
    }
  }
  </script>
  
  <style scoped>
  .restaurant-detail {
    max-width: 700px;
    margin: 3rem auto;
    padding: 1.5rem;
    background-color: #fff8f2;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }
  
  .restaurant-detail img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 1rem;
  }
  
  .desc {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 1.5rem;
  }
  
  .menu-list {
    list-style: none;
    padding: 0;
  }
  
  .menu-list li {
    background: #ffe5dc;
    margin-bottom: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }
  </style>
  