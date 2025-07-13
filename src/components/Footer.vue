<script setup>
// Membuat tahun saat ini secara dinamis untuk copyright.
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="footer-text">&copy; {{ currentYear }} <strong>Cepat Saji</strong>. All rights reserved.</p>
      <p class="footer-subtext">Dibuat dengan ❤️ untuk Tugas Akhir PBK</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #212529; /* Lebih gelap dan profesional */
  color: #f1f1f1;
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 0.95rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.footer-text {
  margin: 0;
  font-weight: 400;
}

.footer-subtext {
  font-style: italic;
  color: #ced4da;
  margin: 0;
  font-size: 0.85rem;
}
</style>
