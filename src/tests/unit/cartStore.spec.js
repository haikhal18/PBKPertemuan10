import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../../stores/cart.js'; 
import { useAuthStore } from '../../stores/auth.js'; 
import { describe, it, expect, beforeEach } from 'vitest';

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with an empty cart when no user is logged in', () => {
    const cartStore = useCartStore();
    cartStore.loadCartFromLocalStorage();
    expect(cartStore.items).toEqual([]);
  });

  it('adds an item to the cart for a logged-in user', () => {
    const authStore = useAuthStore();
    authStore.user = { id: 1, name: 'Test User', role: 'user' };

    const cartStore = useCartStore();
    const mockFood = { id: 1, name: 'Nasi Goreng', price: 25000,quantity: 1 };
    cartStore.addItem(mockFood);

    expect(cartStore.items).toHaveLength(1);
    expect(cartStore.items[0]).toEqual(mockFood);
  });

  // ... (tes-tes lainnya) ...
  
  it('maintains separate carts for different users', () => {
    const cartStore = useCartStore();
    const authStore = useAuthStore();

    // -- Sesi User 1 --
    authStore.user = { id: 1, name: 'User Satu', role: 'user' };
    const foodForUser1 = { id: 10, name: 'Sate', price: 30000 };
    cartStore.addItem(foodForUser1);
    
    expect(cartStore.items).toHaveLength(1);

    // -- Simulasikan Logout dan Login sebagai User 2 --
    authStore.user = { id: 2, name: 'User Dua', role: 'user' };
    cartStore.loadCartFromLocalStorage();

    expect(cartStore.items).toHaveLength(0);

    // -- Simulasikan kembali ke User 1 --
    authStore.user = { id: 1, name: 'User Satu', role: 'user' };
    cartStore.loadCartFromLocalStorage();
    
    expect(cartStore.items).toHaveLength(1);
    expect(cartStore.totalPrice).toBe(30000);
  });
});