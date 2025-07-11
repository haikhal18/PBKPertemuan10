<script setup>
// Membuat tahun saat ini secara dinamis untuk copyright.
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} Cepat Saji. All Rights Reserved.</p>
      <p class="project-tag">Dibuat untuk Tugas Akhir PBK</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #343a40; /* Warna abu-abu gelap */
  color: var(--color-background);
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 0.9rem;
}

.footer-content p {
  margin: 0.25rem 0;
}

.project-tag {
  font-style: italic;
  color: #adb5bd; /* Warna abu-abu lebih terang */
}
</style>