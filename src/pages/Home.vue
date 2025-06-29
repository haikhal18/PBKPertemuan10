<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay">
        <h1 class="headline">PEACE, LOVE, FOOD FOR ALL</h1>
        <button class="cta-btn" @click="goToCari">LEARN MORE</button>
      </div>
    </section>

    <!-- Sign Up / Sign In Section -->
    <section class="auth-section">
      <p class="auth-title">START EARNING BIGGER, BETTER, AND QUICKER REWARDS</p>
      <div class="auth-buttons">
        <button class="btn-outline">SIGN UP</button>
        <button class="btn-filled" @click="goToCari">SIGN IN</button>
      </div>
    </section>

    <!-- Promo Section -->
    <section class="promo-section">
      <div class="promo-text">
        <h2>TRY THE NEW STAMPEDE LIMITED TIME OFFERS!</h2>
        <p>Wrangle them while you can!</p>
        <button class="cta-btn-small" @click="goToCari">ORDER NOW</button>
      </div>
      <div class="promo-image">
        <img src="@/assets/promo.jpg" alt="Promo Makanan" />
      </div>
    </section>

    <!-- The Art of Smoking Section -->
    <section class="smoking-section">
      <div class="smoke-image">
        <img src="@/assets/smoke.jpg" alt="Daging BBQ" />
      </div>
      <div class="smoke-text">
        <h2>THE ART OF SMOKING</h2>
        <ul>
          <li><strong>BRISKET</strong> - smoked low & slow</li>
          <li><strong>CHICKEN</strong> - tender with 4R flavor</li>
          <li><strong>PORK</strong> - classic pit style perfection</li>
        </ul>
      </div>
    </section>

    <!-- Favorites Menu Section -->
    <section class="favorites-section">
      <h2>A FEW 4R FAVORITES</h2>
      <div class="favorite-list">
        <div class="favorite-item">
          <img src="@/assets/melt.jpg" alt="Burnt Ends Melt" />
          <h4>BURNT ENDS MELT</h4>
          <p>Sandwich dengan daging brisket meleleh dan keju cheddar.</p>
        </div>
        <div class="favorite-item">
          <img src="@/assets/shooter.jpg" alt="Six Shooter" />
          <h4>SIX SHOOTER</h4>
          <p>Jagung, mashed potato, daging asap, saus BBQ khas.</p>
        </div>
        <div class="favorite-item">
          <img src="@/assets/quesadilla.jpg" alt="BBQ Quesadilla" />
          <h4>BBQ QUESADILLA</h4>
          <p>Quesadilla renyah isi ayam asap dan keju leleh spesial.</p>
        </div>
      </div>
      <button class="btn-filled" @click="goToCari">VIEW FULL MENU</button>
    </section>
  </div>
  <!-- Join & Shop Section -->
<section class="join-shop-section">
  <div class="card">
    <img src="@/assets/team.jpg" alt="Join the 4R Family" />
    <div class="card-text">
      <h3>JOIN THE 4R FAMILY</h3>
      <p>We’re always looking for great talent and now accepting applications for all positions.</p>
      <button class="btn-filled-sm" @click="goToCari">BROWSE JOBS</button>
    </div>
  </div>
  <div class="card">
    <img src="@/assets/sauce.jpg" alt="4R Wherever You Are" />
    <div class="card-text">
      <h3>4R WHEREVER YOU ARE</h3>
      <p>Enjoy 4 Rivers Sauces and Foods at home, at work, and all year long.</p>
      <button class="btn-filled-sm" @click="goToCari">VISIT THE SHOP</button>
    </div>
  </div>
</section>

<!-- History Section -->
<section class="history-section">
  <h2>EST. <span class="highlight">OUR BEGINNINGS</span> 2009</h2>
  <p>
    4 Rivers Smokehouse began with the launch of the ‘Barbecue Ministry’ in 2004, when John hosted a cookout fundraiser 
    to support a local family whose young daughter was battling cancer. That one event resulted in a passion for supporting 
    local schools, churches, and charitable organizations, and a few years later, smoking thousands of pounds of meat out 
    of a garage just wouldn’t cut it anymore.
  </p>
  <p>
    After trials, tribulations, and a whole lot of burnt ends, we finally flipped that ‘Hot Brisket Now’ sign on in October of 2009. 
    Within the first hour, a line had formed out the door and then around the corner.
  </p>

  <h2 class="highlight mt-4">AWARDS AND RECOGNITION</h2>
  <p>
    4 Rivers’ concept immediately attracted local and national recognition, with two invitations to cook at the prestigious 
    James Beard House in NYC; four consecutive invitations to present at the Food Network South Beach Wine & Food Festival; 
    and appearances on NBC and FOX morning shows. He’s also been celebrated by USA Today, Paula Deen Magazine, FOOD Magazine, 
    Cooking Light, Food & Wine, Cigar Aficionado, Restaurant Business, and TravelChannel.com, and named a finalist for the Florida 
    Ernst and Young Entrepreneur of the Year Award.
  </p>
  <p>
    In 2014, John Rivers published The Southern Cowboy Cookbook, a kitchen masterpiece that’s destined to become a classic. 
    4 Rivers was named best BBQ in the Southeast by Southern Living Magazine in 2017 and one of the best BBQ brands in the 
    U.S. in 2022 by Eat This, Not That.
  </p>
</section>

</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToCari() {
      this.$router.push('/cari')
    }
  },
  mounted() {
    document.title = 'FoodOrder - Pesan Makanan Favoritmu'
  }
}
</script>

<style scoped>
.home-container {
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  padding: 0;
  color: #222;
}

/* Hero */
.hero {
  background: url('@/assets/home.jpg') center/cover no-repeat;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}
.hero-overlay {
  position: relative;
  text-align: center;
  z-index: 2;
}
.headline {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: white;
  text-transform: uppercase;
}
.cta-btn {
  background-color: #f25c05;
  color: white;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.cta-btn:hover {
  background-color: #d24c00;
}

/* Sign up / Sign in */
.auth-section {
  background: white;
  text-align: center;
  padding: 2rem 1rem;
}
.auth-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.auth-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.btn-outline {
  border: 2px solid #f25c05;
  color: #f25c05;
  padding: 0.6rem 1.5rem;
  font-weight: bold;
  border-radius: 6px;
  background: transparent;
}
.btn-outline:hover {
  background-color: #f25c05;
  color: white;
}
.btn-filled {
  background-color: #f25c05;
  color: white;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
}
.btn-filled:hover {
  background-color: #d24c00;
}

/* Promo */
.promo-section {
  display: flex;
  flex-wrap: wrap;
  background: #333;
  color: white;
  padding: 2rem;
  align-items: center;
  justify-content: space-between;
}
.promo-text {
  flex: 1;
  padding: 1rem;
}
.promo-text h2 {
  font-size: 1.8rem;
  font-weight: bold;
}
.promo-text p {
  font-size: 1rem;
  margin-bottom: 1rem;
}
.promo-image {
  flex: 1;
  display: flex;
  justify-content: center;
}
.promo-image img {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
}
.cta-btn-small {
  background-color: #f25c05;
  color: white;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
}

/* Smoking Section */
.smoking-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 2rem;
  background: #fff5f0;
}
.smoke-image {
  flex: 1;
  padding: 1rem;
}
.smoke-image img {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
}
.smoke-text {
  flex: 1;
  padding: 1rem;
}
.smoke-text h2 {
  color: #f25c05;
  font-size: 1.8rem;
}
.smoke-text ul {
  list-style: none;
  padding-left: 0;
}
.smoke-text li {
  margin-bottom: 0.8rem;
  font-weight: 500;
}

/* Favorites */
.favorites-section {
  padding: 3rem 1rem;
  text-align: center;
}
.favorites-section h2 {
  color: #f25c05;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}
.favorite-list {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.favorite-item {
  max-width: 250px;
  background: #fff;
  border: 1px solid #f25c05;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}
.favorite-item img {
  width: 100%;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
.favorite-item h4 {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.5rem 0;
}
.favorite-item p {
  font-size: 0.9rem;
  color: #555;
}

/* Join & Shop Section */
.join-shop-section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 3rem 1rem;
  background: #fff7f1;
}

.card {
  flex: 1;
  min-width: 280px;
  max-width: 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  text-align: center;
}

.card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.card-text {
  padding: 1.5rem;
}

.card-text h3 {
  color: #f25c05;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.card-text p {
  color: #444;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.btn-filled-sm {
  background-color: #f25c05;
  color: white;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-filled-sm:hover {
  background-color: #d24c00;
}

/* History Section */
.history-section {
  background: white;
  padding: 3rem 2rem;
  color: #222;
  max-width: 900px;
  margin: auto;
}

.history-section h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  text-align: left;
}

.history-section .highlight {
  color: #f25c05;
  font-weight: bold;
}

.history-section p {
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #444;
}

.mt-4 {
  margin-top: 2.5rem;
}

</style>
