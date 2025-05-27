<template>
  <div class="restaurants-page">
    <h2>Daftar Restoran</h2>
    <div class="restaurant-list">
      <div class="restaurant-card" v-for="restaurant in restaurants" :key="restaurant.id">
        <img :src="restaurant.image" alt="Gambar restoran" />
        <h3>{{ restaurant.name }}</h3>
        <p>{{ restaurant.description }}</p>
        <router-link :to="`/restaurans/${restaurant.id}`" class="btn">Lihat Menu</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Restaurans', 
  data() {
    return {
      restaurants: [
        {
          id: 1,
          name: 'Pizza Mantap',
          description: 'Pizza oven kayu ala Italia.',
          image: 'https://source.unsplash.com/400x250/?pizza,restaurant',
        },
        {
          id: 2,
          name: 'Nasi Goreng Legend',
          description: 'Spesialis nasi goreng pedas kampung.',
          image: 'https://source.unsplash.com/400x250/?nasi-goreng,restaurant',
        },
        {
          id: 3,
          name: 'Sate Madura Pak Slamet',
          description: 'Sate ayam dan kambing, bumbu kacang khas.',
          image: 'https://source.unsplash.com/400x250/?sate,restaurant',
        },
      ]
    }
  }
}
</script>

<style scoped>
.restaurants-page {
  padding: 2rem;
  text-align: center;
}

.restaurant-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.restaurant-card {
  width: 300px;
  background-color: #fff8f2;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: left;
}

.restaurant-card img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.restaurant-card h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.restaurant-card p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  background-color: #ff6347;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.btn:hover {
  background-color: #e5533d;
}
</style>
