// __tests__/stores/auth.test.js

import { setActivePinia, createPinia } from 'pinia'; // Untuk inisialisasi Pinia di setiap test
import { useAuthStore } from '../../src/stores/auth'; // Impor store yang akan diuji
import axios from 'axios'; // Impor axios untuk di-mock

// Impor fungsi dari Vitest (framework pengujian)
import { describe, it, expect, beforeEach, vi } from 'vitest';

// --- Mock axios ---
// Kita akan meniru (mock) modul axios agar panggilan HTTP tidak benar-benar dilakukan
// saat menjalankan test. Ini membuat test lebih cepat dan independen.
vi.mock('axios');

// --- Mock localStorage ---
// Sama seperti di cart.test.js, kita membuat mock dari localStorage
// agar test tidak memengaruhi atau bergantung pada localStorage di browser sebenarnya.
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
describe('Auth Store', () => {
  let auth; // Variabel untuk menyimpan instance auth store

  // `beforeEach` akan dijalankan sebelum setiap test case individual
  beforeEach(() => {
    // 1. Inisialisasi Pinia: Penting untuk membuat instance Pinia baru
    //    sebelum setiap test agar state store terisolasi dan bersih.
    setActivePinia(createPinia());
    
    // 2. Bersihkan localStorage mock: Pastikan setiap test dimulai
    //    dengan localStorage yang kosong.
    localStorage.clear();
    
    // 3. Bersihkan semua mock functions: Mereset status panggilan mock (axios dan localStorage).
    vi.clearAllMocks();
    
    // 4. Inisialisasi Auth Store: Dapatkan instance store yang akan diuji.
    auth = useAuthStore();
  });

  // --- Test Cases ---

  // Test Case 1: State awal harus menunjukkan tidak terautentikasi
  it('should be unauthenticated initially', () => {
    expect(auth.isAuthenticated).toBe(false); // Awalnya tidak terautentikasi
    expect(auth.user).toBe(null); // Objek user null
    expect(auth.token).toBe(null); // Token null
    // Memastikan localStorage.getItem dipanggil saat store diinisialisasi
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });

  // Test Case 2: Login berhasil sebagai pengguna biasa
  it('should successfully log in a regular user', async () => {
    const mockUser = { id: 1, username: 'testuser', password: 'password123', role: 'user' };
    // Mock respons API untuk panggilan axios.get agar simulasi berhasil
    axios.get.mockResolvedValueOnce({ data: [mockUser] }); 

    // Panggil aksi login
    await auth.login('testuser', 'password123');

    expect(auth.isAuthenticated).toBe(true); // Seharusnya sudah terautentikasi
    expect(auth.user).toEqual(mockUser); // Objek user harus sesuai mock
    // Token harus sesuai format simulasi
    expect(auth.token).toBe(`fake-jwt-token-${mockUser.id}-${mockUser.role}`);
    
    // Memastikan data disimpan ke localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    expect(localStorage.setItem).toHaveBeenCalledWith('token', `fake-jwt-token-${mockUser.id}-${mockUser.role}`);
    
    // Memastikan axios.get dipanggil dengan URL yang benar
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/users?username=testuser&password=password123');
  });

  // Test Case 3: Login gagal karena kredensial salah (API mengembalikan data kosong)
  it('should fail to log in with incorrect credentials', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Mock respons API kosong

    // Harapkan aksi login akan melempar error dengan pesan tertentu
    await expect(auth.login('wronguser', 'wrongpass')).rejects.toThrow('Username atau password salah.');

    expect(auth.isAuthenticated).toBe(false); // Masih tidak terautentikasi
    expect(auth.user).toBe(null);
    expect(auth.token).toBe(null);
    expect(localStorage.setItem).not.toHaveBeenCalled(); // Tidak ada yang disimpan ke localStorage
  });

  // Test Case 4: Login gagal karena error API (misal: masalah jaringan)
  it('should fail to log in due to API error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error')); // Mock respons API gagal

    // Harapkan aksi login akan melempar error dengan pesan dari mock axios
    await expect(auth.login('testuser', 'password123')).rejects.toThrow('Network Error');

    expect(auth.isAuthenticated).toBe(false); // Masih tidak terautentikasi
    expect(auth.user).toBe(null);
    expect(auth.token).toBe(null);
    expect(localStorage.setItem).not.toHaveBeenCalled(); // Tidak ada yang disimpan
  });

  // Test Case 5: Logout berhasil
  it('should log out the user successfully', () => {
    // Simulasikan bahwa user sudah login sebelumnya
    auth.user = { id: 1, username: 'testuser', role: 'user' };
    auth.token = 'fake-token-123';
    auth.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify(auth.user));
    localStorage.setItem('token', auth.token);

    auth.logout(); // Panggil aksi logout

    expect(auth.isAuthenticated).toBe(false); // State harus kembali ke tidak terautentikasi
    expect(auth.user).toBe(null);
    expect(auth.token).toBe(null);
    
    // Memastikan item dihapus dari localStorage
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  // Test Case 6: `initializeAuth` harus memuat user dari localStorage
  it('should load user from localStorage on initializeAuth', () => {
    const storedUser = { id: 2, username: 'adminuser', role: 'admin' };
    const storedToken = 'fake-admin-token';
    // Siapkan data di localStorage mock
    localStorage.setItem('user', JSON.stringify(storedUser));
    localStorage.setItem('token', storedToken);

    auth.initializeAuth(); // Panggil initializeAuth

    expect(auth.isAuthenticated).toBe(true); // Seharusnya terautentikasi
    expect(auth.user).toEqual(storedUser); // User harus sesuai dengan yang disimpan
    expect(auth.token).toBe(storedToken); // Token harus sesuai dengan yang disimpan
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });

  // Test Case 7: `initializeAuth` harus membersihkan state jika tidak ada data di localStorage
  it('should clear state if no user data in localStorage on initializeAuth', () => {
    // Pastikan localStorage kosong (sudah dijamin oleh beforeEach)
    localStorage.clear();

    // Simulasikan state yang mungkin tidak bersih dari test sebelumnya (untuk robustness)
    auth.user = { id: 1, username: 'olduser', role: 'user' };
    auth.token = 'oldtoken';
    auth.isAuthenticated = true;

    auth.initializeAuth(); // Panggil initializeAuth

    expect(auth.isAuthenticated).toBe(false); // State harus bersih
    expect(auth.user).toBe(null);
    expect(auth.token).toBe(null);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
  });

  // --- Test Cases untuk Getters (Role Check) ---

  // Test Case 8: `isAdmin` getter harus mengembalikan true untuk user admin
  it('isAdmin getter should return true for admin user', () => {
    auth.user = { id: 1, username: 'admin', role: 'admin' };
    expect(auth.isAdmin).toBe(true);
    expect(auth.isKaryawan).toBe(false); // Pastikan yang lain false
    expect(auth.isUser).toBe(false);
  });

  // Test Case 9: `isKaryawan` getter harus mengembalikan true untuk user karyawan
  it('isKaryawan getter should return true for karyawan user', () => {
    auth.user = { id: 2, username: 'staff', role: 'karyawan' };
    expect(auth.isKaryawan).toBe(true);
    expect(auth.isAdmin).toBe(false);
    expect(auth.isUser).toBe(false);
  });

  // Test Case 10: `isUser` getter harus mengembalikan true untuk user biasa
  it('isUser getter should return true for regular user', () => {
    auth.user = { id: 3, username: 'customer', role: 'user' };
    expect(auth.isUser).toBe(true);
    expect(auth.isAdmin).toBe(false);
    expect(auth.isKaryawan).toBe(false);
  });

  // Test Case 11: Getters harus mengembalikan false jika tidak ada user yang login
  it('getters should return false if no user is logged in', () => {
    auth.user = null; // Pastikan user adalah null
    expect(auth.isAdmin).toBe(false);
    expect(auth.isKaryawan).toBe(false);
    expect(auth.isUser).toBe(false);
  });
});