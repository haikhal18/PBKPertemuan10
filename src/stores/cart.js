import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore();
  const items = ref([]);

  // --- GETTERS ---
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // --- ACTIONS ---

  function saveCartToLocalStorage() {
    if (authStore.isLoggedIn) {
      const userId = authStore.user.id;
      localStorage.setItem(`cart_user_${userId}`, JSON.stringify(items.value));
    }
  }

  function loadCartFromLocalStorage() {
    if (authStore.isLoggedIn) {
      const userId = authStore.user.id;
      const savedCart = localStorage.getItem(`cart_user_${userId}`);
      items.value = savedCart ? JSON.parse(savedCart) : [];
    } else {
      items.value = [];
    }
  }
  
  // Di dalam file: src/stores/cart.js

function addItem(food) {
  // --- MULAI BLOK DEBUG ---
  console.log('--- Aksi AddItem Dipanggil ---');
  console.log('Data makanan yang akan ditambah:', food);
  // Kita cek tipe data dari ID makanan yang dikirim dari FoodCard
  console.log(`ID makanan dari props: ${food.id} (Tipe: ${typeof food.id})`); 
  console.log('Keranjang saat ini (sebelum diubah):', JSON.parse(JSON.stringify(items.value)));
  // --- SELESAI BLOK DEBUG ---

  const existingItem = items.value.find(item => {
    // Kita cek tipe data dari setiap item yang sudah ada di keranjang
    console.log(`Membandingkan: item.id (${item.id}, Tipe: ${typeof item.id}) dengan food.id (${food.id}, Tipe: ${typeof food.id})`);
    return item.id === food.id;
  });

  if (existingItem) {
    console.log('Item ditemukan di keranjang. Menambah kuantitas.');
    existingItem.quantity++;
  } else {
    console.log('Item baru. Menambahkan ke keranjang.');
    items.value.push({ ...food, quantity: 1 });
  }
  
  console.log('Keranjang setelah diubah:', JSON.parse(JSON.stringify(items.value)));
  saveCartToLocalStorage();
  console.log('Mencoba menyimpan ke localStorage...');
  console.log('--- Aksi AddItem Selesai ---');
}

  function increaseQuantity(foodId) {
    const item = items.value.find(item => item.id === foodId);
    if (item) {
      item.quantity++;
      saveCartToLocalStorage();
    }
  }

  function decreaseQuantity(foodId) {
    const item = items.value.find(item => item.id === foodId);
    if (item && item.quantity > 1) {
      item.quantity--;
      saveCartToLocalStorage();
    } else if (item && item.quantity === 1) {
      removeItem(foodId);
    }
  }

  function removeItem(foodId) {
    const index = items.value.findIndex(item => item.id === foodId);
    if (index !== -1) {
      items.value.splice(index, 1);
      saveCartToLocalStorage();
    }
  }

  function clearCart() {
    items.value = [];
    saveCartToLocalStorage();
  }

  return {
    items, totalItems, totalPrice, addItem, removeItem, clearCart, 
    loadCartFromLocalStorage, increaseQuantity, decreaseQuantity
  };
});