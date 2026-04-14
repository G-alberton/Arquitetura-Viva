/* ============================================
   CART.JS — Arquitetura Viva
   Lógica Global do Carrinho e Drawer
   ============================================ */

class CartSystem {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('av_cart')) || [];
        this.drawer = null;
        this.overlay = null;
        this.init();
    }

    init() {
        this.createDrawerUI();
        this.updateCartUI();
        this.setupEventListeners();
    }

    createDrawerUI() {
        // Create Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'cart-overlay';
        document.body.appendChild(this.overlay);

        // Create Drawer
        this.drawer = document.createElement('div');
        this.drawer.className = 'cart-drawer';
        this.drawer.innerHTML = `
            <div class="cart-header">
                <h2>Seu Carrinho</h2>
                <button class="btn-close-cart" id="closeCart">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="cart-items" id="cartItemsList">
                <!-- Items will be injected here -->
            </div>
            <div class="cart-footer" id="cartFooter">
                <div class="cart-total-row">
                    <span class="cart-total-label">SUBTOTAL</span>
                    <span class="cart-total-value" id="cartSubtotal">R$ 0</span>
                </div>
                <button class="btn-checkout" id="goToCheckout">FINALIZAR COMPRA</button>
            </div>
        `;
        document.body.appendChild(this.drawer);
    }

    setupEventListeners() {
        // Open cart on icon click
        const cartBtn = document.getElementById('cartBtn') || document.querySelector('.nav-cart');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }

        // Close cart
        document.getElementById('closeCart').addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());

        // Checkout button
        document.getElementById('goToCheckout').addEventListener('click', () => {
            if (this.items.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Seu carrinho está vazio.');
            }
        });

        // Global Add to Cart listener (for dynamically added buttons)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart, .btn-quick-add, #btnModalCart');
            if (btn) {
                const name = btn.dataset.productName || document.getElementById('modalProductName')?.textContent;
                const price = parseInt(btn.dataset.productPrice) || parseInt(document.getElementById('modalPrice')?.textContent.replace(/\D/g, ''));
                const img = btn.dataset.productImg || document.getElementById('modalProductImg')?.src;

                if (name && price) {
                    this.addItem({ name, price, img, qty: 1 });
                    this.open();
                }
            }
        });
    }

    addItem(product) {
        const existing = this.items.find(item => item.name === product.name);
        if (existing) {
            existing.qty += 1;
        } else {
            this.items.push(product);
        }
        this.save();
        this.updateCartUI();
    }

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.save();
        this.updateCartUI();
    }

    updateQty(name, delta) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                this.removeItem(name);
            } else {
                this.save();
                this.updateCartUI();
            }
        }
    }

    save() {
        localStorage.setItem('av_cart', JSON.stringify(this.items));
    }

    open() {
        this.drawer.classList.add('open');
        this.overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.drawer.classList.remove('open');
        this.overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    updateCartUI() {
        const list = document.getElementById('cartItemsList');
        const footer = document.getElementById('cartFooter');
        const countEl = document.getElementById('cartCount');
        
        if (this.items.length === 0) {
            list.innerHTML = `
                <div class="cart-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
            footer.style.display = 'none';
            if (countEl) countEl.classList.remove('visible');
        } else {
            footer.style.display = 'block';
            list.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.img || 'image/product-armchair.jpg'}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">R$ ${item.price.toLocaleString('pt-BR')}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="cart.updateQty('${item.name}', -1)">-</button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn" onclick="cart.updateQty('${item.name}', 1)">+</button>
                        </div>
                    </div>
                    <button class="btn-remove-item" onclick="cart.removeItem('${item.name}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `).join('');

            const total = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            document.getElementById('cartSubtotal').textContent = `R$ ${total.toLocaleString('pt-BR')}`;
            
            if (countEl) {
                countEl.textContent = this.items.reduce((sum, item) => sum + item.qty, 0);
                countEl.classList.add('visible');
            }
        }
    }
}

// Initialize globally
window.cart = new CartSystem();
