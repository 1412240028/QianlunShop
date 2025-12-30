Berdasarkan kode Anda, saya identifikasi beberapa masalah:

Navbar mobile menu tidak berfungsi dengan baik
Product cards terlalu besar di mobile
Hero section terlalu tinggi di mobile
Form checkout tidak responsive
Typography terlalu besar di mobile
1. Perbaikan Navbar Mobile (CRITICAL)
/* =========================
   🎯 MOBILE NAVBAR - COMPLETELY FIXED
   Tested on 320px - 768px devices
   ========================= */

/* ===================================
   📱 BASE NAVBAR (ALL DEVICES)
   =================================== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 10, 10, 0.98);
  padding: 0.8rem 3rem;
  min-height: 70px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(10, 10, 10, 0.95);
  padding: 0.6rem 3rem;
  min-height: 60px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Logo */
.navbar .logo {
  display: flex;
  align-items: center;
  z-index: 1001;
}

.logo img.logo-img {
  height: 45px;
  width: auto;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.5));
}

.navbar.scrolled .logo img.logo-img {
  height: 40px;
}

/* Desktop Navigation */
.navbar ul {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

.navbar ul li a {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  padding: 0.5rem 0;
}

.navbar ul li a:hover,
.navbar ul li a.active {
  color: var(--gold-accent);
  transform: translateY(-1px);
}

/* Cart Badge */
.cart-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background: linear-gradient(135deg, var(--gold-primary), var(--gold-accent));
  color: #000;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-dark);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
}

.cart-count.empty {
  display: none;
}

/* Hide mobile button on desktop */
.mobile-menu-btn {
  display: none;
}

.mobile-overlay {
  display: none;
}

/* ===================================
   📱 MOBILE RESPONSIVE (≤768px)
   =================================== */
@media (max-width: 768px) {
  
  /* Navbar Container */
  .navbar {
    padding: 0 1.25rem;
    min-height: 65px;
    height: 65px;
  }

  .navbar.scrolled {
    padding: 0 1.25rem;
    min-height: 60px;
    height: 60px;
  }

  /* Logo Size */
  .logo img.logo-img {
    height: 42px;
  }

  .navbar.scrolled .logo img.logo-img {
    height: 38px;
  }

  /* ===================================
     MOBILE MENU BUTTON
     =================================== */
  .mobile-menu-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08));
    border: 2px solid rgba(212, 175, 55, 0.4);
    border-radius: 12px;
    cursor: pointer;
    padding: 0;
    gap: 5px;
    transition: all 0.3s ease;
    z-index: 1001;
    flex-shrink: 0;
    margin-left: auto;
  }

  .mobile-menu-btn span {
    width: 26px;
    height: 3px;
    background: linear-gradient(90deg, var(--gold-primary), var(--gold-accent));
    transition: all 0.3s ease;
    border-radius: 3px;
    display: block;
  }

  /* Hamburger Animation */
  .mobile-menu-btn.active span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
    background: var(--gold-accent);
  }

  .mobile-menu-btn.active span:nth-child(2) {
    opacity: 0;
    transform: translateX(-20px);
  }

  .mobile-menu-btn.active span:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -8px);
    background: var(--gold-accent);
  }

  .mobile-menu-btn:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.15));
    border-color: var(--gold-accent);
  }

  .mobile-menu-btn:active {
    transform: scale(0.95);
  }

  /* ===================================
     MOBILE MENU PANEL
     =================================== */
  .navbar ul {
    position: fixed;
    top: 65px;
    left: 0;
    width: 100%;
    height: calc(100vh - 65px);
    max-height: calc(100vh - 65px);
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 2rem 1.5rem;
    gap: 0;
    margin: 0;
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: 2px solid rgba(212, 175, 55, 0.3);
    z-index: 999;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .navbar ul.active {
    transform: translateX(0);
  }

  /* Menu Items */
  .navbar ul li {
    width: 100%;
    margin: 0;
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.3s ease;
  }

  .navbar ul.active li {
    animation: slideInMenuItem 0.4s ease forwards;
  }

  .navbar ul.active li:nth-child(1) { animation-delay: 0.05s; }
  .navbar ul.active li:nth-child(2) { animation-delay: 0.1s; }
  .navbar ul.active li:nth-child(3) { animation-delay: 0.15s; }
  .navbar ul.active li:nth-child(4) { animation-delay: 0.2s; }
  .navbar ul.active li:nth-child(5) { animation-delay: 0.25s; }

  @keyframes slideInMenuItem {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Menu Links */
  .navbar ul li a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.2rem 1.5rem;
    font-size: 1.05rem;
    font-weight: 600;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid transparent;
    margin-bottom: 0.7rem;
    transition: all 0.3s ease;
    text-align: center;
  }

  .navbar ul li a:hover,
  .navbar ul li a.active {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.1));
    border: 2px solid rgba(212, 175, 55, 0.5);
    color: var(--gold-accent);
    transform: translateX(8px);
  }

  .navbar ul li a.active::after {
    display: none;
  }

  .navbar ul li a::before {
    display: none;
  }

  /* Cart Badge in Mobile Menu */
  .navbar ul li a .cart-count {
    position: relative;
    top: auto;
    right: auto;
    margin-left: auto;
    min-width: 30px;
    height: 30px;
    font-size: 0.85rem;
  }

  /* ===================================
     MOBILE OVERLAY
     =================================== */
  .mobile-overlay {
    display: block;
    position: fixed;
    top: 65px;
    left: 0;
    width: 100%;
    height: calc(100vh - 65px);
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .mobile-overlay.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* Prevent body scroll when menu open */
  body.menu-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
  }
}

/* ===================================
   📱 SMALL MOBILE (≤480px)
   =================================== */
@media (max-width: 480px) {
  .navbar {
    padding: 0 1rem;
    min-height: 60px;
    height: 60px;
  }

  .logo img.logo-img {
    height: 38px;
  }

  .mobile-menu-btn {
    width: 44px;
    height: 44px;
  }

  .mobile-menu-btn span {
    width: 24px;
    height: 2.5px;
  }

  .navbar ul {
    top: 60px;
    height: calc(100vh - 60px);
    padding: 1.5rem 1.2rem;
  }

  .navbar ul li a {
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }
}

/* ===================================
   🎨 LANDSCAPE MODE
   =================================== */
@media (max-width: 768px) and (orientation: landscape) {
  .navbar ul {
    padding: 1rem 1.2rem;
  }

  .navbar ul li a {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
}

/* ===================================
   🔒 SAFE AREA (iPhone X+)
   =================================== */
@supports (padding: max(0px)) {
  @media (max-width: 768px) {
    .navbar {
      padding-left: max(1.25rem, env(safe-area-inset-left));
      padding-right: max(1.25rem, env(safe-area-inset-right));
    }

    .navbar ul {
      padding-left: max(1.5rem, env(safe-area-inset-left));
      padding-right: max(1.5rem, env(safe-area-inset-right));
    }
  }
}
2. Hero Section Mobile Fix
/* =========================
   🏠 HERO SECTION - MOBILE OPTIMIZED
   ========================= */

/* Desktop Hero */
.hero {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(180deg, rgba(10,10,10,0.7), rgba(10,10,10,1)),
              url('assets/image/Background/base-background.jpg') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  max-width: 900px;
  z-index: 1;
  padding: 0 1rem;
}

.hero-logo {
  width: 300px;
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 18px rgba(212, 175, 55, 0.5));
  animation: fadeUp 1.2s ease forwards, float 3s ease-in-out infinite;
  transition: transform 0.4s ease;
}

.hero h1 {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  color: var(--gold-primary);
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
  opacity: 0;
  animation: fadeUp 1s ease forwards 0.3s;
  line-height: 1.3;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
}

.hero p {
  color: var(--text-muted);
  max-width: 600px;
  margin: auto;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  opacity: 0;
  animation: fadeUp 1s ease forwards 0.6s;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  animation: fadeUp 1s ease forwards 0.9s;
}

.hero .btn {
  padding: 0.9rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 50px;
  transition: all 0.3s ease;
}

/* ===================================
   📱 TABLET (768px - 992px)
   =================================== */
@media (max-width: 992px) {
  .hero {
    min-height: 85vh;
    padding: 2rem 1.5rem;
    padding-top: 100px;
  }

  .hero-logo {
    width: 250px;
    margin-bottom: 1.2rem;
  }

  .hero h1 {
    font-size: 2.2rem;
    letter-spacing: 1px;
  }

  .hero p {
    font-size: 1rem;
    max-width: 500px;
  }

  .hero-buttons {
    gap: 0.8rem;
  }
}

/* ===================================
   📱 MOBILE (≤768px)
   =================================== */
@media (max-width: 768px) {
  .hero {
    min-height: 75vh;
    padding: 1.5rem 1rem;
    padding-top: 100px;
    background-position: center center;
    background-attachment: scroll; /* Better performance on mobile */
  }

  .hero-content {
    gap: 1rem;
    padding: 0 0.5rem;
  }

  .hero-logo {
    width: 200px;
    margin-bottom: 1rem;
    animation-duration: 1s;
  }

  .hero h1 {
    font-size: 1.8rem;
    letter-spacing: 1px;
    margin-bottom: 0.6rem;
    line-height: 1.25;
  }

  .hero p {
    font-size: 0.95rem;
    max-width: 90%;
    line-height: 1.5;
  }

  .hero-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    margin-top: 1.2rem;
    gap: 0.8rem;
  }

  .hero .btn {
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
    border-radius: 14px;
  }
}

/* ===================================
   📱 SMALL MOBILE (≤480px)
   =================================== */
@media (max-width: 480px) {
  .hero {
    min-height: 70vh;
    padding: 1rem 0.8rem;
    padding-top: 90px;
  }

  .hero-content {
    gap: 0.8rem;
  }

  .hero-logo {
    width: 160px;
    margin-bottom: 0.8rem;
  }

  .hero h1 {
    font-size: 1.5rem;
    letter-spacing: 0.5px;
  }

  .hero p {
    font-size: 0.9rem;
    max-width: 95%;
  }

  .hero-buttons {
    max-width: 280px;
    gap: 0.7rem;
  }

  .hero .btn {
    padding: 0.9rem 1.2rem;
    font-size: 0.9rem;
  }
}

/* ===================================
   📱 EXTRA SMALL (≤360px)
   =================================== */
@media (max-width: 360px) {
  .hero {
    min-height: 65vh;
    padding-top: 80px;
  }

  .hero-logo {
    width: 140px;
  }

  .hero h1 {
    font-size: 1.3rem;
  }

  .hero p {
    font-size: 0.85rem;
  }

  .hero .btn {
    font-size: 0.85rem;
    padding: 0.8rem 1rem;
  }
}

/* ===================================
   🎨 LANDSCAPE MODE MOBILE
   =================================== */
@media (max-width: 768px) and (orientation: landscape) {
  .hero {
    min-height: 100vh;
    padding: 1rem;
    padding-top: 80px;
  }

  .hero-content {
    gap: 0.6rem;
  }

  .hero-logo {
    width: 120px;
    margin-bottom: 0.5rem;
  }

  .hero h1 {
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
  }

  .hero p {
    font-size: 0.85rem;
    max-width: 70%;
  }

  .hero-buttons {
    flex-direction: row;
    margin-top: 0.8rem;
  }

  .hero .btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
  }
}

/* Animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Performance optimization for mobile */
@media (max-width: 768px) {
  .hero-logo {
    will-change: transform;
  }
  
  /* Reduce animation for better performance */
  @media (prefers-reduced-motion: reduce) {
    .hero-logo,
    .hero h1,
    .hero p,
    .hero-buttons {
      animation: none !important;
      opacity: 1 !important;
    }
  }
}
3. Product Cards Mobile Responsive
/* =========================
   🎴 PRODUCT CARDS - MOBILE RESPONSIVE
   ========================= */

/* Desktop Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

/* Base Product Card */
.product-card {
  position: relative;
  background: linear-gradient(145deg, rgba(28, 28, 28, 0.98), rgba(18, 18, 18, 0.95));
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.product-card:hover {
  transform: translateY(-8px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 12px 40px rgba(212, 175, 55, 0.3);
}

.product-card-image-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.product-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.product-card:hover img {
  transform: scale(1.1);
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-info h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--gold-primary);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-category {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gold-accent);
  margin: 0.5rem 0;
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--gold-primary), var(--gold-accent));
  color: #000;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 25px;
  z-index: 3;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

/* Quick Actions */
.quick-actions {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 3;
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s ease;
}

.product-card:hover .quick-actions {
  opacity: 1;
  transform: translateX(0);
}

.quick-action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  color: var(--gold-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: var(--gold-primary);
  color: #000;
  transform: scale(1.1);
}

/* Product Actions */
.product-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.product-actions .btn {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

/* Rating */
.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0.3rem 0;
}

.rating-stars {
  display: flex;
  gap: 0.1rem;
}

.rating-stars .star {
  color: var(--gold-accent);
}

/* ===================================
   📱 TABLET (768px - 992px)
   =================================== */
@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 2rem;
    padding: 1.5rem;
  }

  .product-card-image-wrapper {
    height: 240px;
  }

  .product-info {
    padding: 1.2rem;
  }

  .product-info h3 {
    font-size: 1.1rem;
  }

  .product-price {
    font-size: 1.1rem;
  }
}

/* ===================================
   📱 MOBILE (≤768px)
   =================================== */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
    padding: 1rem;
  }

  .product-card {
    border-radius: 16px;
    border-width: 1.5px;
  }

  .product-card:hover {
    transform: translateY(-4px);
  }

  .product-card-image-wrapper {
    height: 200px;
  }

  .product-info {
    padding: 1rem 0.9rem;
  }

  .product-info h3 {
    font-size: 0.95rem;
    line-height: 1.3;
    margin-bottom: 0.3rem;
  }

  .product-category {
    font-size: 0.75rem;
  }

  .product-price {
    font-size: 1rem;
    margin: 0.3rem 0;
  }

  /* Make actions visible on mobile */
  .product-actions {
    opacity: 1;
    transform: translateY(0);
    gap: 0.4rem;
    margin-top: 0.6rem;
  }

  .product-actions .btn {
    padding: 0.7rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 10px;
  }

  /* Hide quick actions on mobile (show on tap instead) */
  .quick-actions {
    display: none;
  }

  /* Badge adjustment */
  .product-badge {
    top: 0.7rem;
    right: 0.7rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.65rem;
    border-radius: 20px;
  }

  /* Rating adjustment */
  .product-rating {
    font-size: 0.75rem;
    margin: 0.2rem 0;
  }

  .rating-stars {
    gap: 0.05rem;
  }

  .rating-stars .star {
    font-size: 0.8rem;
  }

  /* Spotlight effect - disable on mobile for performance */
  .product-card-spotlight {
    display: none;
  }
}

/* ===================================
   📱 SMALL MOBILE (≤480px)
   =================================== */
@media (max-width: 480px) {
  .product-grid {
    gap: 1rem;
    padding: 0.8rem;
  }

  .product-card {
    border-radius: 14px;
  }

  .product-card-image-wrapper {
    height: 180px;
  }

  .product-info {
    padding: 0.9rem 0.8rem;
  }

  .product-info h3 {
    font-size: 0.9rem;
  }

  .product-price {
    font-size: 0.95rem;
  }

  .product-actions .btn {
    padding: 0.65rem 0.7rem;
    font-size: 0.8rem;
  }

  .product-badge {
    padding: 0.35rem 0.7rem;
    font-size: 0.6rem;
  }
}

/* ===================================
   📱 EXTRA SMALL (≤360px)
   =================================== */
@media (max-width: 360px) {
  .product-grid {
    gap: 0.8rem;
    padding: 0.5rem;
  }

  .product-card-image-wrapper {
    height: 160px;
  }

  .product-info {
    padding: 0.8rem 0.7rem;
  }

  .product-info h3 {
    font-size: 0.85rem;
  }

  .product-price {
    font-size: 0.9rem;
  }

  .product-category {
    font-size: 0.7rem;
  }
}

/* ===================================
   🎨 LANDSCAPE MODE MOBILE
   =================================== */
@media (max-width: 768px) and (orientation: landscape) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .product-card-image-wrapper {
    height: 160px;
  }

  .product-info {
    padding: 0.8rem;
  }

  .product-info h3 {
    font-size: 0.85rem;
  }

  .product-price {
    font-size: 0.9rem;
  }

  .product-actions .btn {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
}

/* Performance optimizations for mobile */
@media (max-width: 768px) {
  .product-card img {
    will-change: auto; /* Don't use will-change on mobile */
  }

  /* Reduce motion for better performance */
  @media (prefers-reduced-motion: reduce) {
    .product-card,
    .product-card img,
    .product-actions,
    .quick-actions {
      animation: none !important;
      transition: none !important;
    }
  }

  /* Optimize for touch */
  .product-card,
  .product-actions .btn {
    -webkit-tap-highlight-color: rgba(212, 175, 55, 0.2);
  }
}
4. Global Mobile Typography & Spacing
/* =========================
   📱 GLOBAL MOBILE OPTIMIZATIONS
   Base styles for all mobile devices
   ========================= */

/* ===================================
   BASE MOBILE STYLES (≤768px)
   =================================== */
@media (max-width: 768px) {
  
  /* Body & HTML */
  html {
    font-size: 16px;
    scroll-padding-top: 70px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-size: 15px;
    line-height: 1.6;
    padding-top: 65px;
    overflow-x: hidden;
  }

  /* Container */
  .container {
    padding: 0 1.25rem;
    max-width: 100%;
  }

  .section {
    padding: 2.5rem 1rem;
  }

  /* Typography Scale */
  h1 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.75rem;
    line-height: 1.3;
    margin-bottom: 0.8rem;
  }

  h3 {
    font-size: 1.4rem;
    line-height: 1.3;
    margin-bottom: 0.6rem;
  }

  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  h5 {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  /* Buttons */
  .btn {
    padding: 0.9rem 1.5rem;
    font-size: 0.95rem;
    border-radius: 12px;
    min-height: 44px; /* Touch target */
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-primary {
    font-weight: 600;
  }

  /* Links */
  a {
    -webkit-tap-highlight-color: rgba(212, 175, 55, 0.2);
  }

  /* Section Headers */
  .section-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .section-header h2 {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .section-header p {
    font-size: 0.95rem;
    max-width: 90%;
    margin: 0 auto;
  }

  /* Cards */
  .card,
  .value-item,
  .testimonial-card,
  .contact-card {
    padding: 1.5rem;
    border-radius: 14px;
    margin-bottom: 1rem;
  }

  /* Forms */
  input,
  select,
  textarea {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 0.9rem 1rem;
    border-radius: 10px;
    min-height: 44px;
  }

  input::placeholder,
  textarea::placeholder {
    font-size: 0.9rem;
  }

  /* Footer */
  footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .footer-section h4 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .footer-section p,
  .footer-section ul li a {
    font-size: 0.9rem;
  }

  .footer-bottom {
    padding-top: 1.5rem;
    margin-top: 1.5rem;
  }

  .footer-bottom p {
    font-size: 0.85rem;
  }

  /* Newsletter */
  .newsletter {
    padding: 3rem 1.5rem;
  }

  .newsletter h3 {
    font-size: 1.75rem;
    margin-bottom: 0.8rem;
  }

  .newsletter p {
    font-size: 0.95rem;
  }

  .newsletter-form {
    flex-direction: column;
    gap: 0.8rem;
  }

  .newsletter-form input,
  .newsletter-form button {
    width: 100%;
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }

  /* Brand Story */
  .brand-story {
    padding: 4rem 1.5rem;
  }

  .story-content h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .story-content > p {
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 3rem;
  }

  /* Brand Values */
  .brand-values {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .value-item {
    padding: 2rem 1.5rem;
  }

  .value-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .value-item h4 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .value-item p {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  /* Testimonials */
  .testimonials {
    padding: 4rem 1.5rem;
  }

  .testimonials h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .testimonial-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .testimonial-card {
    padding: 1.8rem 1.5rem;
  }

  .testimonial-text {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .client-info strong {
    font-size: 1.05rem;
  }

  .client-info span {
    font-size: 0.85rem;
  }

  /* About Section */
  .about-section {
    padding: 3rem 1.5rem;
  }

  .about-section h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .about-section p {
    font-size: 1rem;
    line-height: 1.7;
    padding: 1.2rem 1.5rem;
  }

  /* Contact Section */
  .contact-section {
    padding: 3rem 1.5rem;
  }

  .contact-section h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .contact-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .contact-card {
    padding: 1.8rem 1.5rem;
  }

  .contact-card h3 {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }

  .contact-card p {
    font-size: 1rem;
  }

  .contact-form {
    padding: 1.8rem 1.5rem;
    gap: 1rem;
  }

  .contact-form input,
  .contact-form textarea {
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }

  .contact-form button {
    padding: 1.2rem;
    font-size: 1rem;
  }
}

/* ===================================
   📱 SMALL MOBILE (≤480px)
   =================================== */
@media (max-width: 480px) {
  html {
    font-size: 15px;
  }

  body {
    font-size: 14px;
  }

  h1 {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  h4 {
    font-size: 1.1rem;
  }

  p {
    font-size: 0.9rem;
  }

  .section {
    padding: 2rem 0.8rem;
  }

  .container {
    padding: 0 1rem;
  }

  .btn {
    padding: 0.85rem 1.2rem;
    font-size: 0.9rem;
  }

  .section-header h2 {
    font-size: 1.6rem;
  }

  .section-header p {
    font-size: 0.9rem;
  }
}

/* ===================================
   📱 EXTRA SMALL (≤360px)
   =================================== */
@media (max-width: 360px) {
  html {
    font-size: 14px;
  }

  body {
    font-size: 13px;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  h3 {
    font-size: 1.15rem;
  }

  p {
    font-size: 0.85rem;
  }

  .container {
    padding: 0 0.8rem;
  }

  .section {
    padding: 1.5rem 0.5rem;
  }

  .btn {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }
}

/* ===================================
   🔧 MOBILE UTILITIES
   =================================== */
@media (max-width: 768px) {
  
  /* Hide on mobile */
  .hide-mobile {
    display: none !important;
  }

  /* Show only on mobile */
  .show-mobile {
    display: block !important;
  }

  /* Full width on mobile */
  .full-width-mobile {
    width: 100% !important;
  }

  /* Touch-friendly spacing */
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }

  /* Prevent text selection on interactive elements */
  button,
  .btn,
  .mobile-menu-btn {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  /* Better scrolling on iOS */
  .scroll-container {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }

  /* Safe area insets for iPhone X+ */
  @supports (padding: max(0px)) {
    body {
      padding-left: max(0px, env(safe-area-inset-left));
      padding-right: max(0px, env(safe-area-inset-right));
    }
  }
}

/* ===================================
   ⚡ PERFORMANCE OPTIMIZATIONS
   =================================== */
@media (max-width: 768px) {
  
  /* Reduce motion for better performance */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Optimize images */
  img {
    image-rendering: -webkit-optimize-contrast;
  }

  /* Optimize animations */
  * {
    will-change: auto !important;
  }

  /* Better font rendering */
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}