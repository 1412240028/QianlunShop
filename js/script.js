/* QianlunShop - script.js
   - Event delegation for product actions
   - Safe localStorage handling
   - Modal, notif, cart, search, dark-mode
   - Accessibility: ESC to close modal
*/

(() => {
    // ---------- Helpers ----------
    const $ = sel => document.querySelector(sel);
    const $$ = sel => Array.from(document.querySelectorAll(sel));
    const formatRupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');
  
    // ---------- Persistent storage (safe) ----------
    const STORAGE_KEY = 'qianlun_cart_v2';
    let cart = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch (err) {
      console.error('localStorage cart corrupted, resetting.', err);
      localStorage.removeItem(STORAGE_KEY);
      cart = [];
    }
  
    // ---------- DOM elements ----------
    const cartBtn = $('#cart-btn');
    const cartContainer = $('#cart-container');
    const closeCart = $('#close-cart');
    const cartItemsList = $('#cart-items');
    const cartTotalEl = $('#cart-total');
    const checkoutBtn = $('#checkout-btn');
    const cartBadge = $('#cart-badge');
    const notifEl = $('#notif');
    const modal = $('#modal');
    const modalTitle = $('#modal-title');
    const modalPrice = $('#modal-price');
    const modalAddBtn = $('#modal-add');
    const closeModalBtn = $('#close-modal');
    const searchInput = $('#search-input') || $('#searchInput') || null;
    const darkToggle = $('#darkToggle');
  
    // ---------- Render functions ----------
    function saveCart() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error('Failed saving cart', e);
        showNotif('Gagal menyimpan cart (storage penuh).');
      }
    }
  
    function updateCartBadge() {
      if (!cartBadge) return;
      const totalQty = cart.reduce((s, it) => s + (it.qty || 1), 0);
      if (totalQty > 0) {
        cartBadge.textContent = totalQty;
        cartBadge.classList.remove('hidden');
      } else {
        cartBadge.classList.add('hidden');
      }
    }
  
    function renderCart() {
      if (!cartItemsList || !cartTotalEl) return;
      cartItemsList.innerHTML = '';
      let total = 0;
      cart.forEach((item, idx) => {
        total += (item.harga * (item.qty || 1));
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${escapeHtml(item.nama)} ${item.qty && item.qty > 1 ? `x${item.qty}` : ''}</span>
          <span>${formatRupiah(item.harga * (item.qty || 1))} <button class="remove-item" data-index="${idx}" aria-label="Hapus ${escapeHtml(item.nama)}">✕</button></span>
        `;
        cartItemsList.appendChild(li);
      });
      cartTotalEl.innerText = formatRupiah(total);
      saveCart();
      updateCartBadge();
    }
  
    function escapeHtml(s = '') {
      return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
    }
  
    // ---------- Notifications ----------
    let notifTimer = null;
    function showNotif(msg, ms = 2200) {
      if (!notifEl) return;
      notifEl.textContent = msg;
      notifEl.classList.add('show');
      if (notifTimer) clearTimeout(notifTimer);
      notifTimer = setTimeout(() => notifEl.classList.remove('show'), ms);
    }
  
    // ---------- Cart controls ----------
    cartBtn?.addEventListener('click', () => cartContainer?.classList.toggle('hidden'));
    closeCart?.addEventListener('click', () => cartContainer?.classList.add('hidden'));
  
    checkoutBtn?.addEventListener('click', () => {
      if (!cart.length) {
        showNotif('Keranjang kosong.');
        return;
      }
      // placeholder: simulate checkout
      if (confirm('Lanjutkan checkout (simulasi)?')) {
        cart = [];
        renderCart();
        showNotif('Checkout berhasil (simulasi).');
        cartContainer?.classList.add('hidden');
      }
    });
  
    function addToCart(product) {
      const idx = cart.findIndex(i => i.nama === product.nama);
      if (idx > -1) {
        cart[idx].qty = (cart[idx].qty || 1) + (product.qty || 1);
      } else {
        cart.push({ ...product, qty: product.qty || 1 });
      }
      renderCart();
      showNotif(`${product.nama} berhasil ditambahkan ke keranjang!`);
    }
  
    // Expose remove action via delegation (no global function)
    document.addEventListener('click', (e) => {
      const rem = e.target.closest('.remove-item');
      if (rem) {
        const idx = Number(rem.dataset.index);
        if (!Number.isNaN(idx)) {
          cart.splice(idx, 1);
          renderCart();
        }
      }
    });
  
    // ---------- Modal behavior ----------
    let modalProduct = null;
    document.addEventListener('click', (e) => {
      const detailBtn = e.target.closest('.btn-detail');
      if (detailBtn) {
        const card = detailBtn.closest('.product-card');
        if (!card) return;
        const name = card.dataset.name || card.querySelector('h3')?.innerText || 'Produk';
        const price = card.dataset.price || card.querySelector('p')?.innerText?.replace(/[^\d]/g, '') || '0';
        modalProduct = { nama: name, harga: Number(price) || 0 };
        if (modalTitle) modalTitle.innerText = name;
        if (modalPrice) modalPrice.innerText = formatRupiah(modalProduct.harga);
        modal?.classList.remove('hidden');
        modal?.setAttribute('aria-hidden', 'false');
        // focus for accessibility
        closeModalBtn?.focus();
      }
    });
  
    closeModalBtn?.addEventListener('click', () => {
      modal?.classList.add('hidden');
      modal?.setAttribute('aria-hidden', 'true');
    });
  
    // ESC to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modal && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          modal.setAttribute('aria-hidden', 'true');
        }
        if (cartContainer && !cartContainer.classList.contains('hidden')) {
          cartContainer.classList.add('hidden');
        }
      }
    });
  
    modalAddBtn?.addEventListener('click', () => {
      if (!modalProduct) return;
      addToCart(modalProduct);
      modal?.classList.add('hidden');
      modal?.setAttribute('aria-hidden', 'true');
    });
  
    // ---------- Add to cart (delegated) ----------
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-beli[data-action="add"]');
      if (addBtn) {
        const card = addBtn.closest('.product-card');
        if (!card) return;
        const name = card.dataset.name || card.querySelector('h3')?.innerText || 'Produk';
        const price = Number(card.dataset.price || card.querySelector('p')?.innerText?.replace(/[^\d]/g, '') || 0);
        addToCart({ nama: name, harga: price, qty: 1 });
      }
    });
  
    // ---------- Search (if exists) ----------
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        const cards = $$('.product-card');
        cards.forEach(c => {
          const title = (c.dataset.name || c.querySelector('h3')?.innerText || '').toLowerCase();
          c.style.display = title.includes(q) ? '' : 'none';
        });
      });
    }
  
    // ---------- Dark mode toggle ----------
    if (darkToggle) {
      // restore saved theme
      try {
        const saved = localStorage.getItem('theme_v1');
        if (saved === 'dark') {
          document.body.classList.add('dark-mode');
          darkToggle.checked = true;
        }
      } catch (e) { /* ignore */ }
  
      darkToggle.addEventListener('change', () => {
        const dark = !!darkToggle.checked;
        document.body.classList.toggle('dark-mode', dark);
        try { localStorage.setItem('theme_v1', dark ? 'dark' : 'light'); } catch (e) { console.error(e); }
      });
    }
  
    // ---------- Contact form handler (global called from markup) ----------
    window.handleContactSubmit = function(ev) {
      ev.preventDefault();
      const name = $('#contact-name')?.value?.trim();
      const email = $('#contact-email')?.value?.trim();
      const message = $('#contact-message')?.value?.trim();
      if (!name || !email || !message) {
        showNotif('Mohon isi semua field.');
        return;
      }
      // store last message to sessionStorage as simulation
      try {
        sessionStorage.setItem('qianlun_last_message', JSON.stringify({ name, email, message, time: new Date().toISOString() }));
      } catch (e) {
        console.error('Failed sessionStorage', e);
      }
      showNotif('Pesan terkirim (simulasi). Terima kasih, ' + name + '!');
      $('#contact-form')?.reset();
    };
  
    // ---------- Init render ----------
    renderCart();
  
    // Accessibility: ensure modal is closed by default
    if (modal) modal.setAttribute('aria-hidden', 'true');
  
    // Quick focus trap: close modal when clicking outside modal-content
    document.addEventListener('click', (e) => {
      if (modal && !modal.classList.contains('hidden') && e.target === modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  
  })();
  