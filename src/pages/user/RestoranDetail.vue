<template>
  <div class="restaurant-detail-page">
    <!-- Restaurant Header -->
    <div class="restaurant-header" :style="{ backgroundImage: `url(${restaurant.image})` }">
      <div class="header-overlay">
        <div class="container">
          <h1>{{ restaurant.name }}</h1>
          <p class="restaurant-description">{{ restaurant.description }}</p>
          <div class="restaurant-meta">
            <span class="rating">
              <i class="fas fa-star"></i> 4.8
            </span>
            <span class="address">
              <i class="fas fa-map-marker-alt"></i> {{ restaurant.address }}
            </span>
            <span class="status" :class="{ open: restaurant.isOpen }">
              {{ restaurant.isOpen ? 'BUKA SEKARANG' : 'TUTUP' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Owner Actions -->
      <div v-if="user?.role === 'penjual' && isOwner" class="owner-actions">
        <button @click="goToAddMenu" class="action-button primary">
          <i class="fas fa-plus"></i> Tambah Menu
        </button>
      </div>

      <!-- Menu Section -->
      <div class="menu-section">
        <h2 class="section-title">
          <i class="fas fa-utensils"></i> Daftar Menu
        </h2>

        <div v-if="restaurant.menu?.length === 0" class="empty-menu">
          <img src="https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png" alt="No menu">
          <p>Belum ada menu yang tersedia</p>
          <button v-if="user?.role === 'penjual' && isOwner" @click="goToAddMenu" class="action-button primary">
            Tambah Menu Pertama
          </button>
        </div>

        <div class="menu-grid">
          <div v-for="item in restaurant.menu" :key="item.id" class="menu-card">
            <div class="menu-image">
              <img :src="item.image || 'https://via.placeholder.com/300x200?text=Menu'" :alt="item.name">
            </div>
            
            <div class="menu-content">
              <div class="menu-header">
                <h3>{{ item.name }}</h3>
                <span class="price">Rp{{ item.price.toLocaleString() }}</span>
              </div>
              
              <div class="menu-meta">
                <span class="category">{{ item.category === 'makanan' ? '🍲 Makanan' : '🥤 Minuman' }}</span>
                <span class="stock" :class="{ low: item.stock < 5 }">
                  <i class="fas fa-box"></i> Stok: {{ item.stock }}
                </span>
              </div>

              <!-- User Actions -->
              <div v-if="user?.role === 'user'" class="user-actions">
                <button 
                  @click="addToCart(item)"
                  class="action-button primary"
                  :disabled="item.stock <= 0"
                >
                  <i class="fas fa-cart-plus"></i> Tambah
                </button>
              </div>

              <!-- Owner Actions -->
              <div v-else-if="user?.role === 'penjual' && isOwner" class="owner-actions">
                <button @click="startEditMenu(item)" class="action-button edit">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button @click="increaseStock(item)" class="action-button stock">
                  <i class="fas fa-plus"></i> Stok
                </button>
                <button @click="deleteMenu(item)" class="action-button delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Edit Form (Overlay) -->
            <div v-if="editingMenuId === item.id" class="edit-overlay">
              <div class="edit-form">
                <h3>Edit Menu</h3>
                <div class="form-group">
                  <label>Nama Menu</label>
                  <input v-model="editForm.name" type="text">
                </div>
                <div class="form-group">
                  <label>Harga</label>
                  <input v-model.number="editForm.price" type="number" min="0">
                </div>
                <div class="form-group">
                  <label>Kategori</label>
                  <select v-model="editForm.category">
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Gambar (URL)</label>
                  <input v-model="editForm.image" type="text">
                </div>
                <div class="form-actions">
                  <button @click="saveEditMenu(item)" class="action-button primary">
                    <i class="fas fa-save"></i> Simpan
                  </button>
                  <button @click="cancelEdit" class="action-button cancel">
                    <i class="fas fa-times"></i> Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'RestoranDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const restaurant = ref({ menu: [] })
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const user = authStore.user
    const isOwner = ref(false)

    const editingMenuId = ref(null)
    const editForm = reactive({
      name: '',
      price: 0,
      category: 'makanan',
      image: ''
    })

    const fetchRestaurant = async () => {
      try {
        const id = route.params.id
        const res = await axios.get(`http://localhost:3000/restaurants/${id}`)
        restaurant.value = {
          ...res.data,
          isOpen: Math.random() > 0.3 // Demo data
        }

        if (user?.role === 'penjual' && restaurant.value.ownerId === user.id) {
          isOwner.value = true
        }
      } catch (err) {
        console.error('Gagal mengambil restoran:', err)
      }
    }

    const addToCart = (item) => {
      if (item.stock <= 0) {
        alert('Stok habis!')
        return
      }

      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        stock: item.stock,
        restoId: restaurant.value.id,
        restaurantName: restaurant.value.name
      }

      cartStore.addItem(cartItem)
      item.stock -= 1
    }

    const goToAddMenu = () => {
      router.push(`/restoran/${restaurant.value.id}/tambah-menu`)
    }

    const startEditMenu = (item) => {
      editingMenuId.value = item.id
      editForm.name = item.name
      editForm.price = item.price
      editForm.category = item.category
      editForm.image = item.image
    }

    const cancelEdit = () => {
      editingMenuId.value = null
    }

    const saveEditMenu = async (item) => {
      if (!editForm.name || editForm.price <= 0) {
        alert('Nama dan harga harus diisi dengan benar.')
        return
      }

      const index = restaurant.value.menu.findIndex(m => m.id === item.id)
      if (index !== -1) {
        restaurant.value.menu[index] = {
          ...restaurant.value.menu[index],
          name: editForm.name,
          price: editForm.price,
          category: editForm.category,
          image: editForm.image || 'https://via.placeholder.com/300x200?text=Menu'
        }
      }

      try {
        await axios.put(`http://localhost:3000/restaurants/${restaurant.value.id}`, restaurant.value)
        editingMenuId.value = null
      } catch (err) {
        alert('Gagal memperbarui menu!')
        console.error(err)
      }
    }

    const increaseStock = async (item) => {
      const tambahan = parseInt(prompt('Tambah stok berapa?', 1))
      if (isNaN(tambahan) || tambahan <= 0) return

      item.stock += tambahan

      try {
        await axios.put(`http://localhost:3000/restaurants/${restaurant.value.id}`, restaurant.value)
      } catch (err) {
        alert('Gagal memperbarui stok!')
        console.error(err)
      }
    }

    const deleteMenu = async (item) => {
      if (!confirm(`Yakin ingin menghapus menu "${item.name}"?`)) return

      restaurant.value.menu = restaurant.value.menu.filter(m => m.id !== item.id)

      try {
        await axios.put(`http://localhost:3000/restaurants/${restaurant.value.id}`, restaurant.value)
      } catch (err) {
        alert('Gagal menghapus menu!')
        console.error(err)
      }
    }

    onMounted(() => {
      if (!user) {
        alert('Silakan login terlebih dahulu.')
        router.push('/login')
        return
      }
      fetchRestaurant()
    })

    return {
      restaurant,
      user,
      isOwner,
      addToCart,
      goToAddMenu,
      startEditMenu,
      cancelEdit,
      saveEditMenu,
      increaseStock,
      editingMenuId,
      editForm,
      deleteMenu
    }
  }
}
</script>

<style scoped>
.restaurant-detail-page {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.restaurant-header {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  color: white;
}

.header-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7));
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.restaurant-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

.restaurant-description {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  max-width: 800px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.restaurant-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.restaurant-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.rating {
  color: #ffc107;
}

.address {
  opacity: 0.9;
}

.status {
  background: rgba(231, 76, 60, 0.8);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status.open {
  background: rgba(46, 204, 113, 0.8);
}

.owner-actions {
  margin: 2rem 0;
  text-align: right;
}

.menu-section {
  margin-top: 2rem;
  padding-bottom: 3rem;
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.section-title i {
  color: #ff7f1f;
}

.empty-menu {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.empty-menu img {
  max-width: 200px;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-menu p {
  color: #666;
  margin-bottom: 1.5rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.menu-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s;
  position: relative;
}

.menu-card:hover {
  transform: translateY(-5px);
}

.menu-image {
  height: 180px;
  position: relative;
}

.menu-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-content {
  padding: 1.2rem;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.menu-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.price {
  font-weight: bold;
  color: #ff7f1f;
  font-size: 1.1rem;
}

.menu-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.category {
  color: #666;
}

.stock {
  color: #27ae60;
}

.stock.low {
  color: #e74c3c;
}

.user-actions, .owner-actions {
  margin-top: 1rem;
}

.action-button {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button i {
  font-size: 0.9rem;
}

.action-button.primary {
  background: #ff7f1f;
  color: white;
}

.action-button.primary:hover {
  background: #e6731c;
}

.action-button.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.action-button.edit {
  background: #3498db;
  color: white;
}

.action-button.edit:hover {
  background: #2980b9;
}

.action-button.stock {
  background: #2ecc71;
  color: white;
}

.action-button.stock:hover {
  background: #27ae60;
}

.action-button.delete {
  background: #e74c3c;
  color: white;
}

.action-button.delete:hover {
  background: #c0392b;
}

.action-button.cancel {
  background: #95a5a6;
  color: white;
}

.action-button.cancel:hover {
  background: #7f8c8d;
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.edit-form {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
}

.edit-form h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
}

.form-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .restaurant-header {
    height: 300px;
  }
  
  .restaurant-header h1 {
    font-size: 2rem;
  }
  
  .menu-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>