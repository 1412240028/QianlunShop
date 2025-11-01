// js/checkout.js - Checkout Functionality
class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('qianlun_cart')) || [];
        this.shippingCost = 0;
        this.discount = 0;
        this.init();
    }

    init() {
        this.displayCheckoutItems();
        this.calculateTotals();
        this.setupEventListeners();
        this.updateCartCount();
    }

    displayCheckoutItems() {
        const checkoutItems = document.getElementById('checkoutItems');
        
        if (this.cart.length === 0) {
            checkoutItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Keranjang Kosong</h3>
                    <p>Silakan tambahkan produk ke keranjang terlebih dahulu</p>
                    <a href="products.html" class="btn btn-primary">Belanja Sekarang</a>
                </div>
            `;
            return;
        }

        checkoutItems.innerHTML = this.cart.map(item => `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${this.formatCategory(item.category)}</p>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <div class="item-total">${this.formatPrice(item.price * item.quantity)}</div>
            </div>
        `).join('');
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Update shipping cost based on selection
        const shippingSelect = document.getElementById('shipping');
        if (shippingSelect) {
            this.updateShippingCost(shippingSelect.value);
        }

        const grandTotal = subtotal + this.shippingCost - this.discount;

        // Update DOM
        document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('shippingCost').textContent = this.formatPrice(this.shippingCost);
        document.getElementById('grandTotal').textContent = this.formatPrice(grandTotal);
    }

    updateShippingCost(method) {
        switch(method) {
            case 'regular':
                this.shippingCost = 25000;
                break;
            case 'express':
                this.shippingCost = 50000;
                break;
            case 'same-day':
                this.shippingCost = 75000;
                break;
            default:
                this.shippingCost = 0;
        }
        this.calculateTotals();
    }

    setupEventListeners() {
        // Shipping method change
        const shippingSelect = document.getElementById('shipping');
        if (shippingSelect) {
            shippingSelect.addEventListener('change', (e) => {
                this.updateShippingCost(e.target.value);
            });
        }

        // Payment method change
        const paymentMethods = document.querySelectorAll('input[name="payment"]');
        const creditCardForm = document.getElementById('creditCardForm');
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                if (e.target.value === 'creditCard') {
                    creditCardForm.style.display = 'block';
                } else {
                    creditCardForm.style.display = 'none';
                }
            });
        });

        // Promo code
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => {
                this.applyPromoCode();
            });
        }

        // Place order
        const placeOrderBtn = document.getElementById('placeOrder');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.placeOrder();
            });
        }

        // Form validation
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('input', this.validateForm.bind(this));
        }
    }

    applyPromoCode() {
        const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
        const discountRules = {
            'WELCOME10': 0.1,    // 10% discount
            'DRAGON20': 0.2,     // 20% discount
            'QIANLUN15': 0.15,   // 15% discount
            'LUXURY25': 0.25     // 25% discount
        };

        if (discountRules[promoCode]) {
            const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            this.discount = subtotal * discountRules[promoCode];
            
            // Show success message
            this.showToast(`Promo code "${promoCode}" berhasil diterapkan!`, 'success');
            this.calculateTotals();
        } else {
            this.showToast('Kode promo tidak valid', 'error');
            this.discount = 0;
            this.calculateTotals();
        }
    }

    validateForm() {
        const form = document.getElementById('checkoutForm');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
            }
        });

        // Check if payment method is selected
        const paymentSelected = document.querySelector('input[name="payment"]:checked');
        if (!paymentSelected) {
            isValid = false;
        }

        // If credit card selected, validate card fields
        if (document.getElementById('creditCard').checked) {
            const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
            cardFields.forEach(field => {
                const element = document.getElementById(field);
                if (!element.value.trim()) {
                    isValid = false;
                }
            });
        }

        const placeOrderBtn = document.getElementById('placeOrder');
        placeOrderBtn.disabled = !isValid;
        
        return isValid;
    }

    async placeOrder() {
        if (!this.validateForm()) {
            this.showToast('Harap lengkapi semua field yang wajib diisi', 'error');
            return;
        }

        if (this.cart.length === 0) {
            this.showToast('Keranjang belanja kosong', 'error');
            return;
        }

        try {
            // Show loading state
            const placeOrderBtn = document.getElementById('placeOrder');
            const originalText = placeOrderBtn.innerHTML;
            placeOrderBtn.innerHTML = '🔄 Memproses...';
            placeOrderBtn.disabled = true;

            // Simulate API call
            await this.simulatePayment();

            // Create order object
            const order = {
                id: 'ORD-' + Date.now(),
                date: new Date().toISOString(),
                items: [...this.cart],
                customerInfo: this.getCustomerInfo(),
                shipping: this.getShippingInfo(),
                payment: this.getPaymentInfo(),
                totals: {
                    subtotal: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
                    shipping: this.shippingCost,
                    discount: this.discount,
                    grandTotal: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0) + this.shippingCost - this.discount
                },
                status: 'completed'
            };

            // Save order to localStorage
            this.saveOrder(order);

            // Clear cart
            this.clearCart();

            // Show success message
            this.showToast('Pesanan berhasil diproses!', 'success');

            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = `order-confirmation.html?orderId=${order.id}`;
            }, 2000);

        } catch (error) {
            console.error('Order error:', error);
            this.showToast('Terjadi kesalahan saat memproses pesanan', 'error');
            
            // Reset button
            const placeOrderBtn = document.getElementById('placeOrder');
            placeOrderBtn.innerHTML = '🛍️ Bayar Sekarang';
            placeOrderBtn.disabled = false;
        }
    }

    simulatePayment() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Payment failed'));
                }
            }, 2000);
        });
    }

    getCustomerInfo() {
        return {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value
        };
    }

    getShippingInfo() {
        const shippingSelect = document.getElementById('shipping');
        return {
            method: shippingSelect.value,
            cost: this.shippingCost,
            estimatedDelivery: this.getEstimatedDelivery(shippingSelect.value)
        };
    }

    getPaymentInfo() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const info = { method: paymentMethod };

        if (paymentMethod === 'creditCard') {
            info.cardLastFour = document.getElementById('cardNumber').value.slice(-4);
        }

        return info;
    }

    getEstimatedDelivery(method) {
        const today = new Date();
        switch(method) {
            case 'same-day':
                return new Date(today.setDate(today.getDate())).toLocaleDateString('id-ID');
            case 'express':
                return new Date(today.setDate(today.getDate() + 2)).toLocaleDateString('id-ID');
            case 'regular':
            default:
                return new Date(today.setDate(today.getDate() + 5)).toLocaleDateString('id-ID');
        }
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('qianlun_orders')) || [];
        orders.push(order);
        localStorage.setItem('qianlun_orders', JSON.stringify(orders));
    }

    clearCart() {
        localStorage.removeItem('qianlun_cart');
        this.cart = [];
        this.updateCartCount();
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    }

    formatCategory(category) {
        const categories = {
            'watch': 'Luxury Watch',
            'bag': 'Luxury Bag',
            'shoes': 'Luxury Shoes',
            'wallet': 'Luxury Wallet'
        };
        return categories[category] || category;
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}</span>
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});