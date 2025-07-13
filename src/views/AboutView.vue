<script setup>
// Tidak ada skrip yang dibutuhkan untuk halaman statis ini.
</script>

<template>
  <div class="about-view">
    <div class="content-container">
      <h1 class="page-title">Tentang Cepat Saji</h1>
      
      <p class="intro-text">
        <strong>Cepat Saji</strong> lahir dari kecintaan kami terhadap masakan Indonesia yang kaya rasa dan hasrat untuk menyajikannya dengan cara yang modern, cepat, dan mudah diakses oleh semua orang. Kami percaya bahwa makanan lezat tidak harus rumit dan lama.
      </p>

      <div class="mission-section">
        <h2>Misi Kami</h2>
        <p>
          Misi kami adalah menyajikan hidangan berkualitas tinggi yang dibuat dari bahan-bahan segar pilihan setiap harinya. Kami berkomitmen untuk memberikan pengalaman kuliner yang memuaskan melalui pelayanan yang cepat dan ramah, serta cita rasa yang otentik dan selalu konsisten.
        </p>
      </div>

      <div class="values-section">
        <h2>Nilai-Nilai Kami</h2>
        <ul>
          <li><strong>Kualitas:</strong> Kami hanya menggunakan bahan baku terbaik dari pemasok terpercaya.</li>
          <li><strong>Kecepatan:</strong> Sistem kami dirancang untuk memastikan pesanan Anda siap dalam waktu singkat.</li>
          <li><strong>Kebersihan:</strong> Dapur dan seluruh area operasional kami selalu terjaga kebersihannya sesuai standar tertinggi.</li>
          <li><strong>Kepuasan Pelanggan:</strong> Anda adalah prioritas kami. Kami selalu mendengarkan masukan untuk menjadi lebih baik.</li>
        </ul>
      </div>

      <div class="location-section">
        <h2>Lokasi Kami</h2>
        <div class="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6757657259193!2d101.44522631533234!3d0.5101968637775537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac1c75735161%3A0x2c5c1f1f9b0b45d!2sJl.%20Jend.%20Sudirman%2C%20Kota%20Pekanbaru%2C%20Riau!5e0!3m2!1sid!2sid!4v1672834950123!5m2!1sid!2sid" 
            width="600" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
      <p class="closing-text">
        Terima kasih telah memilih Cepat Saji. Selamat menikmati hidangan Anda!
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  width: 100%; /* Ubah dari 100vw untuk menghindari bug scrollbar horizontal */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem; /* Beri padding lebih agar tidak terlalu mepet ke atas/bawah */
  font-family: var(--font-family-base); /* Gunakan font global */

  background-image: url('@/assets/food-background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.content-container {
  max-width: 800px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.97); /* Sedikit lebih solid agar teks lebih jelas */
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--color-primary); /* Gunakan warna global */
  margin-bottom: 1.5rem;
}

.intro-text {
  text-align: center;
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

h2 {
  font-size: 1.8rem;
  color: var(--color-heading);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
  margin-top: 2.5rem; /* Beri jarak lebih antar seksi */
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  line-height: 1.7;
  color: #666;
}

.values-section ul {
  list-style-type: none;
  padding-left: 0;
}

.values-section li {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.values-section li::before {
  content: '✔';
  color: var(--color-secondary);
  position: absolute;
  left: 0;
  top: 2px;
}

.closing-text {
  text-align: center;
  margin-top: 3rem;
  font-style: italic;
  color: #888;
}

/* STYLE BARU UNTUK PETA LOKASI */
.location-section {
  margin-top: 2.5rem;
}
.map-container {
  overflow: hidden; /* Penting agar border-radius pada iframe terlihat */
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
.map-container iframe {
  width: 100%; /* Membuat peta responsif */
  height: 350px;
  border: none; /* Menghilangkan border default dari iframe */
}
</style>