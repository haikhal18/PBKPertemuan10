<script setup>
// Tidak ada skrip yang dibutuhkan untuk halaman statis ini.
// Bagian <script setup> tetap disertakan untuk konsistensi struktur file.
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

      <p class="closing-text">
        Terima kasih telah memilih Cepat Saji. Selamat menikmati hidangan Anda!
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  min-height: 80vh;
}

.content-container {
  max-width: 800px;
  width: 100%;
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #ff6347; /* Warna oranye tomat */
  margin-bottom: 1.5rem;
}

.intro-text {
  text-align: center;
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

h2 {
  font-size: 1.8rem;
  color: #333;
  border-bottom: 2px solid #ff6347;
  padding-bottom: 0.5rem;
  margin-top: 2rem;
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
  content: '✔'; /* Ganti dengan emoji atau ikon lain jika suka */
  color: #28a745; /* Warna hijau */
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
</style>