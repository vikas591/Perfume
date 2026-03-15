/* Product Data */
const products = [
    {
        id: 1,
        name: "Midnight Rose",
        brand: "Veess'Essence",
        price: 3500,
        image: "./assets/midnight_rose.png",
        description: "A mysterious blend of brooding florals and dark musk."
    },
    {
        id: 2,
        name: "Ocean Breeze",
        brand: "Veess'Essence",
        price: 2800,
        image: "./assets/ocean_breeze.png",
        description: "Fresh aquatic notes perfect for daily wear."
    },
    {
        id: 3,
        name: "Golden Amber",
        brand: "Veess'Essence",
        price: 4200,
        image: "./assets/golden_amber.png",
        description: "Rich, warm amber notes with a hint of vanilla."
    },
    {
        id: 4,
        name: "Citrus Grove",
        brand: "Veess'Essence",
        price: 2500,
        image: "./assets/citrus_grove.png",
        description: "Zesty lemon and orange blossom scent."
    },
    {
        id: 5,
        name: "Velvet Santal",
        brand: "Veess'Essence",
        price: 5000,
        image: "./assets/velvet_santal.png",
        description: "Smooth sandalwood with spicy undertones."
    },
    {
        id: 6,
        name: "Jasmine Bloom",
        brand: "Veess'Essence",
        price: 3200,
        image: "./assets/jasmine_bloom.png",
        description: "Intoxicating white floral fragrance."
    },
    {
        id: 7,
        name: "Royal Oud",
        brand: "Veess'Essence",
        price: 5500,
        image: "./assets/royal_oud.png",
        description: "A majestic blend of agarwood and rare spices."
    },
    {
        id: 8,
        name: "Vanilla Dreams",
        brand: "Veess'Essence",
        price: 2900,
        image: "./assets/vanilla_dreams.png",
        description: "Warm vanilla bean with a touch of creamy caramel."
    },
    {
        id: 9,
        name: "Wild Orchid",
        brand: "Veess'Essence",
        price: 3800,
        image: "./assets/wild_orchid.png",
        description: "Exotic orchid notes combined with subtle fruitiness."
    }
];

/* State Management */
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

/* Initialization */
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    if (document.getElementById('product-grid')) {
        renderProducts();
    }

    if (document.getElementById('checkout-items')) {
        renderCheckout();
    }

    if (document.getElementById('wishlist-grid')) {
        renderWishlistPage();
    }

    updateCartCount();
    updateWishlistCount();
    setupCartInteractions();

    // Check login status on load
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        // Re-verify specific elements existing before updating
        if (document.getElementById('profile-name')) {
            updateProfileView();
        }
    }
});

/* Wishlist Page Rendering */
function renderWishlistPage() {
    const grid = document.getElementById('wishlist-grid');
    const emptyMsg = document.getElementById('empty-wishlist');

    // Filter products that are in the wishlist array
    const wishlistItems = products.filter(p => wishlist.includes(p.id));

    if (wishlistItems.length === 0) {
        grid.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyMsg.style.display = 'none';

    grid.innerHTML = wishlistItems.map(product => {
        return `
        <div class="product-card">
            <button class="wishlist-remove-btn" onclick="removeFromWishlistPage(${product.id})">
                <i class="fas fa-times"></i>
            </button>
            <div class="product-image" style="padding-top: 80%;">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="brand-name">${product.brand}</div>
                <h3 class="product-name" style="font-size: 1rem;">${product.name}</h3>
                <div class="product-price">₹${product.price}</div>
                <a href="index.html" class="btn-primary" style="padding: 8px 15px; font-size: 0.8rem;">View Product</a>
            </div>
        </div>
        `;
    }).join('');
}

function removeFromWishlistPage(id) {
    const index = wishlist.indexOf(id);
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        renderWishlistPage();
        showToast('Removed from Wishlist');
    }
}

/* Product Rendering (Home Page) */
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(product => {
        const isWishlisted = wishlist.includes(product.id) ? 'active' : '';
        return `
        <div class="product-card">
            <button class="wishlist-btn ${isWishlisted}" onclick="toggleWishlist(${product.id}, this)">
                <i class="fas fa-heart"></i>
            </button>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="brand-name">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price" id="price-${product.id}">₹${product.price}</div>
                
                <div class="size-selector">
                    <button class="size-btn" onclick="selectSize(this, ${product.id}, 10)">10ml</button>
                    <button class="size-btn" onclick="selectSize(this, ${product.id}, 30)">30ml</button>
                    <button class="size-btn active" onclick="selectSize(this, ${product.id}, 50)">50ml</button>
                    <button class="size-btn" onclick="selectSize(this, ${product.id}, 100)">100ml</button>
                </div>

                <div class="quantity-controls" style="justify-content: center; margin-bottom: 15px;">
                   <button class="qty-btn" onclick="adjustProductQty('minus', ${product.id})">-</button>
                   <span id="qty-display-${product.id}" style="margin: 0 10px;">1</span>
                   <button class="qty-btn" onclick="adjustProductQty('plus', ${product.id})">+</button>
                </div>

                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
        `;
    }).join('');
}

/* Interaction Logic */
function selectSize(btn, productId, size) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const product = products.find(p => p.id === productId);
    const priceDisplay = document.getElementById(`price-${productId}`);

    let multiplier = 1;
    if (size === 10) multiplier = 0.25;
    if (size === 30) multiplier = 0.7;
    if (size === 100) multiplier = 1.8;

    const newPrice = Math.round(product.price * multiplier);
    priceDisplay.textContent = `₹${newPrice}`;
    priceDisplay.dataset.currentPrice = newPrice;
    priceDisplay.dataset.currentSize = size;
}

function adjustProductQty(action, productId) {
    const qtySpan = document.getElementById(`qty-display-${productId}`);
    let currentQty = parseInt(qtySpan.textContent);

    if (action === 'plus') {
        currentQty++;
    } else if (action === 'minus' && currentQty > 1) {
        currentQty--;
    }

    qtySpan.textContent = currentQty;
}

function toggleWishlist(id, btn) {
    const index = wishlist.indexOf(id);
    if (index === -1) {
        wishlist.push(id);
        btn.classList.add('active');
        showToast('Added to Wishlist');
    } else {
        wishlist.splice(index, 1);
        btn.classList.remove('active');
        showToast('Removed from Wishlist');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const count = wishlist.length;
    document.querySelectorAll('.wishlist-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

/* Cart Logic */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const priceEl = document.getElementById(`price-${productId}`);
    const qtyEl = document.getElementById(`qty-display-${productId}`);
    const sizeEl = priceEl.parentElement.querySelector('.size-selector .active');

    const price = parseInt(priceEl.dataset.currentPrice || product.price);
    const size = sizeEl ? sizeEl.textContent : '50ml';
    const quantity = parseInt(qtyEl.textContent);

    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, name: product.name, brand: product.brand, image: product.image, price: price, size: size, quantity: quantity });
    }

    saveCart();
    updateCartCount();
    renderCartItems(); // If sidebar is open
    showToast('Added to Cart!');
    openCart(); // Auto open cart on add
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
    renderCheckout(); // If on checkout page
    updateCartCount();
}

function updateCartQty(index, change) {
    const item = cart[index];
    if (change === 'plus') {
        item.quantity++;
    } else if (change === 'minus') {
        item.quantity--;
        if (item.quantity < 1) {
            removeFromCart(index);
            return;
        }
    }
    saveCart();
    renderCartItems();
    renderCheckout(); // If on checkout page
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

/* Cart Sidebar/Modal UI */
function toggleCart() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');

    if (sidebar.classList.contains('show')) {
        renderCartItems();
    }
}

function openCart() {
    document.querySelector('.cart-sidebar').classList.add('show');
    document.querySelector('.cart-overlay').classList.add('show');
    renderCartItems();
}

function renderCartItems() {
    const container = document.querySelector('.cart-items');
    if (!container) return; // Guard for checkout page where this might not exist the same way

    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center" style="margin-top: 20px; color: #888;">Your cart is empty.</p>';
        totalEl.textContent = '₹0';
        return;
    }

    let total = 0;

    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">Size: ${item.size}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateCartQty(${index}, 'minus')">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQty(${index}, 'plus')">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    totalEl.textContent = `₹${total}`;
}

function setupCartInteractions() {
    // In non-module scripts, functions are global, but we kept this pattern
    // just in case.
}

/* Checkout Logic */
function renderCheckout() {
    const container = document.getElementById('checkout-items');
    if (!container) return;

    const totalEl = document.getElementById('checkout-total');

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty. <a href="index.html" style="color: var(--primary-color);">Return to shop</a></p>';
        totalEl.textContent = '₹0';
        return;
    }

    let total = 0;

    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
        <div class="summary-item">
            <div>
                <strong>${item.name}</strong> x ${item.quantity}
                <div style="font-size: 0.8em; color: #666;">Size: ${item.size}</div>
            </div>
            <span>₹${itemTotal}</span>
        </div>
        `;
    }).join('');

    totalEl.textContent = `₹${total}`;
}

/* WhatsApp Integration */
function placeOrder(event) {
    event.preventDefault();

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        // Using confirm/alert as requested for a "popmsg"
        if (confirm('You must be logged in to place an order. Would you like to login now?')) {
            toggleAuthModal();
        }
        return;
    }

    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    // UPI Transaction ID Validation
    const upiIdInput = document.getElementById('upi-id');
    const upiId = upiIdInput.value.trim();
    if (!upiId) {
        showToast('Please enter UPI Transaction ID!', 'error');
        upiIdInput.focus();
        return;
    }

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const pincode = document.getElementById('pincode').value;

    // Get Selected Payment Method
    const paymentMethodEl = document.querySelector('input[name="payment-method"]:checked');
    /* Native validation handles required check now */

    let paymentMethod = paymentMethodEl ? paymentMethodEl.value : null;

    if (!paymentMethod) {
        // Native validation failed or bypassed, show inline error
        const paymentSection = document.querySelector('.payment-section');
        paymentSection.style.border = "2px solid var(--danger-color)";

        const errorMsg = document.getElementById('payment-error');
        if (errorMsg) errorMsg.style.display = 'block';

        paymentSection.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Clear errors if valid
    const paymentSection = document.querySelector('.payment-section');
    if (paymentSection) {
        paymentSection.style.border = "";
    }
    const errorMsg = document.getElementById('payment-error');
    if (errorMsg) errorMsg.style.display = 'none';

    if (paymentMethod === 'Others') {
        const otherInput = document.getElementById('other-payment-details');
        const otherDetails = otherInput.value.trim();

        if (!otherDetails) {
            showToast('Please specify your payment method!', 'error');
            otherInput.focus();
            return;
        }
        paymentMethod += ` (${otherDetails})`;
    }

    // Calculate Total
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // --- Save Order to LocalStorage ---
    const order = {
        id: 'ORD-' + Date.now(), // Simple unique ID
        userEmail: user.email,
        date: new Date().toISOString(),
        items: cart,
        total: total,
        paymentMethod: paymentMethod,
        shipping: {
            name, phone, address, city, pincode
        },
        upiId: upiId,
        status: 'Placed'
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    // ----------------------------------

    // Construct Message
    let message = `*New Order from Veess'Essence Parfums*\n\n`;
    message += `*Order ID:* ${order.id}\n`;
    message += `*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}, ${city} - ${pincode}\n\n`;
    message += `*Order Summary:*\n`;

    cart.forEach(item => {
        message += `- ${item.name} (${item.size}) x ${item.quantity}: ₹${item.price * item.quantity}\n`;
    });

    message += `\n*Total Amount: ₹${total}*\n`;
    message += `*Payment Method:* ${paymentMethod}\n`;
    message += `*UPI Transaction ID:* ${upiId}\n\n`;
    message += `*IMPORTANT:* Customer has been notified to send payment screenshot.`;

    // Encode Message
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "919443656854"; // Replace with your number or keep generic

    // Redirect
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

    // Show explicit success message on site
    alert(`Order Placed Successfully!\n\nYour Order ID is: ${order.id}\n\nYou can view your order in "My Orders".`);

    // Optional: Redirect to orders page or clear cart
    cart = [];
    saveCart();
    window.location.href = 'orders.html';
}

function toggleOtherInput() {
    const otherRadio = document.querySelector('input[name="payment-method"][value="Others"]');
    const otherDiv = document.getElementById('other-payment-div');
    if (otherRadio && otherRadio.checked) {
        otherDiv.style.display = 'block';
    } else {
        otherDiv.style.display = 'none';
        document.getElementById('other-payment-details').value = ''; // Clear input when hidden
    }
}

/* Utility */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeftColor = type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)';
    toast.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* Auth Modal Logic */
function toggleAuthModal() {
    const modal = document.getElementById('auth-modal');
    const overlay = document.getElementById('auth-modal-overlay');

    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
        overlay.classList.remove('show');
    } else {
        // If user is logged in, show profile tab directly
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            switchAuthTab('profile');
        } else {
            switchAuthTab('login');
        }
        modal.classList.add('show');
        overlay.classList.add('show');
    }
}

function switchAuthTab(tabName) {
    // Clear all forms when switching tabs
    document.querySelectorAll('.auth-pane form').forEach(form => form.reset());

    // Update Tab Buttons
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === tabName) {
            btn.classList.add('active');
        }
    });

    // Update Content Panes
    document.querySelectorAll('.auth-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // If profile tab selected, refresh profile info
    if (tabName === 'profile') {
        updateProfileView();
    }

    // Hide tabs if in forgot mode to reduce clutter
    const tabButtons = document.querySelector('.auth-tabs');
    if (tabName === 'forgot') {
        tabButtons.style.display = 'none';
    } else {
        tabButtons.style.display = 'flex';
    }
}

// Close modal when clicking outside
document.getElementById('auth-modal-overlay').addEventListener('click', toggleAuthModal);

// Update nav icon to trigger modal
if (document.querySelector('.nav-icons .fa-user')) {
    document.querySelector('.nav-icons .fa-user').parentElement.onclick = (e) => {
        e.preventDefault();
        toggleAuthModal();
    };
}

/* Auth Logic with LocalStorage */
function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Login Success
        const sessionUser = {
            name: user.name,
            email: user.email,
            phone: user.phone
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        showToast('Logged in successfully!');
        e.target.reset();
        switchAuthTab('profile');
    } else {
        // Login Failed
        showToast('Invalid email or password!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    // Assuming order: Name, Email, Password, Phone based on HTML structure
    // HTML: Name (0), Email (1), Password (2), Phone (3)
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value; // Capture password
    const phone = inputs[3].value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showToast('Email already registered!', 'error');
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password, // In a real app, this should be hashed!
        phone: phone,
        joined: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login
    const sessionUser = {
        name: name,
        email: email,
        phone: phone
    };
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));

    showToast('Registration successful! Welcome.');
    e.target.reset();
    switchAuthTab('profile');
}

function handleForgotPassword(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const newPassword = e.target.querySelector('input[type="password"]').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        showToast('Email not found!', 'error');
        return;
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    showToast('Password reset successful! Please login.');
    e.target.reset();
    switchAuthTab('login');
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    showToast('Logged out');
    updateProfileView();
    switchAuthTab('login');
}

function updateProfileView() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const detailsDiv = document.getElementById('profile-details');
    const placeholderDiv = document.getElementById('profile-placeholder');

    if (user) {
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        // Check if element exists before setting
        const phoneEl = document.getElementById('profile-phone');
        if (phoneEl) {
            phoneEl.textContent = user.phone || 'Not provided';
        }

        detailsDiv.style.display = 'block';
        placeholderDiv.style.display = 'none';

        // Hide Login/Register tabs when logged in
        document.querySelectorAll('.auth-tab')[0].style.display = 'none';
        document.querySelectorAll('.auth-tab')[1].style.display = 'none';
    } else {
        detailsDiv.style.display = 'none';
        placeholderDiv.style.display = 'block';

        // Show Login/Register tabs
        document.querySelectorAll('.auth-tab')[0].style.display = 'block';
        document.querySelectorAll('.auth-tab')[1].style.display = 'block';
    }
}
