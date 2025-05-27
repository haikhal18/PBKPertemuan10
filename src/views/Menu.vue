<template>
  <div class="menu-page">
    <h2>Menu Makanan</h2>
    <div class="menu-list">
      <div class="menu-card" v-for="(item, index) in menuItems" :key="index">
        <img :src="item.image" alt="Makanan" />
        <h3>{{ item.name }}</h3>
        <p class="restaurant">Restoran: {{ item.restaurant }}</p>
        <p class="price">Harga: Rp {{ item.price.toLocaleString() }}</p>
        <button @click="addToCart(item)" class="btn">Tambah ke Keranjang</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      menuItems: [
        {
          name: 'Pizza Margherita',
          price: 50000,
          restaurant: 'Pizza Mantap',
          image: 'https://source.unsplash.com/300x200/?pizza',
        },
        {
          name: 'Nasi Goreng Spesial',
          price: 30000,
          restaurant: 'Nasi Goreng Legend',
          image: 'https://source.unsplash.com/300x200/?fried-rice',
        },
        {
          name: 'Sate Ayam',
          price: 25000,
          restaurant: 'Sate Madura Pak Slamet',
          image: 'https://source.unsplash.com/300x200/?satay',
        },
      ]
    }
  },
  methods: {
    addToCart(item) {
      alert(`"${item.name}" ditambahkan ke keranjang.`);
    }
  }
}
</script>

<style scoped>
.menu-page {
  padding: 2rem;
  text-align: center;
}

.menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.menu-card {
  width: 260px;
  background: #fff7f0;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: left;
}

.menu-card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  object-fit: cover;
  height: 160px;
}

.menu-card h3 {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.restaurant {
  font-size: 0.9rem;
  color: #555;
}

.price {
  font-weight: bold;
  margin: 0.5rem 0;
}

.btn {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  background-color: #e5533d;
}
</style>
