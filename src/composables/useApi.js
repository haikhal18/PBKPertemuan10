// src/composables/useApi.js
import axios from 'axios';

// Base URL API json-server
const API_BASE_URL = 'http://localhost:3000';

/**
 * --- USER/AUTH API FUNCTIONS ---
 */

// Registrasi user (digunakan di halaman register)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.response && error.response.status === 409) {
      throw new Error('Registration failed: Username or email already exists.');
    }
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

// Tambah user oleh admin (bisa dipisah logikanya jika perlu)
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Gagal menambahkan user baru.');
  }
};

// Ambil semua user
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Ambil user berdasarkan ID
export const fetchUsersById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Hapus user
export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * --- MENU API FUNCTIONS ---
 */
export const fetchAllMenus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all menus:', error);
    throw error;
  }
};

export const createMenu = async (menuData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/menu`, menuData);
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenu = async (id, menuData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/menu/${id}`, menuData);
    return response.data;
  } catch (error) {
    console.error(`Error updating menu item with ID ${id}:`, error);
    throw error;
  }
};

export const deleteMenu = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/menu/${id}`);
  } catch (error) {
    console.error(`Error deleting menu item with ID ${id}:`, error);
    throw error;
  }
};

/**
 * --- ORDER API FUNCTIONS ---
 */
export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const fetchOrdersByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for user ID ${userId}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/orders/${id}`);
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * --- RESERVATION API FUNCTIONS ---
 */
export const fetchAllReservations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    throw error;
  }
};

export const createReservation = async (reservationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reservations`, reservationData);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const updateReservation = async (id, reservationData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/reservations/${id}`, reservationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation with ID ${id}:`, error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/reservations/${id}`);
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    throw error;
  }
};

/**
 * --- GALLERY API FUNCTIONS ---
 */
export const fetchGalleryItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gallery`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

/**
 * --- SETTINGS API FUNCTIONS ---
 */
export const fetchSettings = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/settings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching settings with ID ${id}:`, error);
    throw error;
  }
};

export const updateSettings = async (id, settingsData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/settings/${id}`, settingsData);
    return response.data;
  } catch (error) {
    console.error(`Error updating settings with ID ${id}:`, error);
    throw error;
  }
};

/**
 * --- CONTACT MESSAGE API FUNCTIONS ---
 */
export const sendContactForm = async (messageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contact-messages`, {
      ...messageData,
      timestamp: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error sending contact form:', error);
    throw error;
  }
};

/**
 * --- TESTIMONIAL API FUNCTIONS ---
 */
export const fetchTestimonials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/testimonials`);
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

/**
 * Fetches all tables.
 * @returns {Promise<Array<Object>>} An array of table objects.
 */
export const fetchAllTables = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tables`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

// useApi.js
export const updateTable = async (tableId, data) => {
  // Implementasi fungsi updateTable
  try {
    const response = await fetch(`/api/tables/${tableId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating table:', error);
    throw error;
  }
};

/**
* Fetches a single reservation by ID. * @param {number} id - The ID of the reservation to fetch.
* @returns {Promise<Object>} The reservation object.
\*/
export const fetchReservationById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation with ID ${id}:`, error);
      throw error;
    }
  };