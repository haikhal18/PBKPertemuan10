<template>
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h4 class="footer-title">LINKS</h4>
          <ul class="footer-list">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Gift Card Balance</a></li>
            <li><a href="#">Donation Requests</a></li>
            <li><a href="#">The 4R Foundation</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Ship Nationwide</a></li>
          </ul>
        </div>
  
        <div class="footer-section">
          <h4 class="footer-title">4 RIVERS FAMILY</h4>
          <ul class="footer-list">
            <li><a href="#">4Roots</a></li>
            <li><a href="#">4Roots Cafe</a></li>
            <li><a href="#">The Coop</a></li>
            <li><a href="#">4R Bakery and Specialty Cakes</a></li>
            <li><a href="#">4R Cantina Barbacoa Food Truck</a></li>
            <li><a href="#">4R Signature Products</a></li>
          </ul>
        </div>
  
        <div class="footer-section">
          <h4 class="footer-title">CONNECT</h4>
          <ul class="footer-list">
            <li><a href="#">CONTACT US</a></li>
            <!-- Tambahkan ikon media sosial jika diperlukan -->
          </ul>
        </div>
      </div>
  
      <div class="footer-bottom">
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <span> | </span>
          <a href="#">Terms of Use</a>
        </div>
        <div class="copyright">
          ©2025 4 Rivers Smokehouse
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer'
  }
  </script>
  
  <style scoped>
.footer {
  background-color: #222; /* Dark background like the image */
  padding: 50px 0 30px;
  font-family: 'Arial', sans-serif;
  color: #fff;
}

.footer-container {
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap;
}

.footer-section {
  margin-bottom: 30px;
  min-width: 200px;
}

.footer-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
  text-transform: uppercase; /* Uppercase titles like in the image */
  letter-spacing: 1px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 10px;
}

.footer-list a {
  color: #bbb; /* Lighter gray for links */
  text-decoration: none;
  transition: color 0.3s;
  font-size: 15px;
}

.footer-list a:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #444; /* Darker separator line */
  margin-top: 30px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.footer-links {
  margin-bottom: 15px;
}

.footer-links a {
  color: #bbb;
  text-decoration: none;
  margin: 0 10px;
  font-size: 14px;
}

.footer-links a:hover {
  color: #fff;
  text-decoration: underline;
}

.copyright {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: flex-start; /* Left align on mobile */
    text-align: left;
    padding: 0 30px;
  }
  
  .footer-section {
    margin-bottom: 25px;
    width: 100%;
  }
  
  .footer-title {
    margin-bottom: 15px;
  }
}
</style>