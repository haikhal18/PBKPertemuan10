// __tests__/stores/cart.test.js

import { setActivePinia, createPinia } from 'pinia'; // Untuk inisialisasi Pinia di setiap test
import { useCartStore } from '../../src/stores/cart'; // Impor store yang akan diuji

// Impor fungsi dari Vitest (framework pengujian)
import { describe, it, expect, beforeEach, vi } from 'vitest';

// --- Mock localStorage ---
// Kita membuat mock (tiruan) dari localStorage agar operasi test tidak memengaruhi
// atau bergantung pada localStorage di browser sebenarnya.
const localStorageMock = (function() {
  let store = {}; // Objek untuk menyimpan data
  return {
    getItem: vi.fn((key) => store[key] || null), // Mock getItem
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }), // Mock setItem
    removeItem: vi.fn((key) => { delete store[key]; }), // Mock removeItem
    clear: vi.fn(() => { store = {}; }) // Mock clear
  };
})();

// Ganti objek global `window.localStorage` dengan `localStorageMock` kita
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- Deskripsi Suite Test ---
// `describe` mengelompokkan serangkaian test case terkait
describe('Cart Store', () => {
  let cart; // Variabel untuk menyimpan instance cart store

  // `beforeEach` akan dijalankan sebelum setiap test case individual
  beforeEach(() => {
    // 1. Inisialisasi Pinia: Penting untuk membuat instance Pinia baru
    //    sebelum setiap test agar state store terisolasi dan bersih.
    setActivePinia(createPinia());
    
    // 2. Bersihkan localStorage mock: Pastikan setiap test dimulai
    //    dengan localStorage yang kosong.
    localStorage.clear();
    
    // 3. Bersihkan semua mock functions: Mereset status panggilan mock.
    vi.clearAllMocks();
    
    // 4. Inisialisasi Cart Store: Dapatkan instance store yang akan diuji.
    cart = useCartStore();
    
    // Penting: Jika store memiliki aksi `initialize` (seperti `initializeCart`),
    // panggil di sini untuk memastikan state awal dimuat dari mock localStorage.
    cart.initializeCart();
  });

  // --- Test Cases ---

  // Test Case 1: State awal keranjang harus kosong
  it('should have an empty cart initially', () => {
    expect(cart.items).toEqual([]); // Memastikan array items kosong
    expect(cart.totalItems).toBe(0); // Memastikan total items adalah 0
    expect(cart.totalPrice).toBe(0); // Memastikan total price adalah 0
    // Memastikan `localStorage.getItem` dipanggil saat inisialisasi
    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems');
  });

  // Test Case 2: Menambahkan item baru ke keranjang
  it('should add a new item to the cart', () => {
    const item1 = { id: 1, name: 'Nasi Goreng', price: 25000, imageUrl: 'url1' };
    cart.addItem(item1); // Panggil aksi addItem

    expect(cart.items.length).toBe(1); // Memastikan ada 1 item di array
    expect(cart.items[0]).toEqual({ // Memastikan item yang ditambahkan benar
      menuId: 1, // Perhatikan ini `menuId` sesuai struktur di store
      name: 'Nasi Goreng',
      price: 25000,
      quantity: 1,
      imageUrl: 'url1'
    });
    expect(cart.totalItems).toBe(1);
    expect(cart.totalPrice).toBe(25000);
    // Memastikan `localStorage.setItem` dipanggil dengan data keranjang yang benar
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify(cart.items));
  });

  // Test Case 3: Menambah kuantitas item yang sudah ada
  it('should increase quantity if item already exists', () => {
    const item1 = { id: 1, name: 'Nasi Goreng', price: 25000, imageUrl: 'url1' };
    cart.addItem(item1); // Pertama, tambahkan item
    cart.addItem(item1); // Tambahkan item yang sama lagi

    expect(cart.items.length).toBe(1); // Array `items` masih berisi 1 jenis item unik
    expect(cart.items[0].quantity).toBe(2); // Kuantitas item seharusnya menjadi 2
    expect(cart.totalItems).toBe(2); // Total items juga 2
    expect(cart.totalPrice).toBe(50000); // Total harga (2 * 25000)
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify(cart.items));
  });

  // Test Case 4: Menghapus item dari keranjang
  it('should remove an item from the cart', () => {
    const item1 = { id: 1, name: 'Nasi Goreng', price: 25000, imageUrl: 'url1' };
    const item2 = { id: 2, name: 'Es Teh', price: 8000, imageUrl: 'url2' };
    cart.addItem(item1);
    cart.addItem(item2);
    expect(cart.items.length).toBe(2);

    cart.removeItem(1); // Hapus item dengan menuId 1 (Nasi Goreng)

    expect(cart.items.length).toBe(1); // Hanya satu item tersisa
    expect(cart.items[0].menuId).toBe(2); // Memastikan yang tersisa adalah Es Teh
    expect(cart.totalItems).toBe(1);
    expect(cart.totalPrice).toBe(8000);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify(cart.items));
  });

  // Test Case 5: Mengurangi kuantitas item yang ada
  it('should decrease item quantity', () => {
    const item1 = { id: 1, name: 'Nasi Goreng', price: 25000, imageUrl: 'url1' };
    cart.addItem(item1); // Kuantitas: 1
    cart.addItem(item1); // Kuantitas: 2

    cart.updateItemQuantity(1, 1); // Ubah kuantitas item 1 menjadi 1

    expect(cart.items[0].quantity).toBe(1);
    expect(cart.totalItems).toBe(1);
    expect(cart.totalPrice).toBe(25000);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify(cart.items));
  });

  // Test Case 6: Menghapus item jika kuantitas diupdate menjadi 0 atau kurang
  it('should remove item if quantity is updated to 0 or less', () => {
    const item1 = { id: 1, name: 'Nasi Goreng', price: 25000, imageUrl: 'url1' };
    cart.addItem(item1); // Kuantitas: 1

    cart.updateItemQuantity(1, 0); // Ubah kuantitas item 1 menjadi 0

    expect(cart.items.length).toBe(0); // Item seharusnya sudah terhapus
    expect(cart.totalItems).toBe(0);
    expect(cart.totalPrice).toBe(0);
    // Memastikan localStorage diupdate menjadi array kosong
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', '[]');
  });

  // Test Case 7: Mengosongkan seluruh keranjang
  it('should clear the entire cart', () => {
    cart.addItem({ id: 1, name: 'Nasi Goreng', price: 25000, imageUrl: 'url1' });
    cart.addItem({ id: 2, name: 'Es Teh', price: 8000, imageUrl: 'url2' });
    expect(cart.items.length).toBe(2);

    cart.clearCart(); // Panggil aksi clearCart

    expect(cart.items.length).toBe(0);
    expect(cart.totalItems).toBe(0);
    expect(cart.totalPrice).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', '[]');
  });

  // Test Case 8: Memuat keranjang dari localStorage saat inisialisasi
  it('should load cart from localStorage on initialization', () => {
    // Siapkan data di localStorage mock sebelum inisialisasi store
    const savedItems = [{ menuId: 3, name: 'Ayam Bakar', price: 35000, quantity: 1, imageUrl: 'url3' }];
    localStorage.setItem('cartItems', JSON.stringify(savedItems));

    // Buat instance store baru dan panggil inisialisasi
    const newCartInstance = useCartStore();
    newCartInstance.initializeCart();

    expect(newCartInstance.items).toEqual(savedItems);
    expect(newCartInstance.totalItems).toBe(1);
    expect(newCartInstance.totalPrice).toBe(35000);
    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems'); // Memastikan getItem dipanggil
  });

  // Test Case 9: getItemById getter
  it('getItemById getter should return the correct item or undefined', () => {
    cart.addItem({ id: 1, name: 'Nasi Goreng', price: 25000, imageUrl: 'url1' });
    
    // Temukan item yang ada
    const foundItem = cart.getItemById(1);
    expect(foundItem).toEqual({ menuId: 1, name: 'Nasi Goreng', price: 25000, quantity: 1, imageUrl: 'url1' });

    // Coba temukan item yang tidak ada
    const notFoundItem = cart.getItemById(99);
    expect(notFoundItem).toBeUndefined();
  });
});