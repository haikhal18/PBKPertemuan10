<script setup>
defineProps({
  food: {
    type: Object,
    required: true,
  }
});
const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-content">
      <button @click="emit('close')" class="close-button">&times;</button>
      
      <img :src="food.image" :alt="food.name" class="food-image-large">
      <div class="content-text">
        <h1>{{ food.name }}</h1>
        <p class="price">Rp {{ food.price.toLocaleString('id-ID') }}</p>
        <p class="description">{{ food.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  max-width: 600px;
  width: 90%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2.5rem;
  color: #888;
  cursor: pointer;
}
.food-image-large {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.content-text {
  padding: 2rem;
}
.content-text h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.price {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}
.description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
}
</style>