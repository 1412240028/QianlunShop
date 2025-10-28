// -------------------- ANIMASI & SCROLL --------------------
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-appear');
  });
  
  const ctaBtn = document.getElementById('cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      const produkSection = document.querySelector('.produk-preview');
      produkSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // -------------------- DARK MODE --------------------
  const darkToggle = document.getElementById('dark-mode-toggle');
  darkToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
    darkToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  });
  
  window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if (darkToggle) darkToggle.textContent = '☀️';
    }
  });
  
  // -------------------- CART FUNCTIONALITY --------------------
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartBtn = document.getElementById('cart-btn');
  const cartContainer = document.getElementById('cart-container');
  const closeCart = document.getElementById('close-cart');
  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function renderCart() {
    if (!cartItemsList || !cartTotal) return;
  
    cartItemsList.innerHTML = '';
    let total = 0;
  
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.nama} 
        <span>Rp ${item.harga.toLocaleString()}</span>
        <button onclick="removeItem(${index})">✕</button>
      `;
      cartItemsList.appendChild(li);
      total += item.harga;
    });
  
    cartTotal.innerText = 'Rp ' + total.toLocaleString();
    saveCart();
  }
  
  function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
  }
  
  cartBtn?.addEventListener('click', () => {
    cartContainer.classList.toggle('hidden');
  });
  closeCart?.addEventListener('click', () => {
    cartContainer.classList.add('hidden');
  });
  
  document.querySelectorAll('.btn-beli').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const nama = card.querySelector('h3').innerText;
      const hargaText = card.querySelector('p').innerText.replace(/[^\d]/g, '');
      const harga = parseInt(hargaText) || 0;
  
      cart.push({ nama, harga });
      renderCart();
      showNotif(`${nama} berhasil ditambahkan ke keranjang!`);
    });
  });
  
  // -------------------- MODAL DETAIL PRODUK --------------------
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const closeModal = document.getElementById('close-modal');
  const modalAdd = document.getElementById('modal-add');
  let currentProduct = null;
  
  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const nama = card.querySelector('h3').innerText;
      const harga = card.querySelector('p').innerText;
  
      currentProduct = { nama, harga };
      modalTitle.innerText = nama;
      modalPrice.innerText = harga;
      modal.classList.remove('hidden');
    });
  });
  
  closeModal?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  modalAdd?.addEventListener('click', () => {
    if (!currentProduct) return;
    const harga = parseInt(currentProduct.harga.replace(/[^\d]/g, ''));
    cart.push({ nama: currentProduct.nama, harga });
    renderCart();
    showNotif(`${currentProduct.nama} berhasil ditambahkan ke keranjang!`);
    modal.classList.add('hidden');
  });
  
  // -------------------- SEARCH PRODUK --------------------
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keyup', () => {
      const filter = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll('.produk-container .card');
      cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(filter) ? 'block' : 'none';
      });
    });
  }
  
  // -------------------- NOTIFIKASI --------------------
  const notif = document.getElementById('notif');
  function showNotif(message) {
    if (!notif) return;
    notif.innerText = message;
    notif.classList.remove('hidden');
    notif.classList.add('show');
    setTimeout(() => {
      notif.classList.remove('show');
      notif.classList.add('hidden');
    }, 2500);
  }
  
  // Render awal cart
  renderCart();
  