<template>
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="logo">FoodOrder</router-link>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/restaurants">Restaurants</router-link></li>
          <li><router-link to="/cart">Cart</router-link></li>
          <li><router-link to="/orders">Orders</router-link></li>
          <li><router-link to="/profile">Profile</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/register">Register</router-link></li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  }
  </script>
  
  <style scoped>
  .navbar {
    background-color: #ff6347;
    padding: 1rem 0;
    color: white;
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }
  
  .nav-links {
    list-style: none;
    display: flex;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }
  
  .nav-links li {
    display: inline;
  }
  
  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
  }
  
  .nav-links a:hover {
    text-decoration: underline;
  }
  </style>
  