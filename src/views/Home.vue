<template>
  <div class="home">
    <section class="hero">
      <h1>Selamat Datang di FoodOrder</h1>
      <p>Pesan makanan favoritmu dari restoran terbaik di sekitar kamu!</p>
      <router-link to="/restaurants" class="btn">Lihat Restoran</router-link>
    </section>

    <section class="features">
      <div class="feature">
        <h2>🛵 Cepat & Mudah</h2>
        <p>Pesan makanan dengan beberapa klik saja.</p>
      </div>
      <div class="feature">
        <h2>🍔 Banyak Pilihan</h2>
        <p>Ratusan restoran dan menu tersedia.</p>
      </div>
      <div class="feature">
        <h2>💳 Pembayaran Aman</h2>
        <p>Pilih metode pembayaran yang kamu suka.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

.hero {
  background-color: #ffe5dc;
  padding: 3rem 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.btn {
  background-color: #ff6347;
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
}

.btn:hover {
  background-color: #e5533d;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.feature {
  max-width: 250px;
  background-color: #fff0ea;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
