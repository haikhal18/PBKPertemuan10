<script setup>
import { ref, onMounted } from 'vue';

// Mendefinisikan props: 'initialData' bersifat opsional.
// Jika 'initialData' diberikan, artinya form ini dalam mode 'edit'.
// Jika tidak, artinya mode 'tambah'.
const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});

// Mendefinisikan event 'submit' yang akan dikirim ke komponen induk.
const emit = defineEmits(['submit']);

// State lokal untuk menampung data form.
const formData = ref({
  name: '',
  description: '',
  price: 0,
  image: '' // Tambahkan field gambar jika ada
});

// onMounted akan berjalan saat komponen dimuat.
// Ia memeriksa apakah ada 'initialData' yang dikirim dari props.
onMounted(() => {
  if (props.initialData) {
    // Jika ada, isi formData dengan data tersebut.
    formData.value = { ...props.initialData };
  }
});

// Fungsi yang berjalan saat form disubmit.
const handleSubmit = () => {
  // Mengirimkan event 'submit' ke komponen induk beserta data dari form.
  emit('submit', formData.value);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="food-form">
    <div class="form-group">
      <label for="name">Nama Makanan</label>
      <input 
        id="name"
        type="text" 
        v-model="formData.name" 
        placeholder="Contoh: Nasi Goreng Spesial" 
        required
      >
    </div>
    
    <div class="form-group">
      <label for="description">Deskripsi</label>
      <textarea 
        id="description"
        v-model="formData.description" 
        placeholder="Contoh: Nasi goreng dengan telur dan ayam"
        rows="3"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="price">Harga</label>
      <input 
        id="price"
        type="number" 
        v-model.number="formData.price" 
        placeholder="Contoh: 25000" 
        required
      >
    </div>

    <div class="form-group">
      <label for="image">URL Gambar</label>
      <input 
        id="image"
        type="text" 
        v-model="formData.image" 
        placeholder="Contoh: https://..."
      >
    </div>
    
    <button type="submit" class="submit-btn">Simpan Perubahan</button>
  </form>
</template>

<style scoped>
.food-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

.form-group input,
.form-group textarea {
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 1rem;
  font-family: var(--font-family-base);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(255, 99, 71, 0.2);
}

.submit-btn {
  background-color: var(--color-secondary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: var(--color-secondary-dark);
}
</style>