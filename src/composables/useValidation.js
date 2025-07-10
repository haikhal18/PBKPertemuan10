// src/composables/useValidation.js
import { reactive, computed } from 'vue';

/**
 * Sebuah composable untuk menangani validasi form dasar.
 * Menyediakan state reaktif untuk error dan fungsi untuk memicu validasi.
 */
export function useValidation() {
  // State reaktif untuk menyimpan pesan-pesan error
  const errors = reactive({});

  /**
   * Menentukan apakah form secara keseluruhan valid.
   * Ini adalah computed property yang akan reaktif terhadap perubahan di objek errors.
   */
  const isValid = computed(() => {
    // Memeriksa apakah ada properti di objek errors yang memiliki nilai (bukan string kosong)
    return Object.values(errors).every(error => !error);
  });

  /**
   * Mengatur pesan error untuk field tertentu.
   * @param {string} fieldName - Nama field input (misal: 'username', 'email').
   * @param {string} message - Pesan error yang akan ditampilkan.
   */
  const setError = (fieldName, message) => {
    errors[fieldName] = message;
  };

  /**
   * Menghapus pesan error untuk field tertentu atau semua field.
   * @param {string} [fieldName] - Opsional. Nama field yang errornya ingin dihapus.
   * Jika tidak diberikan, semua error akan dihapus.
   */
  const clearError = (fieldName) => {
    if (fieldName) {
      errors[fieldName] = '';
    } else {
      // Mengosongkan semua properti di objek errors
      Object.keys(errors).forEach(key => {
        errors[key] = '';
      });
    }
  };

  /**
   * Fungsi validasi umum untuk string tidak kosong.
   * @param {string} value - Nilai yang akan divalidasi.
   * @param {string} fieldName - Nama field.
   * @param {string} [errorMessage] - Pesan error kustom jika validasi gagal.
   * @returns {boolean} True jika valid, false jika tidak.
   */
  const validateRequired = (value, fieldName, errorMessage = `${fieldName} wajib diisi.`) => {
    if (!value || value.trim() === '') {
      setError(fieldName, errorMessage);
      return false;
    }
    clearError(fieldName);
    return true;
  };

  /**
   * Fungsi validasi umum untuk format email.
   * @param {string} value - Nilai email yang akan divalidasi.
   * @param {string} fieldName - Nama field (misal: 'email').
   * @param {string} [errorMessage] - Pesan error kustom jika validasi gagal.
   * @returns {boolean} True jika valid, false jika tidak.
   */
  const validateEmail = (value, fieldName, errorMessage = 'Format email tidak valid.') => {
    if (!value || !/\S+@\S+\.\S+/.test(value)) {
      setError(fieldName, errorMessage);
      return false;
    }
    clearError(fieldName);
    return true;
  };

  /**
   * Fungsi validasi umum untuk panjang minimum string.
   * @param {string} value - Nilai yang akan divalidasi.
   * @param {string} fieldName - Nama field.
   * @param {number} minLength - Panjang minimum yang dibutuhkan.
   * @param {string} [errorMessage] - Pesan error kustom jika validasi gagal.
   * @returns {boolean} True jika valid, false jika tidak.
   */
  const validateMinLength = (value, fieldName, minLength, errorMessage = `${fieldName} minimal ${minLength} karakter.`) => {
    if (value && value.length < minLength) {
      setError(fieldName, errorMessage);
      return false;
    }
    clearError(fieldName);
    return true;
  };

  /**
   * Fungsi validasi untuk konfirmasi password.
   * @param {string} password - Password utama.
   * @param {string} confirmPassword - Konfirmasi password.
   * @param {string} fieldName - Nama field (misal: 'confirmPassword').
   * @param {string} [errorMessage] - Pesan error kustom.
   * @returns {boolean} True jika cocok, false jika tidak.
   */
  const validatePasswordConfirmation = (password, confirmPassword, fieldName, errorMessage = 'Konfirmasi password tidak cocok.') => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError(fieldName, errorMessage);
      return false;
    }
    clearError(fieldName);
    return true;
  };

  /**
   * Fungsi validasi untuk angka positif (misal: harga, jumlah tamu).
   * @param {number} value - Nilai angka.
   * @param {string} fieldName - Nama field.
   * @param {number} [minValue=0] - Nilai minimum yang diizinkan (default 0).
   * @param {string} [errorMessage] - Pesan error kustom.
   * @returns {boolean} True jika valid, false jika tidak.
   */
  const validatePositiveNumber = (value, fieldName, minValue = 0, errorMessage = `${fieldName} harus angka positif (minimal ${minValue}).`) => {
    if (isNaN(value) || value === null || value < minValue) {
      setError(fieldName, errorMessage);
      return false;
    }
    clearError(fieldName);
    return true;
  };

  // Mengembalikan errors state dan fungsi-fungsi validasi
  return {
    errors,
    isValid,
    setError,
    clearError,
    validateRequired,
    validateEmail,
    validateMinLength,
    validatePasswordConfirmation,
    validatePositiveNumber,
  };
}